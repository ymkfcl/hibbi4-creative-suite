import React, { useState, useRef, useCallback } from 'react';
import { MangaBook, MangaPage, Panel, Character, DialogueBubble, Template, MangaStyle, BookSettings } from '../types/manga';
import { MangaImageGenerator, MangaPromptGenerator, CharacterConsistency } from '../utils/mangaGenerator';
import { MangaPDFExporter } from '../utils/pdfExporter';
import Logo from './Logo';

// Composant principal du constructeur de manga
export default function MangaBuilder() {
  // État principal du manga
  const [mangaBook, setMangaBook] = useState<MangaBook>({
    id: 'manga-' + Date.now(),
    title: 'Mon Manga',
    author: 'Auteur',
    genre: 'Aventure',
    style: {
      name: 'Shonen',
      artStyle: 'shonen',
      colorScheme: 'black-white',
      lineStyle: 'thick',
      shadingStyle: 'screentone'
    },
    characters: [],
    pages: [{
      id: 'page-1',
      title: 'Page 1',
      panels: [{
        id: 'panel-1',
        prompt: '',
        dialogues: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        borderStyle: 'normal',
        effects: [],
        cameraAngle: 'medium',
        mood: 'normal'
      }],
      layout: { type: 'grid', columns: 1, rows: 1 },
      pageNumber: 1
    }],
    synopsis: '',
    settings: {
      pageSize: 'A4',
      readingDirection: 'left-to-right',
      margins: { top: 20, bottom: 20, left: 15, right: 15 },
      gutterSize: 5,
      resolution: 300
    }
  });

  // États de l'interface
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCharacterEditor, setShowCharacterEditor] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Références
  const imageGenerator = useRef(new MangaImageGenerator());
  const characterConsistency = useRef(new CharacterConsistency());
  const pdfExporter = useRef(new MangaPDFExporter());

  // Templates prédéfinis
  const templates: Template[] = [
    {
      id: 'action-scene',
      name: 'Scène d\'action',
      description: 'Layout dynamique pour les scènes de combat',
      thumbnail: '',
      category: 'action',
      panels: [
        { position: { x: 0, y: 0 }, size: { width: 60, height: 40 }, borderStyle: 'jagged', effects: [{ type: 'speed-lines', intensity: 0.8 }], cameraAngle: 'close-up', mood: 'dramatic' },
        { position: { x: 60, y: 0 }, size: { width: 40, height: 40 }, borderStyle: 'normal', effects: [], cameraAngle: 'medium', mood: 'tense' },
        { position: { x: 0, y: 40 }, size: { width: 100, height: 60 }, borderStyle: 'thick', effects: [{ type: 'impact', intensity: 1.0 }], cameraAngle: 'wide', mood: 'dramatic' }
      ]
    },
    {
      id: 'dialogue-scene',
      name: 'Scène de dialogue',
      description: 'Layout pour les conversations',
      thumbnail: '',
      category: 'dialogue',
      panels: [
        { position: { x: 0, y: 0 }, size: { width: 50, height: 50 }, borderStyle: 'normal', effects: [], cameraAngle: 'close-up', mood: 'normal' },
        { position: { x: 50, y: 0 }, size: { width: 50, height: 50 }, borderStyle: 'normal', effects: [], cameraAngle: 'close-up', mood: 'normal' },
        { position: { x: 0, y: 50 }, size: { width: 100, height: 50 }, borderStyle: 'normal', effects: [], cameraAngle: 'medium', mood: 'normal' }
      ]
    }
  ];

  // Fonctions de gestion des pages
  const addPage = useCallback(() => {
    const newPage: MangaPage = {
      id: 'page-' + Date.now(),
      title: `Page ${mangaBook.pages.length + 1}`,
      panels: [{
        id: 'panel-' + Date.now(),
        prompt: '',
        dialogues: [],
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        borderStyle: 'normal',
        effects: [],
        cameraAngle: 'medium',
        mood: 'normal'
      }],
      layout: { type: 'grid', columns: 1, rows: 1 },
      pageNumber: mangaBook.pages.length + 1
    };

    setMangaBook(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
  }, [mangaBook.pages.length]);

  const deletePage = useCallback((pageIndex: number) => {
    if (mangaBook.pages.length > 1) {
      setMangaBook(prev => ({
        ...prev,
        pages: prev.pages.filter((_, index) => index !== pageIndex)
      }));
      
      if (currentPageIndex >= pageIndex && currentPageIndex > 0) {
        setCurrentPageIndex(currentPageIndex - 1);
      }
    }
  }, [mangaBook.pages.length, currentPageIndex]);

  // Fonctions de gestion des panels
  const addPanel = useCallback(() => {
    const newPanel: Panel = {
      id: 'panel-' + Date.now(),
      prompt: '',
      dialogues: [],
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      borderStyle: 'normal',
      effects: [],
      cameraAngle: 'medium',
      mood: 'normal'
    };

    setMangaBook(prev => {
      const newPages = [...prev.pages];
      newPages[currentPageIndex].panels.push(newPanel);
      return { ...prev, pages: newPages };
    });
  }, [currentPageIndex]);

  const updatePanel = useCallback((panelId: string, updates: Partial<Panel>) => {
    setMangaBook(prev => {
      const newPages = [...prev.pages];
      const panelIndex = newPages[currentPageIndex].panels.findIndex(p => p.id === panelId);
      if (panelIndex !== -1) {
        newPages[currentPageIndex].panels[panelIndex] = {
          ...newPages[currentPageIndex].panels[panelIndex],
          ...updates
        };
      }
      return { ...prev, pages: newPages };
    });
  }, [currentPageIndex]);

  const deletePanel = useCallback((panelId: string) => {
    setMangaBook(prev => {
      const newPages = [...prev.pages];
      newPages[currentPageIndex].panels = newPages[currentPageIndex].panels.filter(p => p.id !== panelId);
      return { ...prev, pages: newPages };
    });
    
    if (selectedPanelId === panelId) {
      setSelectedPanelId(null);
    }
  }, [currentPageIndex, selectedPanelId]);

  // Génération d'images
  const generatePanelImage = useCallback(async (panelId: string) => {
    const panel = mangaBook.pages[currentPageIndex].panels.find(p => p.id === panelId);
    if (!panel || !panel.prompt.trim()) return;

    setIsGenerating(true);
    try {
      const enhancedPrompt = MangaPromptGenerator.generateContextualPrompt(
        panel.prompt,
        mangaBook.characters,
        panel.mood,
        mangaBook.style,
        panel.cameraAngle
      );

      const imageUrl = await imageGenerator.current.generatePanelImage({
        prompt: enhancedPrompt,
        style: mangaBook.style.name,
        mood: panel.mood,
        cameraAngle: panel.cameraAngle,
        width: 512,
        height: 512,
        negativePrompt: 'text, speech bubble, dialogue'
      });

      updatePanel(panelId, { generatedImage: imageUrl });
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      alert('Erreur lors de la génération de l\'image. Vérifiez que Stable Diffusion est en cours d\'exécution.');
    } finally {
      setIsGenerating(false);
    }
  }, [mangaBook, currentPageIndex, updatePanel]);

  // Génération de toutes les images de la page
  const generateAllPanelImages = useCallback(async () => {
    const currentPage = mangaBook.pages[currentPageIndex];
    setIsGenerating(true);

    try {
      for (const panel of currentPage.panels) {
        if (panel.prompt.trim() && !panel.generatedImage) {
          await generatePanelImage(panel.id);
          // Petite pause entre les générations
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } finally {
      setIsGenerating(false);
    }
  }, [mangaBook, currentPageIndex, generatePanelImage]);

  // Ajout de dialogue
  const addDialogue = useCallback((panelId: string) => {
    const newDialogue: DialogueBubble = {
      id: 'dialogue-' + Date.now(),
      text: 'Nouveau dialogue',
      type: 'speech',
      position: { x: 50, y: 20 },
      size: { width: 30, height: 15 },
      style: 'normal'
    };

    updatePanel(panelId, {
      dialogues: [...(mangaBook.pages[currentPageIndex].panels.find(p => p.id === panelId)?.dialogues || []), newDialogue]
    });
  }, [mangaBook, currentPageIndex, updatePanel]);

  // Application de template
  const applyTemplate = useCallback((template: Template) => {
    const newPanels: Panel[] = template.panels.map((templatePanel, index) => ({
      id: 'panel-' + Date.now() + '-' + index,
      prompt: '',
      generatedImage: undefined,
      dialogues: [],
      ...templatePanel
    }));

    setMangaBook(prev => {
      const newPages = [...prev.pages];
      newPages[currentPageIndex].panels = newPanels;
      return { ...prev, pages: newPages };
    });

    setShowTemplates(false);
  }, [currentPageIndex]);

  // Export PDF
  const exportToPDF = useCallback(async () => {
    try {
      const pdfBlob = await pdfExporter.current.exportMangaBook(mangaBook);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mangaBook.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Vérifiez que toutes les images sont générées.');
    }
  }, [mangaBook]);

  const currentPage = mangaBook.pages[currentPageIndex];
  const selectedPanel = selectedPanelId ? currentPage.panels.find(p => p.id === selectedPanelId) : null;

  return (
    <div className="manga-builder">
      <div className="manga-builder__header">
        <div className="header-brand">
          <Logo size="medium" variant="default" showText={true} />
          <span className="header-title">Manga Builder</span>
        </div>
        <div className="manga-builder__toolbar">
          <input
            type="text"
            value={mangaBook.title}
            onChange={(e) => setMangaBook(prev => ({ ...prev, title: e.target.value }))}
            className="manga-builder__title-input"
            placeholder="Titre du manga"
          />
          <button onClick={() => setShowCharacterEditor(true)} className="btn btn-secondary">
            👥 Personnages
          </button>
          <button onClick={() => setShowStyleEditor(true)} className="btn btn-secondary">
            🎨 Style
          </button>
          <button onClick={() => setShowTemplates(true)} className="btn btn-secondary">
            📐 Templates
          </button>
          <button onClick={exportToPDF} className="btn btn-primary">
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="manga-builder__content">
        {/* Panneau latéral gauche - Navigation des pages */}
        <div className="manga-builder__sidebar-left">
          <h3>Pages</h3>
          <div className="page-list">
            {mangaBook.pages.map((page, index) => (
              <div
                key={page.id}
                className={`page-item ${index === currentPageIndex ? 'active' : ''}`}
                onClick={() => setCurrentPageIndex(index)}
              >
                <div className="page-thumbnail">
                  <div className="page-preview">
                    {page.panels.map(panel => (
                      <div
                        key={panel.id}
                        className="panel-mini"
                        style={{
                          left: `${panel.position.x}%`,
                          top: `${panel.position.y}%`,
                          width: `${panel.size.width}%`,
                          height: `${panel.size.height}%`,
                          backgroundColor: panel.generatedImage ? '#e8f5e8' : '#f0f0f0'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <span>{page.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePage(index);
                  }}
                  className="btn-delete"
                  disabled={mangaBook.pages.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button onClick={addPage} className="btn btn-primary btn-full">
            + Nouvelle Page
          </button>
        </div>

        {/* Zone principale - Éditeur de page */}
        <div className="manga-builder__main">
          <div className="page-editor">
            <div className="page-editor__header">
              <h2>{currentPage.title}</h2>
              <div className="page-controls">
                <button onClick={addPanel} className="btn btn-secondary">
                  + Panel
                </button>
                <button 
                  onClick={generateAllPanelImages} 
                  className="btn btn-primary"
                  disabled={isGenerating}
                >
                  {isGenerating ? '⏳ Génération...' : '🎨 Générer tout'}
                </button>
              </div>
            </div>

            <div className="page-canvas">
              <div className="page-container">
                {currentPage.panels.map(panel => (
                  <div
                    key={panel.id}
                    className={`panel ${selectedPanelId === panel.id ? 'selected' : ''}`}
                    style={{
                      left: `${panel.position.x}%`,
                      top: `${panel.position.y}%`,
                      width: `${panel.size.width}%`,
                      height: `${panel.size.height}%`,
                      borderStyle: panel.borderStyle === 'none' ? 'none' : 'solid',
                      borderWidth: panel.borderStyle === 'thick' ? '3px' : '1px',
                      backgroundColor: panel.backgroundColor || '#ffffff'
                    }}
                    onClick={() => setSelectedPanelId(panel.id)}
                  >
                    {panel.generatedImage ? (
                      <img 
                        src={panel.generatedImage} 
                        alt="Panel généré" 
                        className="panel-image"
                      />
                    ) : (
                      <div className="panel-placeholder">
                        <p>{panel.prompt || 'Cliquez pour éditer'}</p>
                      </div>
                    )}

                    {/* Bulles de dialogue */}
                    {panel.dialogues.map(dialogue => (
                      <div
                        key={dialogue.id}
                        className={`dialogue-bubble dialogue-${dialogue.type}`}
                        style={{
                          left: `${dialogue.position.x}%`,
                          top: `${dialogue.position.y}%`,
                          width: `${dialogue.size.width}%`,
                          height: `${dialogue.size.height}%`
                        }}
                      >
                        {dialogue.text}
                      </div>
                    ))}

                    {/* Boutons de contrôle du panel */}
                    {selectedPanelId === panel.id && (
                      <div className="panel-controls">
                        <button
                          onClick={() => generatePanelImage(panel.id)}
                          className="btn btn-sm btn-primary"
                          disabled={isGenerating || !panel.prompt.trim()}
                        >
                          🎨
                        </button>
                        <button
                          onClick={() => addDialogue(panel.id)}
                          className="btn btn-sm btn-secondary"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => deletePanel(panel.id)}
                          className="btn btn-sm btn-danger"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panneau latéral droit - Propriétés */}
        <div className="manga-builder__sidebar-right">
          {selectedPanel ? (
            <div className="panel-properties">
              <h3>Propriétés du Panel</h3>
              
              <div className="property-group">
                <label>Prompt de génération</label>
                <textarea
                  value={selectedPanel.prompt}
                  onChange={(e) => updatePanel(selectedPanel.id, { prompt: e.target.value })}
                  placeholder="Décrivez la scène à générer..."
                  rows={4}
                />
              </div>

              <div className="property-group">
                <label>Angle de caméra</label>
                <select
                  value={selectedPanel.cameraAngle}
                  onChange={(e) => updatePanel(selectedPanel.id, { cameraAngle: e.target.value as any })}
                >
                  <option value="close-up">Gros plan</option>
                  <option value="medium">Plan moyen</option>
                  <option value="wide">Plan large</option>
                  <option value="bird-eye">Vue d'oiseau</option>
                  <option value="worm-eye">Contre-plongée</option>
                </select>
              </div>

              <div className="property-group">
                <label>Ambiance</label>
                <select
                  value={selectedPanel.mood}
                  onChange={(e) => updatePanel(selectedPanel.id, { mood: e.target.value as any })}
                >
                  <option value="normal">Normale</option>
                  <option value="dramatic">Dramatique</option>
                  <option value="action">Action</option>
                  <option value="peaceful">Paisible</option>
                  <option value="tense">Tendue</option>
                </select>
              </div>

              <div className="property-group">
                <label>Style de bordure</label>
                <select
                  value={selectedPanel.borderStyle}
                  onChange={(e) => updatePanel(selectedPanel.id, { borderStyle: e.target.value as any })}
                >
                  <option value="normal">Normale</option>
                  <option value="thick">Épaisse</option>
                  <option value="none">Aucune</option>
                  <option value="jagged">Dentelée</option>
                  <option value="rounded">Arrondie</option>
                  <option value="double">Double</option>
                </select>
              </div>

              <div className="property-group">
                <label>Position et taille</label>
                <div className="position-controls">
                  <div className="input-row">
                    <label>X:</label>
                    <input
                      type="number"
                      value={selectedPanel.position.x}
                      onChange={(e) => updatePanel(selectedPanel.id, {
                        position: { ...selectedPanel.position, x: parseInt(e.target.value) || 0 }
                      })}
                      min="0"
                      max="100"
                    />
                    <label>Y:</label>
                    <input
                      type="number"
                      value={selectedPanel.position.y}
                      onChange={(e) => updatePanel(selectedPanel.id, {
                        position: { ...selectedPanel.position, y: parseInt(e.target.value) || 0 }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="input-row">
                    <label>L:</label>
                    <input
                      type="number"
                      value={selectedPanel.size.width}
                      onChange={(e) => updatePanel(selectedPanel.id, {
                        size: { ...selectedPanel.size, width: parseInt(e.target.value) || 10 }
                      })}
                      min="10"
                      max="100"
                    />
                    <label>H:</label>
                    <input
                      type="number"
                      value={selectedPanel.size.height}
                      onChange={(e) => updatePanel(selectedPanel.id, {
                        size: { ...selectedPanel.size, height: parseInt(e.target.value) || 10 }
                      })}
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Dialogues */}
              {selectedPanel.dialogues.length > 0 && (
                <div className="property-group">
                  <label>Dialogues</label>
                  {selectedPanel.dialogues.map((dialogue, index) => (
                    <div key={dialogue.id} className="dialogue-editor">
                      <textarea
                        value={dialogue.text}
                        onChange={(e) => {
                          const newDialogues = [...selectedPanel.dialogues];
                          newDialogues[index].text = e.target.value;
                          updatePanel(selectedPanel.id, { dialogues: newDialogues });
                        }}
                        rows={2}
                      />
                      <select
                        value={dialogue.type}
                        onChange={(e) => {
                          const newDialogues = [...selectedPanel.dialogues];
                          newDialogues[index].type = e.target.value as any;
                          updatePanel(selectedPanel.id, { dialogues: newDialogues });
                        }}
                      >
                        <option value="speech">Parole</option>
                        <option value="thought">Pensée</option>
                        <option value="narration">Narration</option>
                        <option value="sound">Son</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <p>Sélectionnez un panel pour éditer ses propriétés</p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Templates de page</h2>
              <button onClick={() => setShowTemplates(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="template-grid">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className="template-card"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="template-preview">
                      {template.panels.map((panel, index) => (
                        <div
                          key={index}
                          className="template-panel"
                          style={{
                            left: `${panel.position.x}%`,
                            top: `${panel.position.y}%`,
                            width: `${panel.size.width}%`,
                            height: `${panel.size.height}%`
                          }}
                        />
                      ))}
                    </div>
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .manga-builder {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f5f5f5;
        }

        .manga-builder__header {
          background: white;
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin: 0;
        }

        .manga-builder__toolbar {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .manga-builder__title-input {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: bold;
        }

        .manga-builder__content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .manga-builder__sidebar-left,
        .manga-builder__sidebar-right {
          width: 250px;
          background: white;
          border-right: 1px solid #ddd;
          padding: 1rem;
          overflow-y: auto;
        }

        .manga-builder__sidebar-right {
          border-right: none;
          border-left: 1px solid #ddd;
        }

        .manga-builder__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .page-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .page-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-item:hover {
          background: #f0f0f0;
        }

        .page-item.active {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .page-thumbnail {
          width: 40px;
          height: 60px;
          border: 1px solid #ccc;
          position: relative;
          background: white;
        }

        .page-preview {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .panel-mini {
          position: absolute;
          border: 1px solid #999;
          min-width: 2px;
          min-height: 2px;
        }

        .btn-delete {
          background: #f44336;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 12px;
          margin-left: auto;
        }

        .btn-delete:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .page-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .page-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .page-controls {
          display: flex;
          gap: 0.5rem;
        }

        .page-canvas {
          flex: 1;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: auto;
          position: relative;
        }

        .page-container {
          position: relative;
          width: 100%;
          height: 800px;
          background: white;
        }

        .panel {
          position: absolute;
          border: 2px solid #333;
          background: #f9f9f9;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 50px;
          min-height: 50px;
        }

        .panel:hover {
          border-color: #2196f3;
        }

        .panel.selected {
          border-color: #2196f3;
          box-shadow: 0 0 10px rgba(33, 150, 243, 0.3);
        }

        .panel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .panel-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 0.5rem;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }

        .panel-controls {
          position: absolute;
          top: -30px;
          right: 0;
          display: flex;
          gap: 2px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 2px;
        }

        .dialogue-bubble {
          position: absolute;
          background: white;
          border: 2px solid #333;
          border-radius: 15px;
          padding: 0.25rem;
          font-size: 0.8rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .dialogue-thought {
          border-radius: 50%;
        }

        .dialogue-narration {
          border-radius: 4px;
          background: #f0f0f0;
        }

        .dialogue-sound {
          background: #ffeb3b;
          border-style: dashed;
        }

        .property-group {
          margin-bottom: 1rem;
        }

        .property-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .property-group input,
        .property-group select,
        .property-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .position-controls {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-row label {
          margin: 0;
          min-width: 15px;
          font-size: 0.8rem;
        }

        .input-row input {
          flex: 1;
          width: auto;
        }

        .dialogue-editor {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .dialogue-editor textarea {
          margin-bottom: 0.5rem;
        }

        .no-selection {
          text-align: center;
          color: #666;
          padding: 2rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-content {
          padding: 1rem;
          overflow-y: auto;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .template-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .template-card:hover {
          border-color: #2196f3;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .template-preview {
          position: relative;
          width: 100%;
          height: 120px;
          border: 1px solid #ccc;
          background: white;
          margin-bottom: 0.5rem;
        }

        .template-panel {
          position: absolute;
          border: 1px solid #666;
          background: #f0f0f0;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover {
          background: #1976d2;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .btn-danger {
          background: #f44336;
          color: white;
        }

        .btn-danger:hover {
          background: #d32f2f;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .btn-full {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
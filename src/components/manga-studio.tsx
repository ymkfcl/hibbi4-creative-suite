import React, { useState } from 'react';
import MangaBuilder from './MangaBuilder';
import CharacterEditor from './CharacterEditor';
import { MangaBook, Character, MangaStyle } from '../types/manga';

/**
 * Studio Manga complet avec génération d'images IA et export PDF
 */
export default function MangaStudio() {
  const [showCharacterEditor, setShowCharacterEditor] = useState(false);
  const [mangaBook, setMangaBook] = useState<MangaBook>({
    id: 'manga-' + Date.now(),
    title: 'Mon Nouveau Manga',
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

  const updateCharacters = (characters: Character[]) => {
    setMangaBook(prev => ({ ...prev, characters }));
  };

  return (
    <div className="manga-studio-container">
      <MangaBuilder />
      
      {showCharacterEditor && (
        <CharacterEditor
          characters={mangaBook.characters}
          onCharactersChange={updateCharacters}
          onClose={() => setShowCharacterEditor(false)}
        />
      )}

      <style jsx global>{`
        .manga-studio-container {
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* Styles globaux pour le manga builder */
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .modal-header button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .modal-header button:hover {
          background: #e9ecef;
          color: #333;
        }

        .modal-content {
          flex: 1;
          overflow: hidden;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          white-space: nowrap;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1976d2;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .btn-danger {
          background: #f44336;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #d32f2f;
        }

        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
        }

        .btn-full {
          width: 100%;
        }

        /* Scrollbars personnalisées */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal {
          animation: fadeIn 0.2s ease-out;
        }

        .modal > * {
          animation: slideIn 0.3s ease-out;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal {
            max-width: 95vw;
            max-height: 95vh;
          }
          
          .btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
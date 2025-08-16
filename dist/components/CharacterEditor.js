"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
function CharacterEditor({ characters, onCharactersChange, onClose }) {
    const [selectedCharacterId, setSelectedCharacterId] = (0, react_1.useState)(null);
    const [editingCharacter, setEditingCharacter] = (0, react_1.useState)(null);
    const selectedCharacter = selectedCharacterId ? characters.find(c => c.id === selectedCharacterId) : null;
    const addCharacter = () => {
        const newCharacter = {
            id: 'char-' + Date.now(),
            name: 'Nouveau personnage',
            description: '',
            visualDescription: '',
            personality: '',
            age: 20,
            gender: 'non-spécifié'
        };
        onCharactersChange([...characters, newCharacter]);
        setSelectedCharacterId(newCharacter.id);
        setEditingCharacter({ ...newCharacter });
    };
    const updateCharacter = (updates) => {
        if (!editingCharacter)
            return;
        const updatedCharacter = { ...editingCharacter, ...updates };
        setEditingCharacter(updatedCharacter);
        const newCharacters = characters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c);
        onCharactersChange(newCharacters);
    };
    const deleteCharacter = (characterId) => {
        const newCharacters = characters.filter(c => c.id !== characterId);
        onCharactersChange(newCharacters);
        if (selectedCharacterId === characterId) {
            setSelectedCharacterId(null);
            setEditingCharacter(null);
        }
    };
    const selectCharacter = (character) => {
        setSelectedCharacterId(character.id);
        setEditingCharacter({ ...character });
    };
    return (<div className="modal-overlay" onClick={onClose}>
      <div className="modal character-editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 Éditeur de personnages</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="character-editor">
            {/* Liste des personnages */}
            <div className="character-list">
              <div className="character-list-header">
                <h3>Personnages ({characters.length})</h3>
                <button onClick={addCharacter} className="btn btn-primary btn-sm">
                  + Ajouter
                </button>
              </div>
              
              <div className="character-items">
                {characters.map(character => (<div key={character.id} className={`character-item ${selectedCharacterId === character.id ? 'active' : ''}`} onClick={() => selectCharacter(character)}>
                    <div className="character-avatar">
                      {character.referenceImage ? (<img src={character.referenceImage} alt={character.name}/>) : (<div className="avatar-placeholder">
                          {character.name.charAt(0).toUpperCase()}
                        </div>)}
                    </div>
                    <div className="character-info">
                      <h4>{character.name}</h4>
                      <p>{character.age ? `${character.age} ans` : ''} {character.gender}</p>
                    </div>
                    <button onClick={(e) => {
                e.stopPropagation();
                deleteCharacter(character.id);
            }} className="btn-delete">
                      ×
                    </button>
                  </div>))}
                
                {characters.length === 0 && (<div className="empty-state">
                    <p>Aucun personnage créé</p>
                    <p>Cliquez sur "Ajouter" pour commencer</p>
                  </div>)}
              </div>
            </div>

            {/* Éditeur de personnage */}
            <div className="character-details">
              {editingCharacter ? (<div className="character-form">
                  <h3>Édition de {editingCharacter.name}</h3>
                  
                  <div className="form-group">
                    <label>Nom du personnage *</label>
                    <input type="text" value={editingCharacter.name} onChange={(e) => updateCharacter({ name: e.target.value })} placeholder="Nom du personnage"/>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Âge</label>
                      <input type="number" value={editingCharacter.age || ''} onChange={(e) => updateCharacter({ age: parseInt(e.target.value) || undefined })} placeholder="Âge" min="1" max="200"/>
                    </div>
                    <div className="form-group">
                      <label>Genre</label>
                      <select value={editingCharacter.gender || 'non-spécifié'} onChange={(e) => updateCharacter({ gender: e.target.value })}>
                        <option value="non-spécifié">Non spécifié</option>
                        <option value="masculin">Masculin</option>
                        <option value="féminin">Féminin</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description générale</label>
                    <textarea value={editingCharacter.description} onChange={(e) => updateCharacter({ description: e.target.value })} placeholder="Description générale du personnage, son rôle dans l'histoire..." rows={3}/>
                  </div>

                  <div className="form-group">
                    <label>Description visuelle *</label>
                    <textarea value={editingCharacter.visualDescription} onChange={(e) => updateCharacter({ visualDescription: e.target.value })} placeholder="Apparence physique détaillée : cheveux, yeux, taille, vêtements, style..." rows={4}/>
                    <small>Cette description sera utilisée pour la génération d'images IA</small>
                  </div>

                  <div className="form-group">
                    <label>Personnalité</label>
                    <textarea value={editingCharacter.personality} onChange={(e) => updateCharacter({ personality: e.target.value })} placeholder="Traits de personnalité, comportement, façon de parler..." rows={3}/>
                  </div>

                  <div className="form-group">
                    <label>Image de référence (optionnel)</label>
                    <input type="url" value={editingCharacter.referenceImage || ''} onChange={(e) => updateCharacter({ referenceImage: e.target.value })} placeholder="URL d'une image de référence"/>
                    {editingCharacter.referenceImage && (<div className="reference-preview">
                        <img src={editingCharacter.referenceImage} alt="Référence" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}/>
                      </div>)}
                  </div>

                  {/* Exemples de prompts générés */}
                  <div className="form-group">
                    <label>Aperçu du prompt généré</label>
                    <div className="prompt-preview">
                      <code>
                        {editingCharacter.name} ({editingCharacter.visualDescription || 'description visuelle manquante'})
                        {editingCharacter.personality && `, ${editingCharacter.personality}`}
                      </code>
                    </div>
                    <small>Ce texte sera ajouté aux prompts de génération d'images</small>
                  </div>
                </div>) : (<div className="no-selection">
                  <h3>Aucun personnage sélectionné</h3>
                  <p>Sélectionnez un personnage dans la liste pour l'éditer, ou créez-en un nouveau.</p>
                  
                  <div className="tips">
                    <h4>💡 Conseils pour créer des personnages</h4>
                    <ul>
                      <li><strong>Description visuelle détaillée :</strong> Plus vous êtes précis, plus l'IA générera des images cohérentes</li>
                      <li><strong>Cohérence :</strong> Utilisez les mêmes termes pour décrire un personnage dans tout le manga</li>
                      <li><strong>Style :</strong> Adaptez la description au style de manga choisi (shonen, shoujo, etc.)</li>
                      <li><strong>Références :</strong> Une image de référence aide à maintenir la cohérence visuelle</li>
                    </ul>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Fermer
          </button>
        </div>
      </div>

      <style jsx>{`
        .character-editor-modal {
          width: 90vw;
          max-width: 1000px;
          height: 80vh;
        }

        .character-editor {
          display: flex;
          height: 100%;
          gap: 1rem;
        }

        .character-list {
          width: 300px;
          border-right: 1px solid #ddd;
          padding-right: 1rem;
        }

        .character-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .character-list-header h3 {
          margin: 0;
        }

        .character-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .character-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .character-item:hover {
          background: #f5f5f5;
        }

        .character-item.active {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .character-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .character-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #2196f3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .character-info {
          flex: 1;
          min-width: 0;
        }

        .character-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .character-info p {
          margin: 0;
          font-size: 0.8rem;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .character-details {
          flex: 1;
          overflow-y: auto;
        }

        .character-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .character-form h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .form-group {
          flex: 1;
        }

        .form-group label {
          font-weight: bold;
          font-size: 0.9rem;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .form-group small {
          color: #666;
          font-size: 0.8rem;
          font-style: italic;
        }

        .reference-preview {
          margin-top: 0.5rem;
        }

        .reference-preview img {
          max-width: 200px;
          max-height: 150px;
          border: 1px solid #ddd;
          border-radius: 4px;
          object-fit: cover;
        }

        .prompt-preview {
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.75rem;
        }

        .prompt-preview code {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          color: #333;
          word-wrap: break-word;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .empty-state p {
          margin: 0.5rem 0;
        }

        .no-selection {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .no-selection h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .tips {
          text-align: left;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .tips h4 {
          margin: 0 0 1rem 0;
          color: #495057;
        }

        .tips ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .tips li {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .tips strong {
          color: #495057;
        }

        .modal-footer {
          padding: 1rem;
          border-top: 1px solid #ddd;
          display: flex;
          justify-content: flex-end;
        }

        .btn-delete {
          background: #f44336;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .btn-delete:hover {
          background: #d32f2f;
        }
      `}</style>
    </div>);
}
exports.default = CharacterEditor;

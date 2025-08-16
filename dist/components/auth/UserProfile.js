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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const AuthContext_1 = require("../../contexts/AuthContext");
const supabase_1 = require("../../lib/supabase");
const CreditsDisplay_1 = __importDefault(require("./CreditsDisplay"));
const Logo_1 = __importDefault(require("../Logo"));
const UserProfile = ({ isOpen, onClose }) => {
    const { user, signOut, userCredits } = (0, AuthContext_1.useAuth)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    const [userHistory, setUserHistory] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isOpen && user && activeTab === 'history') {
            loadHistory();
        }
    }, [isOpen, user, activeTab]);
    const loadHistory = async () => {
        if (!user)
            return;
        setLoading(true);
        try {
            const historyData = await supabase_1.history.getUserHistory(user.id, 50);
            setUserHistory(historyData);
        }
        catch (error) {
            console.error('Erreur chargement historique:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteGeneration = async (generationId) => {
        if (!user)
            return;
        const success = await supabase_1.history.deleteGeneration(generationId, user.id);
        if (success) {
            setUserHistory(prev => prev.filter(item => item.id !== generationId));
        }
    };
    const handleSignOut = async () => {
        await signOut();
        onClose();
    };
    if (!isOpen || !user)
        return null;
    return (<div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-title">
            <Logo_1.default size="small" variant="default" showText={false}/>
            <h2>Mon Profil</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 Vue d'ensemble
            </button>
            <button className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              🎨 Historique
            </button>
            <button className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              ⚙️ Paramètres
            </button>
          </div>

          <div className="profile-tab-content">
            {activeTab === 'overview' && (<div className="overview-tab">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3>{user.email}</h3>
                    <p>Membre depuis {new Date(user.created_at || '').toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="credits-section">
                  <h4>💎 Mes Crédits</h4>
                  <CreditsDisplay_1.default showDetails={true}/>
                </div>

                {userCredits && (<div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">🎨</div>
                      <div className="stat-info">
                        <div className="stat-number">{userCredits.total_generated}</div>
                        <div className="stat-label">Images générées</div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">📅</div>
                      <div className="stat-info">
                        <div className="stat-number">{userCredits.used_credits}</div>
                        <div className="stat-label">Utilisés aujourd'hui</div>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">⚡</div>
                      <div className="stat-info">
                        <div className="stat-number">{userCredits.daily_credits - userCredits.used_credits}</div>
                        <div className="stat-label">Restants</div>
                      </div>
                    </div>
                  </div>)}
              </div>)}

            {activeTab === 'history' && (<div className="history-tab">
                <div className="history-header">
                  <h4>🎨 Mes Créations</h4>
                  <button className="refresh-button" onClick={loadHistory} disabled={loading}>
                    {loading ? '🔄' : '↻'} Actualiser
                  </button>
                </div>

                {loading ? (<div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Chargement de l'historique...</p>
                  </div>) : userHistory.length === 0 ? (<div className="empty-state">
                    <div className="empty-icon">🎨</div>
                    <h4>Aucune création pour le moment</h4>
                    <p>Commencez à générer des images pour voir votre historique ici</p>
                  </div>) : (<div className="history-grid">
                    {userHistory.map((item) => (<div key={item.id} className="history-item">
                        <div className="history-image">
                          <img src={item.image_url} alt={item.prompt} loading="lazy"/>
                        </div>
                        <div className="history-info">
                          <p className="history-prompt">{item.prompt}</p>
                          <div className="history-meta">
                            <span className="history-date">
                              {new Date(item.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            <span className="history-credits">
                              {item.credits_used} crédit{item.credits_used > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <button className="delete-button" onClick={() => handleDeleteGeneration(item.id)} title="Supprimer">
                          🗑️
                        </button>
                      </div>))}
                  </div>)}
              </div>)}

            {activeTab === 'settings' && (<div className="settings-tab">
                <div className="settings-section">
                  <h4>👤 Informations du compte</h4>
                  <div className="setting-item">
                    <label>Email</label>
                    <input type="email" value={user.email || ''} disabled className="setting-input"/>
                  </div>
                  <div className="setting-item">
                    <label>ID Utilisateur</label>
                    <input type="text" value={user.id} disabled className="setting-input"/>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>🔒 Sécurité</h4>
                  <button className="setting-button secondary">
                    Changer le mot de passe
                  </button>
                  <button className="setting-button secondary">
                    Télécharger mes données
                  </button>
                </div>

                <div className="settings-section danger">
                  <h4>⚠️ Zone de danger</h4>
                  <button className="setting-button danger" onClick={handleSignOut}>
                    Se déconnecter
                  </button>
                </div>
              </div>)}
          </div>
        </div>

        <style jsx>{`
          .profile-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .profile-modal {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 800px;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
            display: flex;
            flex-direction: column;
          }

          .profile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid #f0f0f0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .profile-title {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .profile-title h2 {
            margin: 0;
            font-size: 1.5rem;
          }

          .close-button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s;
          }

          .close-button:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .profile-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .profile-tabs {
            display: flex;
            border-bottom: 1px solid #e9ecef;
            background: #f8f9fa;
          }

          .profile-tab {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            color: #666;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
          }

          .profile-tab.active {
            color: #00bcd4;
            border-bottom-color: #00bcd4;
            background: white;
          }

          .profile-tab:hover {
            color: #00bcd4;
          }

          .profile-tab-content {
            flex: 1;
            overflow-y: auto;
            padding: 2rem;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .user-details h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
          }

          .user-details p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
          }

          .credits-section {
            margin-bottom: 2rem;
          }

          .credits-section h4 {
            margin: 0 0 1rem 0;
            color: #333;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            background: white;
            border: 2px solid #f0f0f0;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s;
          }

          .stat-card:hover {
            border-color: #00bcd4;
            transform: translateY(-2px);
          }

          .stat-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }

          .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #00bcd4;
            margin-bottom: 0.25rem;
          }

          .stat-label {
            font-size: 0.85rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .history-header h4 {
            margin: 0;
            color: #333;
          }

          .refresh-button {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 0.5rem 1rem;
            cursor: pointer;
            transition: all 0.3s;
          }

          .refresh-button:hover {
            background: #e9ecef;
          }

          .loading-state, .empty-state {
            text-align: center;
            padding: 3rem;
            color: #666;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f0f0f0;
            border-top: 4px solid #00bcd4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          .empty-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .history-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
          }

          .history-item {
            background: white;
            border: 2px solid #f0f0f0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s;
            position: relative;
          }

          .history-item:hover {
            border-color: #00bcd4;
            transform: translateY(-2px);
          }

          .history-image {
            aspect-ratio: 1;
            overflow: hidden;
          }

          .history-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .history-info {
            padding: 1rem;
          }

          .history-prompt {
            margin: 0 0 0.5rem 0;
            font-size: 0.9rem;
            color: #333;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .history-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #666;
          }

          .delete-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s;
          }

          .history-item:hover .delete-button {
            opacity: 1;
          }

          .delete-button:hover {
            background: #fee;
            color: #c33;
          }

          .settings-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
          }

          .settings-section.danger {
            background: #fee;
            border: 1px solid #fcc;
          }

          .settings-section h4 {
            margin: 0 0 1rem 0;
            color: #333;
          }

          .setting-item {
            margin-bottom: 1rem;
          }

          .setting-item label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
          }

          .setting-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            background: #f8f9fa;
            color: #666;
          }

          .setting-button {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
            transition: all 0.3s;
          }

          .setting-button.secondary {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #e9ecef;
          }

          .setting-button.secondary:hover {
            background: #e9ecef;
          }

          .setting-button.danger {
            background: #dc3545;
            color: white;
          }

          .setting-button.danger:hover {
            background: #c82333;
          }

          @media (max-width: 768px) {
            .profile-modal {
              margin: 0;
              border-radius: 0;
              max-height: 100vh;
            }

            .profile-tabs {
              flex-direction: column;
            }

            .stats-grid {
              grid-template-columns: 1fr;
            }

            .history-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>);
};
exports.default = UserProfile;

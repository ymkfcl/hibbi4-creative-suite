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
const AuthContext_1 = require("../contexts/AuthContext");
const ImageGenerator_1 = __importDefault(require("./ImageGenerator"));
const MangaBuilder_1 = __importDefault(require("./MangaBuilder"));
const AuthModal_1 = __importDefault(require("./auth/AuthModal"));
const UserProfile_1 = __importDefault(require("./auth/UserProfile"));
const CreditsDisplay_1 = __importDefault(require("./auth/CreditsDisplay"));
const Logo_1 = __importDefault(require("./Logo"));
const CreativeStudio = () => {
    const [activeTool, setActiveTool] = (0, react_1.useState)('image-generator');
    const [showAuthModal, setShowAuthModal] = (0, react_1.useState)(false);
    const [showUserProfile, setShowUserProfile] = (0, react_1.useState)(false);
    const { user, loading } = (0, AuthContext_1.useAuth)();
    const renderToolContent = () => {
        switch (activeTool) {
            case 'image-generator':
                return <ImageGenerator_1.default />;
            case 'manga-builder':
                return <MangaBuilder_1.default />;
            default:
                return <ImageGenerator_1.default />;
        }
    };
    return (<div className="creative-studio">
      {/* Header */}
      <header className="studio-header">
        <div className="header-left">
          <Logo_1.default size="large" variant="default" showText={true}/>
          <div className="studio-title">
            <h1>Creative Studio</h1>
            <p>AI-Powered Image & Manga Creation</p>
          </div>
        </div>

        <nav className="tool-nav">
          <button className={`tool-nav-btn ${activeTool === 'image-generator' ? 'active' : ''}`} onClick={() => setActiveTool('image-generator')}>
            <span className="tool-icon">🎨</span>
            <span className="tool-label">Image Generator</span>
          </button>
          <button className={`tool-nav-btn ${activeTool === 'manga-builder' ? 'active' : ''}`} onClick={() => setActiveTool('manga-builder')}>
            <span className="tool-icon">📚</span>
            <span className="tool-label">Manga Builder</span>
          </button>
        </nav>

        <div className="header-right">
          {loading ? (<div className="loading-indicator">⏳</div>) : user ? (<div className="user-section">
              <CreditsDisplay_1.default className="header-credits"/>
              <button className="user-profile-btn" onClick={() => setShowUserProfile(true)}>
                <div className="user-avatar">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.email}</span>
              </button>
            </div>) : (<button className="auth-btn" onClick={() => setShowAuthModal(true)}>
              <span>🔐</span>
              Sign In
            </button>)}
        </div>
      </header>

      {/* Main Content */}
      <main className="studio-main">
        {renderToolContent()}
      </main>

      {/* Modals */}
      <AuthModal_1.default isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode="signin"/>

      <UserProfile_1.default isOpen={showUserProfile} onClose={() => setShowUserProfile(false)}/>

      <style jsx>{`
        .creative-studio {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
        }

        .studio-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .studio-title h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .studio-title p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .tool-nav {
          display: flex;
          gap: 0.5rem;
          background: rgba(102, 126, 234, 0.1);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .tool-nav-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #666;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tool-nav-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #333;
          transform: translateY(-2px);
        }

        .tool-nav-btn.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .tool-icon {
          font-size: 1.2rem;
        }

        .tool-label {
          font-size: 0.95rem;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .loading-indicator {
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-credits {
          font-size: 0.85rem;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border: 2px solid rgba(102, 126, 234, 0.2);
          border-radius: 25px;
          background: rgba(102, 126, 234, 0.05);
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile-btn:hover {
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .auth-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-btn:hover {
          background: linear-gradient(45deg, #5a6fd8, #6a4190);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .studio-main {
          flex: 1;
          overflow: hidden;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .studio-header {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .header-left {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .tool-nav {
            order: 1;
          }

          .header-right {
            order: 2;
          }

          .tool-nav-btn {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .tool-label {
            display: none;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </div>);
};
exports.default = CreativeStudio;

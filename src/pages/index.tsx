import React, { useState } from 'react';
import ImageGenerator from '../components/ImageGenerator';
import MangaStudio from '../components/manga-studio';
import Logo from '../components/Logo';
import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';
import UserProfile from '../components/auth/UserProfile';
import CreditsDisplay from '../components/auth/CreditsDisplay';

type ActiveTool = 'home' | 'image-generator' | 'manga-builder';

const HomeContent = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const renderContent = () => {
    switch (activeTool) {
      case 'image-generator':
        return (
          <div className="tool-container">
            <div className="tool-header">
              <h2>🎨 Générateur d'Images IA</h2>
              <p>Créez des images uniques avec l'intelligence artificielle</p>
            </div>
            <div className="image-generator-wrapper">
              <div className="prompt-input-section">
                <label htmlFor="prompt-input">Décrivez l'image que vous voulez créer :</label>
                <input
                  id="prompt-input"
                  type="text"
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="Ex: Un chat ninja dans un paysage cyberpunk, style anime"
                  className="prompt-input"
                />
              </div>
              <ImageGenerator prompt={prompt} />
            </div>
          </div>
        );
      
      case 'manga-builder':
        return <MangaStudio />;
      
      default:
        return (
          <div className="home-container">
            <div className="hero-section">
              <div className="hero-logo">
                <Logo size="xl" variant="white" showText={true} />
              </div>
              <h1 className="hero-title">Creative Suite</h1>
              <p className="hero-subtitle">
                Suite complète d'outils créatifs alimentés par l'intelligence artificielle
              </p>
              <div className="hero-description">
                <p>
                  Créez des images époustouflantes et des mangas professionnels avec la puissance 
                  de l'IA. Que vous soyez artiste, créateur de contenu ou simplement passionné, 
                  HIBBI vous offre les outils pour donner vie à votre imagination.
                </p>
              </div>
            </div>

            <div className="tools-grid">
              <div className="tool-card" onClick={() => setActiveTool('image-generator')}>
                <div className="tool-icon">🎨</div>
                <h3>Générateur d'Images IA</h3>
                <p>
                  Créez des images uniques à partir de descriptions textuelles. 
                  Supporté par Stable Diffusion avec des paramètres avancés.
                </p>
                <div className="tool-features">
                  <span className="feature-tag">✨ Génération IA</span>
                  <span className="feature-tag">⚙️ Paramètres avancés</span>
                  <span className="feature-tag">💾 Téléchargement</span>
                </div>
                <button className="tool-button">Commencer →</button>
              </div>

              <div className="tool-card" onClick={() => setActiveTool('manga-builder')}>
                <div className="tool-icon">📚</div>
                <h3>Manga Builder Pro</h3>
                <p>
                  Créez des mangas complets avec génération d'images IA, 
                  gestion des personnages et export PDF professionnel.
                </p>
                <div className="tool-features">
                  <span className="feature-tag">👥 Personnages</span>
                  <span className="feature-tag">📐 Templates</span>
                  <span className="feature-tag">📄 Export PDF</span>
                </div>
                <button className="tool-button">Créer un manga →</button>
              </div>
            </div>

            <div className="features-section">
              <h2>🚀 Fonctionnalités Principales</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">🤖</div>
                  <h4>Intelligence Artificielle</h4>
                  <p>Génération d'images haute qualité avec Stable Diffusion</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎭</div>
                  <h4>Styles Multiples</h4>
                  <p>Shonen, Shoujo, Seinen, réaliste, fantastique et plus</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <h4>Génération Rapide</h4>
                  <p>Résultats en quelques secondes avec mode démo intégré</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🛠️</div>
                  <h4>Outils Professionnels</h4>
                  <p>Interface intuitive avec contrôles avancés</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">📱</div>
                  <h4>Responsive</h4>
                  <p>Fonctionne parfaitement sur desktop et mobile</p>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <h4>Mode Démo</h4>
                  <p>Testez sans installation avec des placeholders intelligents</p>
                </div>
              </div>
            </div>

            <div className="getting-started-section">
              <h2>🎯 Comment Commencer</h2>
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Choisissez votre outil</h4>
                    <p>Générateur d'images pour des créations rapides ou Manga Builder pour des projets complets</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Configurez (optionnel)</h4>
                    <p>Installez Stable Diffusion pour la génération IA réelle, ou utilisez le mode démo</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Créez et partagez</h4>
                    <p>Générez vos créations et exportez-les en haute qualité</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="status-section">
              <h2>📊 État du Système</h2>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-indicator online"></div>
                  <div>
                    <h4>Interface Web</h4>
                    <p>Opérationnelle</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-indicator demo"></div>
                  <div>
                    <h4>Mode Démo</h4>
                    <p>Disponible</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-indicator" id="sd-status"></div>
                  <div>
                    <h4>Stable Diffusion</h4>
                    <p id="sd-status-text">Vérification...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Vérification du statut de Stable Diffusion
  React.useEffect(() => {
    const checkStableDiffusion = async () => {
      try {
        const response = await fetch('http://127.0.0.1:7860/sdapi/v1/samplers', {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          const statusIndicator = document.getElementById('sd-status');
          const statusText = document.getElementById('sd-status-text');
          if (statusIndicator && statusText) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Connecté';
          }
        }
      } catch (error) {
        const statusIndicator = document.getElementById('sd-status');
        const statusText = document.getElementById('sd-status-text');
        if (statusIndicator && statusText) {
          statusIndicator.className = 'status-indicator offline';
          statusText.textContent = 'Non disponible';
        }
      }
    };

    if (activeTool === 'home') {
      checkStableDiffusion();
    }
  }, [activeTool]);

  return (
    <div className="app">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-content">
          <Logo 
            size="large" 
            variant="default" 
            showText={true}
            onClick={() => setActiveTool('home')}
          />
          
          <nav className="main-nav">
            <button 
              className={`nav-button ${activeTool === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTool('home')}
            >
              🏠 Accueil
            </button>
            <button 
              className={`nav-button ${activeTool === 'image-generator' ? 'active' : ''}`}
              onClick={() => setActiveTool('image-generator')}
            >
              🎨 Générateur d'Images
            </button>
            <button 
              className={`nav-button ${activeTool === 'manga-builder' ? 'active' : ''}`}
              onClick={() => setActiveTool('manga-builder')}
            >
              📚 Manga Builder
            </button>
          </nav>

          <div className="header-auth">
            {loading ? (
              <div className="nav-loading">⏳</div>
            ) : user ? (
              <div className="nav-user">
                <CreditsDisplay className="nav-credits" />
                <button 
                  className="user-button"
                  onClick={() => setShowUserProfile(true)}
                  title="Mon profil"
                >
                  <div className="user-avatar">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-email">{user.email}</span>
                </button>
              </div>
            ) : (
              <div className="nav-auth">
                <button 
                  className="auth-button signin"
                  onClick={() => setShowAuthModal(true)}
                >
                  🔐 Se connecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {renderContent()}
      </main>

      {/* Footer */}
      {activeTool === 'home' && (
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <Logo size="medium" variant="white" showText={true} />
              <p>Outils créatifs alimentés par l'IA</p>
            </div>
            <div className="footer-section">
              <h4>Outils</h4>
              <ul>
                <li><a href="#" onClick={() => setActiveTool('image-generator')}>Générateur d'Images</a></li>
                <li><a href="#" onClick={() => setActiveTool('manga-builder')}>Manga Builder</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Ressources</h4>
              <ul>
                <li><a href="#" onClick={() => alert('Guide disponible dans MANGA_BUILDER_GUIDE.md')}>Guide d'utilisation</a></li>
                <li><a href="#" onClick={() => alert('Support disponible via GitHub Issues')}>Support</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HIBBI4 Creative Suite. Créé avec ❤️ pour la communauté créative.</p>
          </div>
        </footer>
      )}

      {/* Modales d'authentification */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signin"
      />

      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .app-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-loading {
          font-size: 1.2rem;
          animation: pulse 2s infinite;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-credits {
          font-size: 0.9rem;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(0, 188, 212, 0.1);
          border: 1px solid rgba(0, 188, 212, 0.3);
          border-radius: 25px;
          padding: 0.5rem 1rem;
          color: #00bcd4;
          cursor: pointer;
          transition: all 0.3s;
        }

        .user-button:hover {
          background: rgba(0, 188, 212, 0.2);
          transform: translateY(-2px);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00bcd4, #0097a7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
          color: white;
        }

        .user-email {
          font-size: 0.9rem;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-auth {
          display: flex;
          gap: 0.5rem;
        }

        .auth-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .auth-button.signin {
          background: linear-gradient(45deg, #00bcd4, #0097a7);
          color: white;
        }

        .auth-button.signin:hover {
          background: linear-gradient(45deg, #0097a7, #00838f);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .main-nav {
          display: flex;
          gap: 0.5rem;
        }

        .nav-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 25px;
          background: transparent;
          color: #333;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .nav-button:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .nav-button.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .home-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          color: white;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
          padding: 3rem 0;
        }

        .hero-logo {
          margin-bottom: 2rem;
          display: flex;
          justify-content: center;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #fff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-description {
          max-width: 600px;
          margin: 0 auto;
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.8;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .tool-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        .tool-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .tool-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }

        .tool-card p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .tool-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .feature-tag {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .tool-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
        }

        .tool-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .features-section {
          margin-bottom: 4rem;
        }

        .features-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.3s;
        }

        .feature-item:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-item h4 {
          margin-bottom: 0.5rem;
          color: white;
        }

        .feature-item p {
          opacity: 0.8;
          line-height: 1.5;
        }

        .getting-started-section {
          margin-bottom: 4rem;
        }

        .getting-started-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 2rem;
        }

        .step-number {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .step-content h4 {
          margin-bottom: 0.5rem;
          color: white;
        }

        .step-content p {
          opacity: 0.8;
          line-height: 1.5;
        }

        .status-section {
          margin-bottom: 2rem;
        }

        .status-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          padding: 1rem;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-indicator.online {
          background: #4caf50;
          box-shadow: 0 0 10px #4caf50;
        }

        .status-indicator.offline {
          background: #f44336;
          box-shadow: 0 0 10px #f44336;
        }

        .status-indicator.demo {
          background: #ff9800;
          box-shadow: 0 0 10px #ff9800;
        }

        .status-item h4 {
          margin: 0 0 0.25rem 0;
          color: white;
        }

        .status-item p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .tool-container {
          background: white;
          min-height: calc(100vh - 80px);
          padding: 2rem;
        }

        .tool-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .tool-header h2 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .tool-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .image-generator-wrapper {
          max-width: 1000px;
          margin: 0 auto;
        }

        .prompt-input-section {
          margin-bottom: 2rem;
        }

        .prompt-input-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .prompt-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .prompt-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .app-footer {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section h4 {
          margin-bottom: 1rem;
          color: white;
        }

        .footer-section p {
          opacity: 0.8;
          line-height: 1.6;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s;
          cursor: pointer;
        }

        .footer-section a:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem 2rem;
          text-align: center;
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .main-nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .nav-button {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .step {
            flex-direction: column;
            text-align: center;
          }

          .home-container {
            padding: 1rem;
          }

          .tool-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

const Home = () => {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
};

export default Home;
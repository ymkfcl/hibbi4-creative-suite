"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("next/document");
function Document() {
    return (<document_1.Html lang="fr">
      <document_1.Head>
        {/* Favicon et icônes */}
        <link rel="icon" href="/logo-hibbi4.png"/>
        <link rel="apple-touch-icon" href="/logo-hibbi4.png"/>
        
        {/* Métadonnées */}
        <meta name="description" content="HIBBI4 Creative Suite - Suite complète d'outils créatifs alimentés par l'intelligence artificielle. Créez des images époustouflantes et des mangas professionnels."/>
        <meta name="keywords" content="IA, intelligence artificielle, génération d'images, manga, créatif, art, Stable Diffusion, HIBBI4"/>
        <meta name="author" content="HIBBI4 Team"/>
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="HIBBI4 Creative Suite"/>
        <meta property="og:description" content="Suite complète d'outils créatifs alimentés par l'intelligence artificielle"/>
        <meta property="og:image" content="/logo-hibbi4.png"/>
        <meta property="og:site_name" content="HIBBI4"/>
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="HIBBI4 Creative Suite"/>
        <meta name="twitter:description" content="Suite complète d'outils créatifs alimentés par l'intelligence artificielle"/>
        <meta name="twitter:image" content="/logo-hibbi4.png"/>
        
        {/* Thème et couleurs */}
        <meta name="theme-color" content="#00bcd4"/>
        <meta name="msapplication-TileColor" content="#00bcd4"/>
        
        {/* Préchargement des polices */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
        
        {/* Styles globaux */}
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          html {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
          }
          
          #__next {
            min-height: 100vh;
          }
          
          /* Scrollbar personnalisée */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #00bcd4;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #0097a7;
          }
          
          /* Animations globales */
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Classes utilitaires */
          .fade-in {
            animation: fadeIn 0.6s ease-out;
          }
          
          .slide-in {
            animation: slideIn 0.4s ease-out;
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
          
          /* Responsive helpers */
          .mobile-only {
            display: none;
          }
          
          .desktop-only {
            display: block;
          }
          
          @media (max-width: 768px) {
            .mobile-only {
              display: block;
            }
            
            .desktop-only {
              display: none;
            }
          }
          
          /* Focus styles pour l'accessibilité */
          button:focus,
          input:focus,
          textarea:focus,
          select:focus {
            outline: 2px solid #00bcd4;
            outline-offset: 2px;
          }
          
          /* Styles pour les éléments interactifs */
          button, .clickable {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          button:hover, .clickable:hover {
            transform: translateY(-2px);
          }
          
          button:active, .clickable:active {
            transform: translateY(0);
          }
          
          /* Styles pour les cartes */
          .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .card:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
            transform: translateY(-4px);
          }
          
          /* Styles pour les boutons */
          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            font-size: 1rem;
          }
          
          .btn-primary {
            background: linear-gradient(45deg, #00bcd4, #0097a7);
            color: white;
          }
          
          .btn-primary:hover {
            background: linear-gradient(45deg, #0097a7, #00838f);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
          }
          
          .btn-secondary {
            background: #f8f9fa;
            color: #666;
            border: 2px solid #e9ecef;
          }
          
          .btn-secondary:hover {
            background: #e9ecef;
            border-color: #dee2e6;
          }
          
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
          }
          
          /* Styles pour les inputs */
          .input {
            padding: 0.75rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            width: 100%;
          }
          
          .input:focus {
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
          }
          
          /* Styles pour les alertes */
          .alert {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
          }
          
          .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          
          .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          
          .alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
          }
          
          .alert-info {
            background: #cce7ff;
            color: #004085;
            border: 1px solid #99d6ff;
          }
        `}</style>
      </document_1.Head>
      <body>
        <document_1.Main />
        <document_1.NextScript />
      </body>
    </document_1.Html>);
}
exports.default = Document;

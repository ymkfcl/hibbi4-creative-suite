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
const Logo_1 = __importDefault(require("../Logo"));
const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }) => {
    const [mode, setMode] = (0, react_1.useState)(defaultMode);
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
    const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = (0, AuthContext_1.useAuth)();
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            if (mode === 'signin') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                }
                else {
                    onClose();
                }
            }
            else if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas');
                    setLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Le mot de passe doit contenir au moins 6 caractères');
                    setLoading(false);
                    return;
                }
                const { error } = await signUp(email, password);
                if (error) {
                    setError(error.message);
                }
                else {
                    setMessage('Vérifiez votre email pour confirmer votre inscription');
                }
            }
            else if (mode === 'reset') {
                const { error } = await resetPassword(email);
                if (error) {
                    setError(error.message);
                }
                else {
                    setMessage('Email de réinitialisation envoyé');
                }
            }
        }
        catch (err) {
            setError('Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSocialLogin = async (provider) => {
        setError('');
        setLoading(true);
        try {
            const { error } = provider === 'google'
                ? await signInWithGoogle()
                : await signInWithGitHub();
            if (error) {
                setError(error.message);
            }
        }
        catch (err) {
            setError('Erreur de connexion sociale');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <Logo_1.default size="medium" variant="default" showText={true}/>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>
              Connexion
            </button>
            <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>
              Inscription
            </button>
          </div>

          {mode !== 'reset' && (<div className="social-login">
              <button className="social-button google" onClick={() => handleSocialLogin('google')} disabled={loading}>
                <span className="social-icon">🔍</span>
                Continuer avec Google
              </button>
              <button className="social-button github" onClick={() => handleSocialLogin('github')} disabled={loading}>
                <span className="social-icon">🐙</span>
                Continuer avec GitHub
              </button>
              
              <div className="divider">
                <span>ou</span>
              </div>
            </div>)}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.com" className="form-input"/>
            </div>

            {mode !== 'reset' && (<div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="form-input"/>
              </div>)}

            {mode === 'signup' && (<div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="form-input"/>
              </div>)}

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (<span className="loading-spinner"></span>) : (<>
                  {mode === 'signin' && 'Se connecter'}
                  {mode === 'signup' && 'S\'inscrire'}
                  {mode === 'reset' && 'Réinitialiser'}
                </>)}
            </button>
          </form>

          <div className="auth-footer">
            {mode === 'signin' && (<>
                <button className="link-button" onClick={() => setMode('reset')}>
                  Mot de passe oublié ?
                </button>
                <p>
                  Pas de compte ? 
                  <button className="link-button" onClick={() => setMode('signup')}>
                    S'inscrire
                  </button>
                </p>
              </>)}
            
            {mode === 'signup' && (<p>
                Déjà un compte ? 
                <button className="link-button" onClick={() => setMode('signin')}>
                  Se connecter
                </button>
              </p>)}

            {mode === 'reset' && (<button className="link-button" onClick={() => setMode('signin')}>
                Retour à la connexion
              </button>)}
          </div>

          {mode === 'signup' && (<div className="credits-info">
              <div className="credits-card">
                <h4>🎁 Offre de bienvenue</h4>
                <p><strong>160 crédits gratuits</strong> par jour</p>
                <p>1 crédit = 1 image générée</p>
                <p>Remise à zéro quotidienne à minuit</p>
              </div>
            </div>)}
        </div>

        <style jsx>{`
          .auth-modal-overlay {
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

          .auth-modal {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 480px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
          }

          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .auth-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #f0f0f0;
          }

          .close-button {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s;
          }

          .close-button:hover {
            background: #f5f5f5;
            color: #333;
          }

          .auth-modal-content {
            padding: 2rem;
          }

          .auth-tabs {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 1px solid #e9ecef;
          }

          .auth-tab {
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

          .auth-tab.active {
            color: #00bcd4;
            border-bottom-color: #00bcd4;
          }

          .auth-tab:hover {
            color: #00bcd4;
          }

          .social-login {
            margin-bottom: 2rem;
          }

          .social-button {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 0.75rem;
            transition: all 0.3s;
          }

          .social-button:hover {
            border-color: #00bcd4;
            background: #f8fdff;
          }

          .social-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .social-button.google:hover {
            border-color: #4285f4;
            background: #f8f9ff;
          }

          .social-button.github:hover {
            border-color: #333;
            background: #f8f8f8;
          }

          .social-icon {
            font-size: 1.2rem;
          }

          .divider {
            text-align: center;
            margin: 1.5rem 0;
            position: relative;
          }

          .divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e9ecef;
          }

          .divider span {
            background: white;
            padding: 0 1rem;
            color: #666;
            font-size: 0.9rem;
          }

          .auth-form {
            margin-bottom: 2rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
          }

          .form-input:focus {
            outline: none;
            border-color: #00bcd4;
            box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
          }

          .error-message {
            background: #fee;
            color: #c33;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }

          .success-message {
            background: #efe;
            color: #363;
            padding: 0.75rem;
            border-radius: 6px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
          }

          .submit-button {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(45deg, #00bcd4, #0097a7);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .submit-button:hover:not(:disabled) {
            background: linear-gradient(45deg, #0097a7, #00838f);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
          }

          .submit-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .auth-footer {
            text-align: center;
            color: #666;
          }

          .auth-footer p {
            margin: 0.5rem 0;
          }

          .link-button {
            background: none;
            border: none;
            color: #00bcd4;
            cursor: pointer;
            font-weight: 500;
            text-decoration: underline;
            margin-left: 0.5rem;
          }

          .link-button:hover {
            color: #0097a7;
          }

          .credits-info {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #f0f0f0;
          }

          .credits-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
          }

          .credits-card h4 {
            margin: 0 0 1rem 0;
            font-size: 1.2rem;
          }

          .credits-card p {
            margin: 0.5rem 0;
            opacity: 0.9;
          }

          @media (max-width: 768px) {
            .auth-modal {
              margin: 1rem;
              max-width: none;
            }

            .auth-modal-header,
            .auth-modal-content {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </div>);
};
exports.default = AuthModal;

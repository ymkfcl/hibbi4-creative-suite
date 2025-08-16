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
const AuthContext_1 = require("../../contexts/AuthContext");
const CreditsDisplay = ({ showDetails = false, className = '' }) => {
    const { user, userCredits, remainingCredits, refreshCredits } = (0, AuthContext_1.useAuth)();
    const [timeUntilReset, setTimeUntilReset] = (0, react_1.useState)('');
    // Calculer le temps jusqu'à la prochaine réinitialisation
    (0, react_1.useEffect)(() => {
        const updateTimeUntilReset = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeUntilReset(`${hours}h ${minutes}m`);
        };
        updateTimeUntilReset();
        const interval = setInterval(updateTimeUntilReset, 60000); // Mettre à jour chaque minute
        return () => clearInterval(interval);
    }, []);
    if (!user || !userCredits) {
        return null;
    }
    const usagePercentage = ((userCredits.used_credits / userCredits.daily_credits) * 100);
    const isLowCredits = remainingCredits <= 10;
    const isOutOfCredits = remainingCredits === 0;
    return (<div className={`credits-display ${className}`}>
      <div className="credits-main">
        <div className="credits-icon">
          {isOutOfCredits ? '🚫' : isLowCredits ? '⚠️' : '✨'}
        </div>
        <div className="credits-info">
          <div className="credits-count">
            <span className={`remaining ${isLowCredits ? 'low' : ''}`}>
              {remainingCredits}
            </span>
            <span className="total">/{userCredits.daily_credits}</span>
          </div>
          <div className="credits-label">crédits</div>
        </div>
      </div>

      {showDetails && (<div className="credits-details">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${usagePercentage}%` }}/>
          </div>
          
          <div className="credits-stats">
            <div className="stat">
              <span className="stat-label">Utilisés aujourd'hui</span>
              <span className="stat-value">{userCredits.used_credits}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Total généré</span>
              <span className="stat-value">{userCredits.total_generated}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Réinitialisation</span>
              <span className="stat-value">{timeUntilReset}</span>
            </div>
          </div>

          <button className="refresh-button" onClick={refreshCredits} title="Actualiser les crédits">
            🔄 Actualiser
          </button>
        </div>)}

      {isOutOfCredits && (<div className="credits-warning">
          <p>Plus de crédits aujourd'hui !</p>
          <p>Réinitialisation dans {timeUntilReset}</p>
        </div>)}

      {isLowCredits && !isOutOfCredits && (<div className="credits-warning low">
          <p>Crédits bientôt épuisés</p>
        </div>)}

      <style jsx>{`
        .credits-display {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 2px solid #f0f0f0;
          transition: all 0.3s ease;
        }

        .credits-display:hover {
          border-color: #00bcd4;
          box-shadow: 0 4px 20px rgba(0, 188, 212, 0.1);
        }

        .credits-main {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .credits-icon {
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          color: white;
        }

        .credits-info {
          flex: 1;
        }

        .credits-count {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .remaining {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00bcd4;
          transition: color 0.3s;
        }

        .remaining.low {
          color: #ff9800;
        }

        .total {
          font-size: 1rem;
          color: #666;
        }

        .credits-label {
          font-size: 0.85rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .credits-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00bcd4, #0097a7);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .credits-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          display: block;
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
        }

        .refresh-button {
          width: 100%;
          padding: 0.5rem;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          color: #666;
          transition: all 0.3s;
        }

        .refresh-button:hover {
          background: #e9ecef;
          color: #333;
        }

        .credits-warning {
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 6px;
          text-align: center;
        }

        .credits-warning.low {
          background: #fff3cd;
          border-color: #ffeaa7;
        }

        .credits-warning p {
          margin: 0.25rem 0;
          font-size: 0.85rem;
          color: #c33;
        }

        .credits-warning.low p {
          color: #856404;
        }

        /* Variantes de taille */
        .credits-display.compact {
          padding: 0.75rem;
        }

        .credits-display.compact .credits-icon {
          width: 32px;
          height: 32px;
          font-size: 1.2rem;
        }

        .credits-display.compact .remaining {
          font-size: 1.2rem;
        }

        .credits-display.compact .credits-label {
          font-size: 0.75rem;
        }

        /* Animation pour les changements de crédits */
        @keyframes creditUpdate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .credits-count.updated {
          animation: creditUpdate 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .credits-stats {
            grid-template-columns: 1fr 1fr;
          }
          
          .stat-label {
            font-size: 0.7rem;
          }
          
          .stat-value {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>);
};
exports.default = CreditsDisplay;

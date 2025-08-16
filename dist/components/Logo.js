"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const image_1 = __importDefault(require("next/image"));
const Logo = ({ size = 'medium', variant = 'default', showText = true, className = '', onClick }) => {
    const sizeMap = {
        small: { width: 32, height: 32, textSize: 'text-lg' },
        medium: { width: 48, height: 48, textSize: 'text-xl' },
        large: { width: 64, height: 64, textSize: 'text-2xl' },
        xl: { width: 96, height: 96, textSize: 'text-4xl' }
    };
    const { width, height, textSize } = sizeMap[size];
    const getTextColor = () => {
        switch (variant) {
            case 'white':
                return 'text-white';
            case 'dark':
                return 'text-gray-800';
            default:
                return 'text-cyan-500';
        }
    };
    return (<div className={`logo-container ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      <div className="logo-content">
        <div className="logo-image">
          <image_1.default src="/logo-hibbi4.png" alt="HIBBI4 Logo" width={width} height={height} priority className="logo-img"/>
        </div>
        {showText && (<div className={`logo-text ${textSize} ${getTextColor()}`}>
            HIBBI4
          </div>)}
      </div>

      <style jsx>{`
        .logo-container {
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .logo-container:hover {
          transform: ${onClick ? 'scale(1.05)' : 'none'};
        }

        .logo-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-image {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .logo-img {
          object-fit: contain;
          filter: drop-shadow(0 2px 8px rgba(0, 188, 212, 0.3));
          transition: filter 0.3s ease;
        }

        .logo-container:hover .logo-img {
          filter: drop-shadow(0 4px 12px rgba(0, 188, 212, 0.5));
        }

        .logo-text {
          font-weight: bold;
          font-family: 'Arial', sans-serif;
          letter-spacing: 0.05em;
          background: linear-gradient(45deg, #00bcd4, #0097a7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .logo-text.text-white {
          background: white;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-text.text-gray-800 {
          background: #1f2937;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .logo-content {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>);
};
exports.default = Logo;

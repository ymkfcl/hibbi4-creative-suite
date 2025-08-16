import React, { useState, useEffect } from 'react';
import { apiService } from '../utils/apiService';
import { useCreditsGuard } from '../hooks/useAuthGuard';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import AuthModal from './auth/AuthModal';
import CreditsDisplay from './auth/CreditsDisplay';

interface ImageGeneratorProps {
    prompt?: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ prompt: externalPrompt }) => {
    const [prompt, setPrompt] = useState(externalPrompt || '');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSDAvailable, setIsSDAvailable] = useState<boolean | null>(null);
    const [advancedMode, setAdvancedMode] = useState(false);
    const [parameters, setParameters] = useState({
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        sampler_name: 'Euler a',
        negative_prompt: 'blurry, low quality, distorted'
    });

    // Hooks d'authentification et de crédits
    const { user } = useAuth();
    const {
        checkAndUseCredits,
        remainingCredits,
        hasEnoughCredits,
        showAuthModal,
        setShowAuthModal,
        showCreditsWarning,
        setShowCreditsWarning,
        isAuthenticated
    } = useCreditsGuard(1);

    // Vérifier la disponibilité de Stable Diffusion au chargement
    useEffect(() => {
        checkSDAvailability();
    }, []);

    // Mettre à jour le prompt externe
    useEffect(() => {
        if (externalPrompt) {
            setPrompt(externalPrompt);
        }
    }, [externalPrompt]);

    const checkSDAvailability = async () => {
        const available = await apiService.checkAvailability();
        setIsSDAvailable(available);
    };

    const generateImage = async () => {
        if (!prompt.trim()) return;

        // Vérifier l'authentification et les crédits
        const canProceed = await checkAndUseCredits();
        if (!canProceed) return;

        setLoading(true);
        try {
            const result = await apiService.generateImage({
                prompt,
                negative_prompt: parameters.negative_prompt,
                width: parameters.width,
                height: parameters.height,
                steps: parameters.steps,
                cfg_scale: parameters.cfg_scale,
                sampler_name: parameters.sampler_name,
                userId: user?.id // Ajouter l'ID utilisateur
            });

            if (result.images && result.images.length > 0) {
                setImageUrl(`data:image/png;base64,${result.images[0]}`);
            }
        } catch (error) {
            console.error('Erreur génération:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        if (!imageUrl) return;
        
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `hibbi4-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getStatusColor = () => {
        if (isSDAvailable === null) return '#ffa500';
        return isSDAvailable ? '#4caf50' : '#ff9800';
    };

    const getStatusText = () => {
        if (isSDAvailable === null) return 'Vérification...';
        return isSDAvailable ? 'IA Connectée' : 'Mode Démo';
    };

    return (
        <div className="image-generator">
            {/* Header avec logo et crédits */}
            <div className="generator-header">
                <Logo size="medium" variant="default" showText={true} />
                <div className="header-right">
                    {isAuthenticated && (
                        <CreditsDisplay className="compact" />
                    )}
                    <div className="status-indicator">
                        <div 
                            className="status-dot" 
                            style={{ backgroundColor: getStatusColor() }}
                        ></div>
                        <span className="status-text">{getStatusText()}</span>
                    </div>
                </div>
            </div>

            {/* Zone de prompt principale */}
            <div className="prompt-section">
                <label htmlFor="main-prompt">Décrivez l'image que vous voulez créer :</label>
                <textarea
                    id="main-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Un chat ninja dans un paysage cyberpunk, style anime, haute qualité"
                    className="prompt-textarea"
                    rows={3}
                />
                
                <div className="prompt-actions">
                    <button 
                        onClick={generateImage} 
                        disabled={loading || !prompt.trim() || (!isAuthenticated && !hasEnoughCredits)}
                        className="generate-btn"
                        title={!isAuthenticated ? "Connexion requise" : !hasEnoughCredits ? "Crédits insuffisants" : ""}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Génération...
                            </>
                        ) : !isAuthenticated ? (
                            <>
                                🔐 Se connecter pour générer
                            </>
                        ) : !hasEnoughCredits ? (
                            <>
                                ⏳ Plus de crédits aujourd'hui
                            </>
                        ) : (
                            <>
                                ✨ Générer l'Image (1 crédit)
                            </>
                        )}
                    </button>
                    
                    <button 
                        onClick={() => setAdvancedMode(!advancedMode)}
                        className="advanced-btn"
                    >
                        ⚙️ {advancedMode ? 'Masquer' : 'Paramètres'}
                    </button>
                </div>
            </div>

            {/* Paramètres avancés */}
            {advancedMode && (
                <div className="advanced-section">
                    <h3>⚙️ Paramètres Avancés</h3>
                    
                    <div className="params-grid">
                        <div className="param-group">
                            <label>Dimensions</label>
                            <div className="dimension-controls">
                                <select 
                                    value={`${parameters.width}x${parameters.height}`}
                                    onChange={(e) => {
                                        const [width, height] = e.target.value.split('x').map(Number);
                                        setParameters(prev => ({ ...prev, width, height }));
                                    }}
                                >
                                    <option value="512x512">512x512 (Carré)</option>
                                    <option value="768x512">768x512 (Paysage)</option>
                                    <option value="512x768">512x768 (Portrait)</option>
                                    <option value="1024x1024">1024x1024 (HD)</option>
                                </select>
                            </div>
                        </div>

                        <div className="param-group">
                            <label>Steps: {parameters.steps}</label>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                value={parameters.steps}
                                onChange={(e) => setParameters(prev => ({ 
                                    ...prev, 
                                    steps: parseInt(e.target.value) 
                                }))}
                            />
                        </div>

                        <div className="param-group">
                            <label>CFG Scale: {parameters.cfg_scale}</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                step="0.5"
                                value={parameters.cfg_scale}
                                onChange={(e) => setParameters(prev => ({ 
                                    ...prev, 
                                    cfg_scale: parseFloat(e.target.value) 
                                }))}
                            />
                        </div>

                        <div className="param-group">
                            <label>Sampler</label>
                            <select 
                                value={parameters.sampler_name}
                                onChange={(e) => setParameters(prev => ({ 
                                    ...prev, 
                                    sampler_name: e.target.value 
                                }))}
                            >
                                <option value="Euler a">Euler a (Rapide)</option>
                                <option value="DPM++ 2M Karras">DPM++ 2M Karras (Qualité)</option>
                                <option value="DDIM">DDIM (Stable)</option>
                                <option value="LMS">LMS (Classique)</option>
                            </select>
                        </div>
                    </div>

                    <div className="param-group full-width">
                        <label>Prompt Négatif</label>
                        <input
                            type="text"
                            value={parameters.negative_prompt}
                            onChange={(e) => setParameters(prev => ({ 
                                ...prev, 
                                negative_prompt: e.target.value 
                            }))}
                            placeholder="Éléments à éviter dans l'image"
                        />
                    </div>
                </div>
            )}

            {/* Zone d'affichage de l'image */}
            {(imageUrl || loading) && (
                <div className="image-section">
                    <h3>🎨 Résultat</h3>
                    
                    <div className="image-container">
                        {loading ? (
                            <div className="loading-placeholder">
                                <div className="loading-spinner"></div>
                                <p>Génération en cours...</p>
                                <p className="loading-subtitle">
                                    {isSDAvailable ? 'IA en action' : 'Création du placeholder'}
                                </p>
                            </div>
                        ) : imageUrl ? (
                            <>
                                <img 
                                    src={imageUrl} 
                                    alt="Image générée" 
                                    className="generated-image"
                                />
                                <div className="image-actions">
                                    <button onClick={downloadImage} className="download-btn">
                                        💾 Télécharger
                                    </button>
                                    <button 
                                        onClick={() => setImageUrl('')} 
                                        className="clear-btn"
                                    >
                                        🗑️ Effacer
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Conseils et exemples */}
            <div className="tips-section">
                <h3>💡 Conseils pour de Meilleurs Résultats</h3>
                <div className="tips-grid">
                    <div className="tip-card">
                        <h4>🎯 Soyez Spécifique</h4>
                        <p>Décrivez les détails : couleurs, style, ambiance, qualité</p>
                        <code>Un dragon rouge dans une forêt mystique, style fantasy art, haute qualité</code>
                    </div>
                    <div className="tip-card">
                        <h4>🎨 Mentionnez le Style</h4>
                        <p>Ajoutez des références artistiques pour guider l'IA</p>
                        <code>Portrait d'une guerrière, style anime, art de Makoto Shinkai</code>
                    </div>
                    <div className="tip-card">
                        <h4>⚡ Optimisez les Paramètres</h4>
                        <p>Plus de steps = meilleure qualité, CFG 7-8 = bon équilibre</p>
                    </div>
                </div>
            </div>

            {/* Modales d'authentification et d'avertissement */}
            <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                defaultMode="signin"
            />

            {showCreditsWarning && (
                <div className="credits-warning-modal" onClick={() => setShowCreditsWarning(false)}>
                    <div className="credits-warning-content" onClick={(e) => e.stopPropagation()}>
                        <div className="warning-icon">⚠️</div>
                        <h3>Crédits insuffisants</h3>
                        <p>Vous n'avez plus de crédits pour aujourd'hui.</p>
                        <p>Vos crédits seront réinitialisés à minuit.</p>
                        <div className="warning-actions">
                            <button 
                                className="warning-button"
                                onClick={() => setShowCreditsWarning(false)}
                            >
                                Compris
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .image-generator {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .generator-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f0f0f0;
                }

                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #f8f9fa;
                    border-radius: 20px;
                    border: 1px solid #e9ecef;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .status-text {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #666;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                .prompt-section {
                    margin-bottom: 2rem;
                }

                .prompt-section label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #333;
                }

                .prompt-textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 1rem;
                    resize: vertical;
                    transition: border-color 0.3s;
                    font-family: inherit;
                }

                .prompt-textarea:focus {
                    outline: none;
                    border-color: #00bcd4;
                    box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
                }

                .prompt-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .generate-btn {
                    flex: 1;
                    padding: 1rem 2rem;
                    background: linear-gradient(45deg, #00bcd4, #0097a7);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .generate-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
                }

                .generate-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .advanced-btn {
                    padding: 1rem;
                    background: #f8f9fa;
                    color: #666;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .advanced-btn:hover {
                    background: #e9ecef;
                    border-color: #dee2e6;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .advanced-section {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                    border: 1px solid #e9ecef;
                }

                .advanced-section h3 {
                    margin: 0 0 1rem 0;
                    color: #333;
                }

                .params-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .param-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .param-group.full-width {
                    grid-column: 1 / -1;
                }

                .param-group label {
                    font-weight: 600;
                    color: #555;
                    font-size: 0.9rem;
                }

                .param-group input, .param-group select {
                    padding: 0.5rem;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }

                .param-group input[type="range"] {
                    padding: 0;
                }

                .image-section {
                    margin-bottom: 2rem;
                }

                .image-section h3 {
                    margin-bottom: 1rem;
                    color: #333;
                }

                .image-container {
                    text-align: center;
                    padding: 2rem;
                    border: 2px dashed #e9ecef;
                    border-radius: 8px;
                    background: #fafafa;
                }

                .loading-placeholder {
                    padding: 3rem;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e9ecef;
                    border-top: 4px solid #00bcd4;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                .loading-subtitle {
                    color: #666;
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .generated-image {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    margin-bottom: 1rem;
                }

                .image-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .download-btn, .clear-btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .download-btn {
                    background: #4caf50;
                    color: white;
                }

                .download-btn:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                }

                .clear-btn {
                    background: #f44336;
                    color: white;
                }

                .clear-btn:hover {
                    background: #da190b;
                    transform: translateY(-2px);
                }

                .tips-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 12px;
                    margin-top: 2rem;
                }

                .tips-section h3 {
                    margin: 0 0 1.5rem 0;
                    text-align: center;
                }

                .tips-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                }

                .tip-card {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 1.5rem;
                    border-radius: 8px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .tip-card h4 {
                    margin: 0 0 0.5rem 0;
                    color: #fff;
                }

                .tip-card p {
                    margin: 0 0 1rem 0;
                    opacity: 0.9;
                    line-height: 1.5;
                }

                .tip-card code {
                    display: block;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.5rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                @media (max-width: 768px) {
                    .image-generator {
                        padding: 1rem;
                    }

                    .generator-header {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .prompt-actions {
                        flex-direction: column;
                    }

                    .params-grid {
                        grid-template-columns: 1fr;
                    }

                    .tips-grid {
                        grid-template-columns: 1fr;
                    }

                    .image-actions {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                /* Styles pour la modale d'avertissement crédits */
                .credits-warning-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                    padding: 1rem;
                }

                .credits-warning-content {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: modalSlideIn 0.3s ease-out;
                }

                .warning-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .credits-warning-content h3 {
                    margin: 0 0 1rem 0;
                    color: #ff9800;
                }

                .credits-warning-content p {
                    margin: 0.5rem 0;
                    color: #666;
                    line-height: 1.5;
                }

                .warning-actions {
                    margin-top: 2rem;
                }

                .warning-button {
                    padding: 0.75rem 2rem;
                    background: #ff9800;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .warning-button:hover {
                    background: #f57c00;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default ImageGenerator;
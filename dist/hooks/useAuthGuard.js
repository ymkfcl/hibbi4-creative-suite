"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreditsGuard = exports.useAuthGuard = void 0;
const react_1 = require("react");
const AuthContext_1 = require("../contexts/AuthContext");
const useAuthGuard = (options = {}) => {
    const { requireAuth = true, minCredits = 1 } = options;
    const { user, loading, remainingCredits } = (0, AuthContext_1.useAuth)();
    const [showAuthModal, setShowAuthModal] = (0, react_1.useState)(false);
    const isAuthenticated = !!user;
    const hasEnoughCredits = remainingCredits >= minCredits;
    const canProceed = !requireAuth || (isAuthenticated && hasEnoughCredits);
    (0, react_1.useEffect)(() => {
        if (!loading && requireAuth && !isAuthenticated) {
            setShowAuthModal(true);
        }
    }, [loading, requireAuth, isAuthenticated]);
    return {
        isAuthenticated,
        hasEnoughCredits,
        loading,
        showAuthModal,
        setShowAuthModal,
        canProceed
    };
};
exports.useAuthGuard = useAuthGuard;
// Hook spécialisé pour les actions qui consomment des crédits
const useCreditsGuard = (creditsRequired = 1) => {
    const { user, remainingCredits, useCredits } = (0, AuthContext_1.useAuth)();
    const [showAuthModal, setShowAuthModal] = (0, react_1.useState)(false);
    const [showCreditsWarning, setShowCreditsWarning] = (0, react_1.useState)(false);
    const checkAndUseCredits = async () => {
        // Vérifier l'authentification
        if (!user) {
            setShowAuthModal(true);
            return false;
        }
        // Vérifier les crédits
        if (remainingCredits < creditsRequired) {
            setShowCreditsWarning(true);
            return false;
        }
        // Utiliser les crédits
        const success = await useCredits(creditsRequired);
        if (!success) {
            setShowCreditsWarning(true);
            return false;
        }
        return true;
    };
    return {
        checkAndUseCredits,
        remainingCredits,
        hasEnoughCredits: remainingCredits >= creditsRequired,
        showAuthModal,
        setShowAuthModal,
        showCreditsWarning,
        setShowCreditsWarning,
        isAuthenticated: !!user
    };
};
exports.useCreditsGuard = useCreditsGuard;

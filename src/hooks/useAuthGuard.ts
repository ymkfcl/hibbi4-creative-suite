import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  minCredits?: number;
}

interface AuthGuardResult {
  isAuthenticated: boolean;
  hasEnoughCredits: boolean;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  canProceed: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}): AuthGuardResult => {
  const {
    requireAuth = true,
    minCredits = 1
  } = options;

  const { user, loading, remainingCredits } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuthenticated = !!user;
  const hasEnoughCredits = remainingCredits >= minCredits;
  const canProceed = !requireAuth || (isAuthenticated && hasEnoughCredits);

  useEffect(() => {
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

// Hook spécialisé pour les actions qui consomment des crédits
export const useCreditsGuard = (creditsRequired: number = 1) => {
  const { user, remainingCredits, useCredits } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreditsWarning, setShowCreditsWarning] = useState(false);

  const checkAndUseCredits = async (): Promise<boolean> => {
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
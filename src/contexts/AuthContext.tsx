import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, auth, credits, UserCredits } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  userCredits: UserCredits | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithGitHub: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  useCredits: (amount?: number) => Promise<boolean>;
  refreshCredits: () => Promise<void>;
  remainingCredits: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingCredits, setRemainingCredits] = useState(0);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserCredits(session.user.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserCredits(session.user.id);
        } else {
          setUserCredits(null);
          setRemainingCredits(0);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Charger les crédits de l'utilisateur
  const loadUserCredits = async (userId: string) => {
    try {
      let userCreditsData = await credits.getUserCredits(userId);
      
      // Si l'utilisateur n'a pas de crédits, les initialiser
      if (!userCreditsData) {
        userCreditsData = await credits.initializeCredits(userId);
      } else {
        // Vérifier et réinitialiser les crédits quotidiens si nécessaire
        userCreditsData = await credits.checkAndResetDailyCredits(userId);
      }
      
      if (userCreditsData) {
        setUserCredits(userCreditsData);
        const remaining = userCreditsData.daily_credits - userCreditsData.used_credits;
        setRemainingCredits(remaining);
      }
    } catch (error) {
      console.error('Erreur chargement crédits:', error);
    }
  };

  // Rafraîchir les crédits
  const refreshCredits = async () => {
    if (user) {
      await loadUserCredits(user.id);
    }
  };

  // Utiliser des crédits
  const useCredits = async (amount: number = 1): Promise<boolean> => {
    if (!user) return false;

    const success = await credits.useCredits(user.id, amount);
    if (success) {
      await refreshCredits();
    }
    return success;
  };

  // Connexion
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await auth.signIn(email, password);
    setLoading(false);
    return result;
  };

  // Inscription
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const result = await auth.signUp(email, password);
    setLoading(false);
    return result;
  };

  // Déconnexion
  const signOut = async () => {
    setLoading(true);
    await auth.signOut();
    setUser(null);
    setUserCredits(null);
    setRemainingCredits(0);
    setLoading(false);
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    setLoading(true);
    const result = await auth.signInWithGoogle();
    setLoading(false);
    return result;
  };

  // Connexion avec GitHub
  const signInWithGitHub = async () => {
    setLoading(true);
    const result = await auth.signInWithGitHub();
    setLoading(false);
    return result;
  };

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    return await auth.resetPassword(email);
  };

  const value: AuthContextType = {
    user,
    userCredits,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithGitHub,
    resetPassword,
    useCredits,
    refreshCredits,
    remainingCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
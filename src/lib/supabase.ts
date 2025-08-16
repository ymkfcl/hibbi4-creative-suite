import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  daily_credits: number;
  used_credits: number;
  last_reset: string;
  total_generated: number;
  created_at: string;
  updated_at: string;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  parameters: any;
  credits_used: number;
  created_at: string;
}

// Fonctions utilitaires pour l'authentification
export const auth = {
  // Connexion avec email/mot de passe
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Inscription
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Déconnexion
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Obtenir l'utilisateur actuel
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Connexion avec Google
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  // Connexion avec GitHub
  signInWithGitHub: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  // Réinitialisation du mot de passe
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  }
};

// Fonctions pour la gestion des crédits
export const credits = {
  // Obtenir les crédits de l'utilisateur
  getUserCredits: async (userId: string): Promise<UserCredits | null> => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Erreur récupération crédits:', error);
      return null;
    }

    return data;
  },

  // Initialiser les crédits pour un nouvel utilisateur
  initializeCredits: async (userId: string): Promise<UserCredits | null> => {
    const { data, error } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        daily_credits: 160,
        used_credits: 0,
        last_reset: new Date().toISOString().split('T')[0],
        total_generated: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur initialisation crédits:', error);
      return null;
    }

    return data;
  },

  // Vérifier et réinitialiser les crédits quotidiens
  checkAndResetDailyCredits: async (userId: string): Promise<UserCredits | null> => {
    const userCredits = await credits.getUserCredits(userId);
    if (!userCredits) return null;

    const today = new Date().toISOString().split('T')[0];
    const lastReset = userCredits.last_reset;

    // Si c'est un nouveau jour, réinitialiser les crédits
    if (lastReset !== today) {
      const { data, error } = await supabase
        .from('user_credits')
        .update({
          used_credits: 0,
          last_reset: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Erreur réinitialisation crédits:', error);
        return userCredits;
      }

      return data;
    }

    return userCredits;
  },

  // Utiliser des crédits
  useCredits: async (userId: string, amount: number = 1): Promise<boolean> => {
    const userCredits = await credits.checkAndResetDailyCredits(userId);
    if (!userCredits) return false;

    const remainingCredits = userCredits.daily_credits - userCredits.used_credits;
    if (remainingCredits < amount) {
      return false; // Pas assez de crédits
    }

    const { error } = await supabase
      .from('user_credits')
      .update({
        used_credits: userCredits.used_credits + amount,
        total_generated: userCredits.total_generated + amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur utilisation crédits:', error);
      return false;
    }

    return true;
  },

  // Obtenir les crédits restants
  getRemainingCredits: async (userId: string): Promise<number> => {
    const userCredits = await credits.checkAndResetDailyCredits(userId);
    if (!userCredits) return 0;

    return userCredits.daily_credits - userCredits.used_credits;
  }
};

// Fonctions pour l'historique
export const history = {
  // Ajouter une génération à l'historique
  addGeneration: async (
    userId: string,
    prompt: string,
    imageUrl: string,
    parameters: any,
    creditsUsed: number = 1
  ): Promise<GenerationHistory | null> => {
    const { data, error } = await supabase
      .from('generation_history')
      .insert({
        user_id: userId,
        prompt,
        image_url: imageUrl,
        parameters,
        credits_used: creditsUsed
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur ajout historique:', error);
      return null;
    }

    return data;
  },

  // Obtenir l'historique de l'utilisateur
  getUserHistory: async (userId: string, limit: number = 50): Promise<GenerationHistory[]> => {
    const { data, error } = await supabase
      .from('generation_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }

    return data || [];
  },

  // Supprimer une génération de l'historique
  deleteGeneration: async (generationId: string, userId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('generation_history')
      .delete()
      .eq('id', generationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erreur suppression historique:', error);
      return false;
    }

    return true;
  }
};
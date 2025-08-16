"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.history = exports.credits = exports.auth = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Fonctions utilitaires pour l'authentification
exports.auth = {
    // Connexion avec email/mot de passe
    signIn: async (email, password) => {
        const { data, error } = await exports.supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    },
    // Inscription
    signUp: async (email, password) => {
        const { data, error } = await exports.supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },
    // Déconnexion
    signOut: async () => {
        const { error } = await exports.supabase.auth.signOut();
        return { error };
    },
    // Obtenir l'utilisateur actuel
    getUser: async () => {
        const { data: { user }, error } = await exports.supabase.auth.getUser();
        return { user, error };
    },
    // Connexion avec Google
    signInWithGoogle: async () => {
        const { data, error } = await exports.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { data, error };
    },
    // Connexion avec GitHub
    signInWithGitHub: async () => {
        const { data, error } = await exports.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { data, error };
    },
    // Réinitialisation du mot de passe
    resetPassword: async (email) => {
        const { data, error } = await exports.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        });
        return { data, error };
    }
};
// Fonctions pour la gestion des crédits
exports.credits = {
    // Obtenir les crédits de l'utilisateur
    getUserCredits: async (userId) => {
        const { data, error } = await exports.supabase
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
    initializeCredits: async (userId) => {
        const { data, error } = await exports.supabase
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
    checkAndResetDailyCredits: async (userId) => {
        const userCredits = await exports.credits.getUserCredits(userId);
        if (!userCredits)
            return null;
        const today = new Date().toISOString().split('T')[0];
        const lastReset = userCredits.last_reset;
        // Si c'est un nouveau jour, réinitialiser les crédits
        if (lastReset !== today) {
            const { data, error } = await exports.supabase
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
    useCredits: async (userId, amount = 1) => {
        const userCredits = await exports.credits.checkAndResetDailyCredits(userId);
        if (!userCredits)
            return false;
        const remainingCredits = userCredits.daily_credits - userCredits.used_credits;
        if (remainingCredits < amount) {
            return false; // Pas assez de crédits
        }
        const { error } = await exports.supabase
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
    getRemainingCredits: async (userId) => {
        const userCredits = await exports.credits.checkAndResetDailyCredits(userId);
        if (!userCredits)
            return 0;
        return userCredits.daily_credits - userCredits.used_credits;
    }
};
// Fonctions pour l'historique
exports.history = {
    // Ajouter une génération à l'historique
    addGeneration: async (userId, prompt, imageUrl, parameters, creditsUsed = 1) => {
        const { data, error } = await exports.supabase
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
    getUserHistory: async (userId, limit = 50) => {
        const { data, error } = await exports.supabase
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
    deleteGeneration: async (generationId, userId) => {
        const { error } = await exports.supabase
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

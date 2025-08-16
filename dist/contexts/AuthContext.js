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
exports.AuthProvider = exports.useAuth = void 0;
const react_1 = __importStar(require("react"));
const supabase_1 = require("../lib/supabase");
const AuthContext = (0, react_1.createContext)(undefined);
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [userCredits, setUserCredits] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [remainingCredits, setRemainingCredits] = (0, react_1.useState)(0);
    // Charger l'utilisateur au démarrage
    (0, react_1.useEffect)(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase_1.supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                await loadUserCredits(session.user.id);
            }
            setLoading(false);
        };
        getInitialSession();
        // Écouter les changements d'authentification
        const { data: { subscription } } = supabase_1.supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                await loadUserCredits(session.user.id);
            }
            else {
                setUserCredits(null);
                setRemainingCredits(0);
            }
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    // Charger les crédits de l'utilisateur
    const loadUserCredits = async (userId) => {
        try {
            let userCreditsData = await supabase_1.credits.getUserCredits(userId);
            // Si l'utilisateur n'a pas de crédits, les initialiser
            if (!userCreditsData) {
                userCreditsData = await supabase_1.credits.initializeCredits(userId);
            }
            else {
                // Vérifier et réinitialiser les crédits quotidiens si nécessaire
                userCreditsData = await supabase_1.credits.checkAndResetDailyCredits(userId);
            }
            if (userCreditsData) {
                setUserCredits(userCreditsData);
                const remaining = userCreditsData.daily_credits - userCreditsData.used_credits;
                setRemainingCredits(remaining);
            }
        }
        catch (error) {
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
    const useCredits = async (amount = 1) => {
        if (!user)
            return false;
        const success = await supabase_1.credits.useCredits(user.id, amount);
        if (success) {
            await refreshCredits();
        }
        return success;
    };
    // Connexion
    const signIn = async (email, password) => {
        setLoading(true);
        const result = await supabase_1.auth.signIn(email, password);
        setLoading(false);
        return result;
    };
    // Inscription
    const signUp = async (email, password) => {
        setLoading(true);
        const result = await supabase_1.auth.signUp(email, password);
        setLoading(false);
        return result;
    };
    // Déconnexion
    const signOut = async () => {
        setLoading(true);
        await supabase_1.auth.signOut();
        setUser(null);
        setUserCredits(null);
        setRemainingCredits(0);
        setLoading(false);
    };
    // Connexion avec Google
    const signInWithGoogle = async () => {
        setLoading(true);
        const result = await supabase_1.auth.signInWithGoogle();
        setLoading(false);
        return result;
    };
    // Connexion avec GitHub
    const signInWithGitHub = async () => {
        setLoading(true);
        const result = await supabase_1.auth.signInWithGitHub();
        setLoading(false);
        return result;
    };
    // Réinitialisation du mot de passe
    const resetPassword = async (email) => {
        return await supabase_1.auth.resetPassword(email);
    };
    const value = {
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
    return (<AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;

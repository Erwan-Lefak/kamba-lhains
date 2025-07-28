import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppError, User, CartItem, Product, UserPreferences } from '../types';

// Actions pour le reducer
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'ADD_TO_FAVORITES'; payload: string }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'ADD_TO_RECENTLY_VIEWED'; payload: Product }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET_STATE' };

// État initial
const initialState: AppState = {
  user: null,
  cart: [],
  favorites: [],
  recentlyViewed: [],
  preferences: {
    favoriteCategories: [],
    preferredSizes: [],
    newsletter: false,
    language: 'fr',
    currency: 'EUR',
    theme: 'light'
  },
  isLoading: false,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        preferences: action.payload?.preferences || state.preferences
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'ADD_TO_FAVORITES':
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload)
      };

    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };

    case 'ADD_TO_RECENTLY_VIEWED':
      const filtered = state.recentlyViewed.filter(p => p.id !== action.payload.id);
      return {
        ...state,
        recentlyViewed: [action.payload, ...filtered].slice(0, 10) // Garde seulement les 10 derniers
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions helpers
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToRecentlyViewed: (product: Product) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Charger les données persistées au démarrage
  useEffect(() => {
    try {
      // Charger les favoris depuis localStorage
      const savedFavorites = localStorage.getItem('kamba-favorites');
      if (savedFavorites) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(savedFavorites) });
      }

      // Charger les préférences depuis localStorage
      const savedPreferences = localStorage.getItem('kamba-preferences');
      if (savedPreferences) {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: JSON.parse(savedPreferences) });
      }

      // Charger l'utilisateur depuis localStorage/session
      const savedUser = localStorage.getItem('kamba-user');
      if (savedUser) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }, []);

  // Persister les favoris
  useEffect(() => {
    localStorage.setItem('kamba-favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  // Persister les préférences
  useEffect(() => {
    localStorage.setItem('kamba-preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  // Persister l'utilisateur
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('kamba-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('kamba-user');
    }
  }, [state.user]);

  // Actions helpers
  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: AppError | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const addToFavorites = (productId: string) => {
    dispatch({ type: 'ADD_TO_FAVORITES', payload: productId });
  };

  const removeFromFavorites = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId });
  };

  const toggleFavorite = (productId: string) => {
    if (state.favorites.includes(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const isFavorite = (productId: string) => {
    return state.favorites.includes(productId);
  };

  const addToRecentlyViewed = (product: Product) => {
    dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product });
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AppContextType = {
    state,
    dispatch,
    setUser,
    setLoading,
    setError,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToRecentlyViewed,
    updatePreferences,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personnalisé
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp doit être utilisé à l\'intérieur d\'un AppProvider');
  }
  return context;
}

export default AppContext;
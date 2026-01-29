import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from 'react';
import { Product } from '../types';

interface AIConfig {
  sessionId: string;
  userId?: string;
  enablePersonalization?: boolean;
  enableInsights?: boolean;
  enableSmartSearch?: boolean;
}

interface UseAIReturn {
  // Recommandations
  recommendations: Product[];
  loadingRecommendations: boolean;
  getRecommendations: (type: 'personalized' | 'trending' | 'similar', options?: any) => Promise<Product[]>;
  
  // Recherche intelligente
  search: (query: string, filters?: any) => Promise<any>;
  autocomplete: (query: string) => Promise<any[]>;
  searchSuggestions: any[];
  
  // Tracking comportemental
  trackEvent: (event: string, data?: any) => void;
  
  // Insights utilisateur
  insights: any;
  loadingInsights: boolean;
  refreshInsights: () => Promise<void>;
  
  // Personnalisation
  personalizeContent: (content: any[], type: string) => any[];
  
  // État général
  isReady: boolean;
  error: string | null;
}

export function useAI(config: AIConfig): UseAIReturn {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const eventQueue = useRef<any[]>([]);
  const flushTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeAI();
    return () => {
      if (flushTimeout.current) {
        clearTimeout(flushTimeout.current);
      }
    };
  }, [config.sessionId]);

  const initializeAI = async () => {
    try {
      setError(null);
      
      // Initialiser la session IA
      if (config.enableInsights) {
        await refreshInsights();
      }
      
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI initialization failed');
      console.error('AI initialization error:', err);
    }
  };

  const getRecommendations = useCallback(async (
    type: 'personalized' | 'trending' | 'similar',
    options: any = {}
  ): Promise<Product[]> => {
    if (!config.enablePersonalization) {
      return [];
    }

    setLoadingRecommendations(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: config.sessionId,
          userId: config.userId,
          type,
          ...options
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const products = data.data.products;
        setRecommendations(products);
        return products;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Recommendations error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      return [];
    } finally {
      setLoadingRecommendations(false);
    }
  }, [config.sessionId, config.userId, config.enablePersonalization]);

  const search = useCallback(async (query: string, filters: any = {}) => {
    if (!config.enableSmartSearch) {
      throw new Error('Smart search not enabled');
    }

    try {
      const searchParams = new URLSearchParams({
        q: query,
        sessionId: config.sessionId,
        ...filters
      });

      const response = await fetch(`/api/ai/search?${searchParams}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Search error:', err);
      throw err;
    }
  }, [config.sessionId, config.enableSmartSearch]);

  const autocomplete = useCallback(async (query: string): Promise<any[]> => {
    if (!config.enableSmartSearch || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(`/api/ai/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        const suggestions = data.data.suggestions;
        setSearchSuggestions(suggestions);
        return suggestions;
      } else {
        return [];
      }
    } catch (err) {
      console.error('Autocomplete error:', err);
      return [];
    }
  }, [config.enableSmartSearch]);

  const trackEvent = useCallback((event: string, data: any = {}) => {
    const eventData = {
      type: event,
      timestamp: Date.now(),
      sessionId: config.sessionId,
      userId: config.userId,
      ...data
    };

    // Ajouter à la queue
    eventQueue.current.push(eventData);

    // Planifier le flush si pas déjà planifié
    if (!flushTimeout.current) {
      flushTimeout.current = setTimeout(flushEvents, 2000); // Flush après 2 secondes
    }

    // Flush immédiatement si la queue est pleine
    if (eventQueue.current.length >= 10) {
      flushEvents();
    }
  }, [config.sessionId, config.userId]);

  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0) return;

    const events = [...eventQueue.current];
    eventQueue.current = [];

    if (flushTimeout.current) {
      clearTimeout(flushTimeout.current);
      flushTimeout.current = null;
    }

    try {
      await fetch('/api/ai/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: config.sessionId,
          userId: config.userId,
          events: events.map(e => ({
            type: e.type,
            ...e
          }))
        })
      });
    } catch (err) {
      console.error('Event tracking error:', err);
      // Remettre les événements en queue en cas d'erreur
      eventQueue.current.unshift(...events);
    }
  }, [config.sessionId, config.userId]);

  const refreshInsights = useCallback(async () => {
    if (!config.enableInsights) return;

    setLoadingInsights(true);
    try {
      const response = await fetch(
        `/api/ai/behavior?sessionId=${config.sessionId}${config.userId ? `&userId=${config.userId}` : ''}`
      );
      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
      } else if (data.error !== 'No behavior data found') {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Insights error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoadingInsights(false);
    }
  }, [config.sessionId, config.userId, config.enableInsights]);

  const personalizeContent = useCallback((content: any[], type: string) => {
    if (!config.enablePersonalization || !insights) {
      return content;
    }

    const profile = insights.profile;
    if (!profile) return content;

    // Appliquer la personnalisation basée sur le profil
    return content
      .map(item => {
        let score = 0;

        // Score basé sur les catégories préférées
        if (profile.preferredCategories.includes(item.category)) {
          score += 30;
        }

        // Score basé sur les couleurs préférées
        if (item.colors?.some((color: string) => profile.preferredColors.includes(color))) {
          score += 20;
        }

        // Score basé sur la gamme de prix
        if (item.price) {
          const price = parseFloat(item.price.replace('EUR', ''));
          const [minPrice, maxPrice] = profile.priceRange;
          if (price >= minPrice && price <= maxPrice) {
            score += 25;
          }
        }

        // Score basé sur les segments
        if (profile.segments.includes('premium_customer') && item.premium) {
          score += 15;
        }

        return { ...item, personalizationScore: score };
      })
      .sort((a, b) => (b.personalizationScore || 0) - (a.personalizationScore || 0));
  }, [config.enablePersonalization, insights]);

  // Helpers pour les événements courants
  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page });
  }, [trackEvent]);

  const trackProductView = useCallback((productId: string, productData?: any) => {
    trackEvent('product_view', { 
      productId, 
      ...productData,
      timeSpent: Date.now() // Sera calculé côté serveur
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, results?: number) => {
    trackEvent('search', { query, resultCount: results });
  }, [trackEvent]);

  const trackAddToCart = useCallback((productId: string, quantity: number = 1) => {
    trackEvent('add_to_cart', { productId, quantity });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderId: string, items: any[], total: number) => {
    trackEvent('purchase', { orderId, items, total });
  }, [trackEvent]);

  return {
    // Recommandations
    recommendations,
    loadingRecommendations,
    getRecommendations,
    
    // Recherche
    search,
    autocomplete,
    searchSuggestions,
    
    // Tracking
    trackEvent,
    trackPageView,
    trackProductView,
    trackSearch,
    trackAddToCart,
    trackPurchase,
    
    // Insights
    insights,
    loadingInsights,
    refreshInsights,
    
    // Personnalisation
    personalizeContent,
    
    // État
    isReady,
    error
  } as any;
}

// Hook spécialisé pour les recommandations
export function useRecommendations(sessionId: string, userId?: string) {
  return useAI({
    sessionId,
    userId,
    enablePersonalization: true,
    enableInsights: true
  });
}

// Hook spécialisé pour la recherche
export function useSmartSearch(sessionId: string) {
  return useAI({
    sessionId,
    enableSmartSearch: true,
    enableInsights: false
  });
}

// Hook spécialisé pour les insights
export function useUserInsights(sessionId: string, userId?: string) {
  return useAI({
    sessionId,
    userId,
    enableInsights: true,
    enablePersonalization: false
  });
}

// Context Provider pour partager l'état AI

const AIContext = createContext<UseAIReturn | null>(null);

interface AIProviderProps {
  children: ReactNode;
  config: AIConfig;
}

export function AIProvider({ children, config }: AIProviderProps) {
  const ai = useAI(config);

  return (
    <AIContext.Provider value={ai}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
}
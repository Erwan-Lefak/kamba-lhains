import { Product } from '../../types';

// Types pour le système de personnalisation
interface UserBehavior {
  userId?: string;
  sessionId: string;
  viewedProducts: string[];
  purchasedProducts: string[];
  favoriteProducts: string[];
  searchQueries: string[];
  timeSpentOnProducts: Record<string, number>;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  location?: {
    country: string;
    city?: string;
  };
  preferences: {
    priceRange: [number, number];
    categories: string[];
    colors: string[];
    sizes: string[];
    brands: string[];
  };
}

interface RecommendationEngine {
  collaborative: (userId: string, products: Product[]) => Promise<Product[]>;
  contentBased: (userBehavior: UserBehavior, products: Product[]) => Product[];
  hybrid: (userId: string, userBehavior: UserBehavior, products: Product[]) => Promise<Product[]>;
  trending: (timeframe: 'day' | 'week' | 'month') => Promise<Product[]>;
  personalized: (userBehavior: UserBehavior) => Promise<Product[]>;
}

class AIPersonalizationEngine implements RecommendationEngine {
  private behaviorStore: Map<string, UserBehavior> = new Map();
  private productSimilarity: Map<string, string[]> = new Map();

  // Collecte des données comportementales
  trackUserBehavior(sessionId: string, action: string, data: any) {
    const behavior = this.behaviorStore.get(sessionId) || this.initializeBehavior(sessionId);
    
    switch (action) {
      case 'view_product':
        behavior.viewedProducts.push(data.productId);
        behavior.timeSpentOnProducts[data.productId] = 
          (behavior.timeSpentOnProducts[data.productId] || 0) + data.timeSpent;
        break;
        
      case 'add_to_favorites':
        behavior.favoriteProducts.push(data.productId);
        break;
        
      case 'search':
        behavior.searchQueries.push(data.query);
        break;
        
      case 'purchase':
        behavior.purchasedProducts.push(data.productId);
        break;
        
      case 'update_preferences':
        behavior.preferences = { ...behavior.preferences, ...data.preferences };
        break;
    }
    
    this.behaviorStore.set(sessionId, behavior);
    this.persistBehavior(sessionId, behavior);
  }

  // Filtrage collaboratif
  async collaborative(userId: string, products: Product[]): Promise<Product[]> {
    // Simulation d'un algorithme collaboratif simplifié
    const userBehavior = await this.getUserBehavior(userId);
    const similarUsers = await this.findSimilarUsers(userId);
    
    const recommendedProducts = new Set<string>();
    
    similarUsers.forEach(similarUser => {
      similarUser.purchasedProducts.forEach(productId => {
        if (!userBehavior.purchasedProducts.includes(productId) && 
            !userBehavior.viewedProducts.includes(productId)) {
          recommendedProducts.add(productId);
        }
      });
    });
    
    return products.filter(p => recommendedProducts.has(p.id.toString())).slice(0, 10);
  }

  // Filtrage basé sur le contenu
  contentBased(userBehavior: UserBehavior, products: Product[]): Product[] {
    const scores = new Map<string, number>();
    
    products.forEach(product => {
      let score = 0;
      
      // Score basé sur les catégories préférées
      if (userBehavior.preferences.categories.includes(product.category)) {
        score += 3;
      }
      
      // Score basé sur la gamme de prix
      const [minPrice, maxPrice] = userBehavior.preferences.priceRange;
      const productPrice = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
        : product.price;
      if (productPrice >= minPrice && productPrice <= maxPrice) {
        score += 2;
      }
      
      // Score basé sur les couleurs préférées
      if (product.colors?.some(color => userBehavior.preferences.colors.includes(color))) {
        score += 1;
      }
      
      // Score basé sur l'historique de navigation
      const viewCount = userBehavior.viewedProducts.filter(id => id === product.id.toString()).length;
      score += viewCount * 0.5;
      
      // Score basé sur le temps passé sur des produits similaires
      const timeSpent = userBehavior.timeSpentOnProducts[product.id.toString()] || 0;
      score += timeSpent / 1000; // Convertir ms en bonus
      
      scores.set(product.id.toString(), score);
    });
    
    return products
      .sort((a, b) => (scores.get(b.id.toString()) || 0) - (scores.get(a.id.toString()) || 0))
      .slice(0, 12);
  }

  // Algorithme hybride
  async hybrid(userId: string, userBehavior: UserBehavior, products: Product[]): Promise<Product[]> {
    const collaborativeResults = await this.collaborative(userId, products);
    const contentBasedResults = this.contentBased(userBehavior, products);
    
    // Pondération : 60% content-based, 40% collaborative
    const hybridScores = new Map<string, number>();
    
    contentBasedResults.forEach((product, index) => {
      const contentScore = (contentBasedResults.length - index) / contentBasedResults.length;
      hybridScores.set(product.id.toString(), contentScore * 0.6);
    });
    
    collaborativeResults.forEach((product, index) => {
      const collabScore = (collaborativeResults.length - index) / collaborativeResults.length;
      const currentScore = hybridScores.get(product.id.toString()) || 0;
      hybridScores.set(product.id.toString(), currentScore + (collabScore * 0.4));
    });
    
    return products
      .filter(p => hybridScores.has(p.id.toString()))
      .sort((a, b) => (hybridScores.get(b.id.toString()) || 0) - (hybridScores.get(a.id.toString()) || 0))
      .slice(0, 15);
  }

  // Produits tendance
  async trending(timeframe: 'day' | 'week' | 'month'): Promise<Product[]> {
    // Simulation des tendances basées sur les vues et achats récents
    const trendingData = await this.getTrendingData(timeframe);
    return trendingData.slice(0, 8);
  }

  // Recommandations personnalisées principales
  async personalized(userBehavior: UserBehavior): Promise<Product[]> {
    const products = await this.getAllProducts();
    
    if (userBehavior.userId) {
      return this.hybrid(userBehavior.userId, userBehavior, products);
    }
    
    return this.contentBased(userBehavior, products);
  }

  // Méthodes utilitaires privées
  private initializeBehavior(sessionId: string): UserBehavior {
    return {
      sessionId,
      viewedProducts: [],
      purchasedProducts: [],
      favoriteProducts: [],
      searchQueries: [],
      timeSpentOnProducts: {},
      deviceType: this.detectDeviceType(),
      preferences: {
        priceRange: [0, 1000],
        categories: [],
        colors: [],
        sizes: [],
        brands: []
      }
    };
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private async persistBehavior(sessionId: string, behavior: UserBehavior) {
    // En production, persister dans une base de données
    if (typeof window !== 'undefined') {
      localStorage.setItem(`behavior_${sessionId}`, JSON.stringify(behavior));
    }
  }

  private async getUserBehavior(userId: string): Promise<UserBehavior> {
    // Récupérer depuis la base de données en production
    const stored = typeof window !== 'undefined' 
      ? localStorage.getItem(`behavior_${userId}`)
      : null;
    
    return stored ? JSON.parse(stored) : this.initializeBehavior(userId);
  }

  private async findSimilarUsers(userId: string): Promise<UserBehavior[]> {
    // Simulation - en production, utiliser un algorithme de similarité
    return [];
  }

  private async getTrendingData(timeframe: string): Promise<Product[]> {
    // Simulation - en production, analyser les données de trafic réel
    const products = await this.getAllProducts();
    return products.slice(0, 8);
  }

  private async getAllProducts(): Promise<Product[]> {
    // En production, récupérer depuis l'API
    return [];
  }

  // API publique
  generateRecommendations(sessionId: string, type: 'personalized' | 'trending' | 'similar') {
    const behavior = this.behaviorStore.get(sessionId);
    if (!behavior) return [];

    switch (type) {
      case 'personalized':
        return this.personalized(behavior);
      case 'trending':
        return this.trending('week');
      case 'similar':
        return this.contentBased(behavior, []);
      default:
        return [];
    }
  }
}

// Instance globale
export const personalizationEngine = new AIPersonalizationEngine();

// Hook React pour utiliser la personnalisation
export function usePersonalization(sessionId: string) {
  const trackView = (productId: string, timeSpent: number) => {
    personalizationEngine.trackUserBehavior(sessionId, 'view_product', {
      productId,
      timeSpent
    });
  };

  const trackSearch = (query: string) => {
    personalizationEngine.trackUserBehavior(sessionId, 'search', { query });
  };

  const trackFavorite = (productId: string) => {
    personalizationEngine.trackUserBehavior(sessionId, 'add_to_favorites', {
      productId
    });
  };

  const trackPurchase = (productId: string) => {
    personalizationEngine.trackUserBehavior(sessionId, 'purchase', {
      productId
    });
  };

  const getRecommendations = (type: 'personalized' | 'trending' | 'similar') => {
    return personalizationEngine.generateRecommendations(sessionId, type);
  };

  return {
    trackView,
    trackSearch,
    trackFavorite,
    trackPurchase,
    getRecommendations
  };
}
import { Product } from '../../types';
import { cache } from '../cache/redis';

interface SearchQuery {
  term: string;
  filters?: {
    category?: string;
    priceRange?: [number, number];
    colors?: string[];
    sizes?: string[];
    brands?: string[];
    rating?: number;
  };
  sort?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}

interface SearchResult {
  products: Product[];
  total: number;
  suggestions: string[];
  corrections: string[];
  facets: {
    categories: Array<{ name: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
    colors: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
  };
  metadata: {
    searchTime: number;
    algorithm: string;
    personalizedBoost: boolean;
  };
}

interface SearchSuggestion {
  term: string;
  score: number;
  type: 'product' | 'category' | 'brand' | 'trend';
}

export class SmartSearchEngine {
  private synonyms: Map<string, string[]> = new Map();
  private stopWords: Set<string> = new Set();
  private searchHistory: Map<string, number> = new Map();

  constructor() {
    this.initializeSynonyms();
    this.initializeStopWords();
  }

  /**
   * Recherche principale avec IA
   */
  async search(query: SearchQuery, sessionId?: string): Promise<SearchResult> {
    const startTime = Date.now();
    
    // Nettoyer et analyser la requête
    const processedQuery = this.preprocessQuery(query.term);
    
    // Vérifier le cache de recherche
    const cacheKey = `search:${JSON.stringify({ ...query, term: processedQuery })}`;
    const cached = await cache.get(cacheKey, { tags: ['search', 'ai'] });
    
    if (cached) {
      const cachedResult = cached as any;
      return {
        products: cachedResult.products || [],
        total: cachedResult.total || 0,
        suggestions: cachedResult.suggestions || [],
        corrections: cachedResult.corrections || [],
        facets: cachedResult.facets || {},
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          searchTime: Date.now() - startTime
        }
      };
    }

    // Récupérer tous les produits
    const allProducts = await this.getAllProducts();
    
    // Appliquer les filtres de base
    let filteredProducts = this.applyFilters(allProducts, query.filters);
    
    // Recherche textuelle avec scoring
    const searchResults = this.performTextSearch(filteredProducts, processedQuery);
    
    // Appliquer la personnalisation si session disponible
    let personalizedResults = searchResults;
    if (sessionId) {
      personalizedResults = await this.applyPersonalization(searchResults, sessionId);
    }
    
    // Trier les résultats
    const sortedResults = this.sortResults(personalizedResults, query.sort || 'relevance');
    
    // Pagination
    const paginatedResults = this.paginateResults(
      sortedResults, 
      query.limit || 20, 
      query.offset || 0
    );
    
    // Générer suggestions et corrections
    const suggestions = await this.generateSuggestions(processedQuery, allProducts);
    const corrections = this.generateCorrections(processedQuery);
    
    // Calculer les facettes
    const facets = this.calculateFacets(filteredProducts);
    
    // Enregistrer la recherche pour l'apprentissage
    await this.logSearch(processedQuery, paginatedResults.length, sessionId);

    const result: SearchResult = {
      products: paginatedResults,
      total: sortedResults.length,
      suggestions,
      corrections,
      facets,
      metadata: {
        searchTime: Date.now() - startTime,
        algorithm: sessionId ? 'AI_Personalized' : 'AI_Standard',
        personalizedBoost: !!sessionId
      }
    };

    // Mettre en cache le résultat
    await cache.set(cacheKey, result, {
      ttl: 300, // 5 minutes
      tags: ['search', 'ai']
    });

    return result;
  }

  /**
   * Auto-complétion intelligente
   */
  async autocomplete(partialQuery: string, limit: number = 8): Promise<SearchSuggestion[]> {
    const cacheKey = `autocomplete:${partialQuery.toLowerCase()}`;
    const cached = await cache.get(cacheKey, { tags: ['autocomplete'] });
    
    if (cached) {
      return (cached as SearchSuggestion[]) || [];
    }

    const suggestions: SearchSuggestion[] = [];
    const query = partialQuery.toLowerCase().trim();
    
    if (query.length < 2) {
      return suggestions;
    }

    // Récupérer les produits et construire l'index
    const products = await this.getAllProducts();
    const termFrequency = new Map<string, number>();
    
    // Analyser les noms de produits
    products.forEach(product => {
      const terms = this.tokenize(product.name.toLowerCase());
      terms.forEach(term => {
        if (term.startsWith(query)) {
          termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
        }
      });
      
      // Vérifier les correspondances partielles dans le nom complet
      if (product.name.toLowerCase().includes(query)) {
        suggestions.push({
          term: product.name,
          score: 100 + ((product as any).rating || 0) * 10,
          type: 'product'
        });
      }
    });

    // Ajouter les termes fréquents
    Array.from(termFrequency.entries()).forEach(([term, frequency]) => {
      suggestions.push({
        term,
        score: frequency * 10,
        type: 'product'
      });
    });

    // Ajouter les catégories correspondantes
    const categories = ['robes', 'tops', 'pantalons', 'accessoires', 'chaussures'];
    categories.forEach(category => {
      if (category.includes(query)) {
        suggestions.push({
          term: category,
          score: 50,
          type: 'category'
        });
      }
    });

    // Ajouter les termes tendances
    const trendingTerms = await this.getTrendingSearchTerms();
    trendingTerms.forEach(({ term, score }) => {
      if (term.toLowerCase().includes(query)) {
        suggestions.push({
          term,
          score: score + 20,
          type: 'trend'
        });
      }
    });

    // Trier et limiter
    const finalSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter((suggestion, index, arr) => 
        // Supprimer les doublons
        arr.findIndex(s => s.term.toLowerCase() === suggestion.term.toLowerCase()) === index
      );

    // Cache pour 1 heure
    await cache.set(cacheKey, finalSuggestions, {
      ttl: 3600,
      tags: ['autocomplete']
    });

    return finalSuggestions;
  }

  /**
   * Recherche par image (simulation)
   */
  async searchByImage(imageUrl: string): Promise<Product[]> {
    // Simulation d'une recherche par image
    // En production, intégrer avec un service de vision par ordinateur
    
    const products = await this.getAllProducts();
    
    // Simuler l'analyse d'image et retourner des produits similaires
    return products.slice(0, 6).map(product => ({
      ...product,
      similarity: Math.random() * 100
    })).sort((a, b) => (b as any).similarity - (a as any).similarity);
  }

  /**
   * Recherche vocale
   */
  async searchByVoice(audioBlob: Blob): Promise<SearchResult> {
    // Simulation de reconnaissance vocale
    // En production, intégrer avec un service de speech-to-text
    
    const simulatedText = "robe élégante noir";
    return this.search({ term: simulatedText });
  }

  // Méthodes privées

  private preprocessQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  private tokenize(text: string): string[] {
    return text.split(/\s+/).filter(token => 
      token.length > 1 && !this.stopWords.has(token)
    );
  }

  private applyFilters(products: Product[], filters?: SearchQuery['filters']): Product[] {
    if (!filters) return products;

    return products.filter(product => {
      // Filtre de catégorie
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filtre de prix
      if (filters.priceRange) {
        const price = typeof product.price === 'string' 
          ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
          : product.price;
        const [min, max] = filters.priceRange;
        if (price < min || price > max) {
          return false;
        }
      }

      // Filtre de couleurs
      if (filters.colors && filters.colors.length > 0) {
        const productColors = (product as any).colors || [];
        if (!filters.colors.some(color => productColors.includes(color))) {
          return false;
        }
      }

      // Filtre de tailles
      if (filters.sizes && filters.sizes.length > 0) {
        const productSizes = (product as any).sizes || [];
        if (!filters.sizes.some(size => productSizes.includes(size))) {
          return false;
        }
      }

      // Filtre de notation
      if (filters.rating) {
        const rating = (product as any).rating || 0;
        if (rating < filters.rating) {
          return false;
        }
      }

      return true;
    });
  }

  private performTextSearch(products: Product[], query: string): Array<Product & { searchScore: number }> {
    const tokens = this.tokenize(query);
    
    return products.map(product => {
      let score = 0;
      const productText = `${product.name} ${product.description || ''} ${(product as any).category || ''}`.toLowerCase();
      
      tokens.forEach(token => {
        // Correspondance exacte dans le nom (score élevé)
        if (product.name.toLowerCase().includes(token)) {
          score += 100;
        }
        
        // Correspondance dans la description
        const desc = product.description as any;
        if (Array.isArray(desc) && desc.some((d: string) => d.toLowerCase().includes(token))) {
          score += 50;
        } else if (typeof desc === 'string' && desc.toLowerCase().includes(token)) {
          score += 50;
        }
        
        // Correspondance dans la catégorie
        if ((product as any).category?.toLowerCase().includes(token)) {
          score += 30;
        }
        
        // Correspondance avec synonymes
        const synonyms = this.synonyms.get(token) || [];
        synonyms.forEach(synonym => {
          if (productText.includes(synonym)) {
            score += 25;
          }
        });
        
        // Score de pertinence basé sur la position
        const index = productText.indexOf(token);
        if (index !== -1) {
          score += Math.max(20 - index, 5);
        }
      });
      
      // Bonus pour les produits populaires
      const rating = (product as any).rating || 0;
      const sales = (product as any).sales || 0;
      score += rating * 5 + Math.log(sales + 1) * 2;
      
      return { ...product, searchScore: score };
    }).filter(item => item.searchScore > 0);
  }

  private async applyPersonalization(
    results: Array<Product & { searchScore: number }>,
    sessionId: string
  ): Promise<Array<Product & { searchScore: number }>> {
    
    try {
      // Récupérer le profil utilisateur
      const behaviorKey = `behavior:${sessionId}`;
      const userBehavior = await cache.get(behaviorKey, { tags: ['behavior'] });
      
      if (!userBehavior) {
        return results;
      }
      
      const profile = (userBehavior as any).profile;
      
      return results.map(item => {
        let personalizedScore = item.searchScore;
        
        // Boost pour les catégories préférées
        if (profile.preferredCategories.includes((item as any).category)) {
          personalizedScore *= 1.5;
        }
        
        // Boost pour les couleurs préférées
        const itemColors = (item as any).colors || [];
        if (itemColors.some((color: string) => profile.preferredColors.includes(color))) {
          personalizedScore *= 1.3;
        }
        
        // Boost pour la gamme de prix habituelle
        const itemPrice = item.price;
        const [minPrice, maxPrice] = profile.priceRange;
        if (itemPrice >= minPrice && itemPrice <= maxPrice) {
          personalizedScore *= 1.2;
        }
        
        return { ...item, searchScore: personalizedScore };
      });
      
    } catch (error) {
      console.error('Personalization error:', error);
      return results;
    }
  }

  private sortResults(
    results: Array<Product & { searchScore: number }>,
    sortBy: string
  ): Array<Product & { searchScore: number }> {
    
    switch (sortBy) {
      case 'price_low':
        return results.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^\d.]/g, '')) 
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^\d.]/g, '')) 
            : b.price;
          return priceA - priceB;
        });
        
      case 'price_high':
        return results.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^\d.]/g, '')) 
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^\d.]/g, '')) 
            : b.price;
          return priceB - priceA;
        });
        
      case 'rating':
        return results.sort((a, b) => {
          const ratingA = (a as any).rating || 0;
          const ratingB = (b as any).rating || 0;
          return ratingB - ratingA;
        });
        
      case 'newest':
        return results.sort((a, b) => {
          const dateA = new Date((a as any).createdAt || 0).getTime();
          const dateB = new Date((b as any).createdAt || 0).getTime();
          return dateB - dateA;
        });
        
      case 'relevance':
      default:
        return results.sort((a, b) => b.searchScore - a.searchScore);
    }
  }

  private paginateResults(
    results: Array<Product & { searchScore: number }>,
    limit: number,
    offset: number
  ): Product[] {
    return results
      .slice(offset, offset + limit)
      .map(({ searchScore, ...product }) => product);
  }

  private async generateSuggestions(query: string, products: Product[]): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Suggestions basées sur des recherches similaires
    const similarSearches = await this.getSimilarSearches(query);
    suggestions.push(...similarSearches);
    
    // Suggestions basées sur les produits populaires
    const popularProducts = products
      .sort((a, b) => ((b as any).sales || 0) - ((a as any).sales || 0))
      .slice(0, 5);
    
    popularProducts.forEach(product => {
      suggestions.push(product.name);
    });
    
    return Array.from(new Set(suggestions)).slice(0, 6);
  }

  private generateCorrections(query: string): string[] {
    // Simulation de correction orthographique
    const corrections: string[] = [];
    
    const commonMistakes = new Map([
      ['rob', 'robe'],
      ['pantalone', 'pantalon'],
      ['accesoire', 'accessoire'],
      ['blous', 'blouse']
    ]);
    
    const tokens = this.tokenize(query);
    tokens.forEach(token => {
      if (commonMistakes.has(token)) {
        const corrected = query.replace(token, commonMistakes.get(token)!);
        if (corrected !== query) {
          corrections.push(corrected);
        }
      }
    });
    
    return corrections;
  }

  private calculateFacets(products: Product[]) {
    const categories = new Map<string, number>();
    const colors = new Map<string, number>();
    const brands = new Map<string, number>();
    const priceRanges = new Map<string, number>();
    
    products.forEach(product => {
      // Catégories
      const category = (product as any).category || 'Autre';
      categories.set(category, (categories.get(category) || 0) + 1);
      
      // Couleurs
      const productColors = (product as any).colors || [];
      productColors.forEach((color: string) => {
        colors.set(color, (colors.get(color) || 0) + 1);
      });
      
      // Marques
      const brand = (product as any).brand || 'Sans marque';
      brands.set(brand, (brands.get(brand) || 0) + 1);
      
      // Gammes de prix
      const price = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^\d.]/g, '')) 
        : product.price;
      let priceRange = '';
      if (price < 50) priceRange = 'Moins de 50EUR';
      else if (price < 100) priceRange = '50EUR - 100EUR';
      else if (price < 200) priceRange = '100EUR - 200EUR';
      else priceRange = 'Plus de 200EUR';
      
      priceRanges.set(priceRange, (priceRanges.get(priceRange) || 0) + 1);
    });
    
    return {
      categories: Array.from(categories.entries()).map(([name, count]) => ({ name, count })),
      colors: Array.from(colors.entries()).map(([name, count]) => ({ name, count })),
      brands: Array.from(brands.entries()).map(([name, count]) => ({ name, count })),
      priceRanges: Array.from(priceRanges.entries()).map(([range, count]) => ({ range, count }))
    };
  }

  private async logSearch(query: string, resultCount: number, sessionId?: string) {
    const searchLog = {
      query,
      resultCount,
      sessionId,
      timestamp: Date.now()
    };
    
    // Logger pour analytics
    await cache.set(
      `search_log:${Date.now()}:${Math.random()}`,
      searchLog,
      { ttl: 86400 * 7, tags: ['search_logs'] }
    );
    
    // Mettre à jour les statistiques de recherche
    this.searchHistory.set(query, (this.searchHistory.get(query) || 0) + 1);
  }

  private async getAllProducts(): Promise<Product[]> {
    // Simuler une base de données de produits
    return [
      {
        id: "1",
        name: 'Robe Aube Dorée',
        price: 145,
        description: ['Robe élégante pour soirée avec détails brodés'],
        image: '/images/aube-doree.jpg',
        colors: ['Doré'],
        sizes: ['S', 'M', 'L'],
        inStock: true,
        featured: true,
        category: 'robes'
      },
      {
        id: "2",
        name: 'Blouse Zenith Blanc',
        price: 145,
        description: ['Blouse professionnelle en coton bio'],
        image: '/images/zenith-blouse.jpg',
        colors: ['Blanc'],
        sizes: ['S', 'M', 'L', 'XL'],
        inStock: true,
        featured: false,
        category: 'tops'
      },
      {
        id: "3",
        name: 'Pantalon Crépuscule Noir',
        price: 145,
        description: ['Pantalon tailleur confortable et élégant'],
        image: '/images/crepuscule-pantalon.jpg',
        colors: ['Noir'],
        sizes: ['36', '38', '40', '42'],
        inStock: true,
        featured: false,
        category: 'pantalons'
      }
      // Plus de produits...
    ];
  }

  private async getTrendingSearchTerms(): Promise<Array<{ term: string; score: number }>> {
    return [
      { term: 'robe soirée', score: 95 },
      { term: 'blouse travail', score: 87 },
      { term: 'accessoires', score: 76 },
      { term: 'nouveau', score: 65 }
    ];
  }

  private async getSimilarSearches(query: string): Promise<string[]> {
    // Simulation de recherches similaires
    const similar = new Map([
      ['robe', ['robe soirée', 'robe casual', 'robe été']],
      ['blouse', ['blouse travail', 'blouse blanche', 'blouse élégante']],
      ['pantalon', ['pantalon tailleur', 'pantalon casual', 'pantalon droit']]
    ]);
    
    const tokens = this.tokenize(query);
    const suggestions: string[] = [];
    
    tokens.forEach(token => {
      const sims = similar.get(token) || [];
      suggestions.push(...sims);
    });
    
    return Array.from(new Set(suggestions));
  }

  private initializeSynonyms() {
    this.synonyms.set('robe', ['dress', 'vestido', 'abito']);
    this.synonyms.set('blouse', ['chemise', 'top', 'shirt']);
    this.synonyms.set('pantalon', ['trouser', 'jean', 'pants']);
    this.synonyms.set('noir', ['black', 'sombre', 'foncé']);
    this.synonyms.set('blanc', ['white', 'clair', 'écru']);
    this.synonyms.set('élégant', ['chic', 'raffiné', 'sophistiqué']);
  }

  private initializeStopWords() {
    const stopWordsList = [
      'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une',
      'et', 'ou', 'pour', 'avec', 'sans', 'sur', 'sous',
      'dans', 'par', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes'
    ];
    
    stopWordsList.forEach(word => this.stopWords.add(word));
  }
}

// Instance globale
export const smartSearch = new SmartSearchEngine();
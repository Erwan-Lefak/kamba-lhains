import { NextApiRequest, NextApiResponse } from 'next';
import { personalizationEngine } from '../../../lib/ai/personalization';
import { cache } from '../../../lib/cache/redis';

interface RecommendationRequest {
  sessionId: string;
  userId?: string;
  type: 'personalized' | 'trending' | 'similar' | 'cross_sell' | 'upsell';
  productId?: string;
  category?: string;
  priceRange?: [number, number];
  limit?: number;
  excludeIds?: string[];
}

interface RecommendationResponse {
  success: boolean;
  data?: {
    products: any[];
    algorithm: string;
    confidence: number;
    reasoning: string[];
    metadata: {
      totalCandidates: number;
      processingTime: number;
      cacheHit: boolean;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecommendationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const startTime = Date.now();

  try {
    const {
      sessionId,
      userId,
      type,
      productId,
      category,
      priceRange,
      limit = 12,
      excludeIds = []
    }: RecommendationRequest = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    // Générer la clé de cache
    const cacheKey = `recommendations:${type}:${sessionId}:${userId || 'anonymous'}:${productId || 'none'}`;
    
    // Vérifier le cache d'abord
    let cachedResult = await cache.get(cacheKey, { tags: ['recommendations', 'ai'] });
    let cacheHit = false;

    if (cachedResult && !req.query.refresh) {
      cacheHit = true;
      return res.status(200).json({
        success: true,
        data: {
          ...cachedResult,
          metadata: {
            ...cachedResult.metadata,
            cacheHit: true,
            processingTime: Date.now() - startTime
          }
        }
      });
    }

    // Récupérer tous les produits disponibles
    const allProducts = await getAllProducts();
    let filteredProducts = allProducts;

    // Filtrer par catégorie si spécifiée
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // Filtrer par gamme de prix si spécifiée
    if (priceRange) {
      filteredProducts = filteredProducts.filter(p => {
        const price = parseFloat(p.price.replace('€', ''));
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    // Exclure les produits spécifiés
    if (excludeIds.length > 0) {
      filteredProducts = filteredProducts.filter(p => !excludeIds.includes(p.id.toString()));
    }

    let recommendations: any[] = [];
    let algorithm = '';
    let reasoning: string[] = [];
    let confidence = 0;

    // Générer les recommandations selon le type
    switch (type) {
      case 'personalized':
        algorithm = 'Hybrid AI (Content-Based + Collaborative)';
        recommendations = await generatePersonalizedRecommendations(
          sessionId, userId, filteredProducts, limit
        );
        reasoning = [
          'Analyse du comportement utilisateur',
          'Préférences historiques',
          'Similarité avec autres utilisateurs',
          'Tendances actuelles'
        ];
        confidence = calculateConfidence(sessionId, recommendations.length);
        break;

      case 'trending':
        algorithm = 'Trending Algorithm';
        recommendations = await generateTrendingRecommendations(filteredProducts, limit);
        reasoning = [
          'Popularité récente',
          'Taux de conversion élevé',
          'Engagement utilisateur',
          'Saisonnalité'
        ];
        confidence = 85;
        break;

      case 'similar':
        if (!productId) {
          return res.status(400).json({
            success: false,
            error: 'productId is required for similar recommendations'
          });
        }
        algorithm = 'Content-Based Similarity';
        recommendations = await generateSimilarRecommendations(
          productId, filteredProducts, limit
        );
        reasoning = [
          'Similarité de catégorie',
          'Gamme de prix similaire',
          'Caractéristiques communes',
          'Style et couleurs'
        ];
        confidence = 90;
        break;

      case 'cross_sell':
        algorithm = 'Cross-Sell Intelligence';
        recommendations = await generateCrossSellRecommendations(
          sessionId, filteredProducts, limit
        );
        reasoning = [
          'Produits complémentaires',
          'Achats fréquents ensemble',
          'Complétion de look',
          'Accessoires associés'
        ];
        confidence = 75;
        break;

      case 'upsell':
        algorithm = 'Upsell Intelligence';
        recommendations = await generateUpsellRecommendations(
          sessionId, filteredProducts, limit
        );
        reasoning = [
          'Gamme de prix supérieure',
          'Qualité premium',
          'Fonctionnalités avancées',
          'Marques haut de gamme'
        ];
        confidence = 70;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid recommendation type'
        });
    }

    const processingTime = Date.now() - startTime;

    const result = {
      products: recommendations.slice(0, limit),
      algorithm,
      confidence,
      reasoning,
      metadata: {
        totalCandidates: filteredProducts.length,
        processingTime,
        cacheHit: false
      }
    };

    // Mettre en cache le résultat
    await cache.set(cacheKey, result, {
      ttl: type === 'trending' ? 300 : 1800, // 5min pour trending, 30min pour autres
      tags: ['recommendations', 'ai', `type:${type}`]
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function getAllProducts(): Promise<any[]> {
  // Simuler une base de données de produits
  return [
    {
      id: 1,
      name: 'Robe Aube Dorée',
      price: '145€',
      category: 'robes',
      image: '/images/aube-doree.jpg',
      colors: ['or', 'beige'],
      tags: ['elegant', 'soiree', 'premium'],
      rating: 4.8,
      sales: 156
    },
    {
      id: 2,
      name: 'Blouse Zenith',
      price: '89€',
      category: 'tops',
      image: '/images/zenith-blouse.jpg',
      colors: ['blanc', 'noir'],
      tags: ['casual', 'travail', 'versatile'],
      rating: 4.6,
      sales: 98
    },
    {
      id: 3,
      name: 'Pantalon Crépuscule',
      price: '125€',
      category: 'pantalons',
      image: '/images/crepuscule-pantalon.jpg',
      colors: ['noir', 'marine'],
      tags: ['elegant', 'travail', 'confort'],
      rating: 4.7,
      sales: 134
    },
    // Ajouter plus de produits...
  ];
}

async function generatePersonalizedRecommendations(
  sessionId: string,
  userId: string | undefined,
  products: any[],
  limit: number
): Promise<any[]> {
  // Récupérer le comportement utilisateur
  const behavior = await getUserBehavior(sessionId, userId);
  
  // Calculer les scores personnalisés
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Score basé sur les catégories préférées
    if (behavior.preferredCategories.includes(product.category)) {
      score += 30;
    }
    
    // Score basé sur les couleurs préférées
    if (product.colors?.some(color => behavior.preferredColors.includes(color))) {
      score += 20;
    }
    
    // Score basé sur la gamme de prix habituelle
    const productPrice = parseFloat(product.price.replace('€', ''));
    const avgPrice = behavior.averagePriceRange;
    if (productPrice >= avgPrice[0] && productPrice <= avgPrice[1]) {
      score += 25;
    }
    
    // Score basé sur les évaluations
    score += (product.rating || 0) * 5;
    
    // Score basé sur la popularité
    score += Math.log(product.sales || 1) * 2;
    
    // Bonus pour les nouveaux produits non vus
    if (!behavior.viewedProducts.includes(product.id.toString())) {
      score += 10;
    }
    
    return { ...product, score };
  });
  
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function generateTrendingRecommendations(
  products: any[],
  limit: number
): Promise<any[]> {
  // Simuler l'algorithme de tendances
  const trendingScore = products.map(product => ({
    ...product,
    trendScore: (product.sales || 0) * 0.3 + (product.rating || 0) * 20 + Math.random() * 10
  }));
  
  return trendingScore
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, limit);
}

async function generateSimilarRecommendations(
  productId: string,
  products: any[],
  limit: number
): Promise<any[]> {
  const targetProduct = products.find(p => p.id.toString() === productId);
  if (!targetProduct) return [];
  
  const similarProducts = products
    .filter(p => p.id.toString() !== productId)
    .map(product => {
      let similarity = 0;
      
      // Similarité de catégorie
      if (product.category === targetProduct.category) {
        similarity += 40;
      }
      
      // Similarité de prix
      const targetPrice = parseFloat(targetProduct.price.replace('€', ''));
      const productPrice = parseFloat(product.price.replace('€', ''));
      const priceDiff = Math.abs(targetPrice - productPrice);
      similarity += Math.max(0, 30 - (priceDiff / 10));
      
      // Similarité de couleurs
      const commonColors = product.colors?.filter(color => 
        targetProduct.colors?.includes(color)
      ) || [];
      similarity += commonColors.length * 10;
      
      // Similarité de tags
      const commonTags = product.tags?.filter(tag => 
        targetProduct.tags?.includes(tag)
      ) || [];
      similarity += commonTags.length * 5;
      
      return { ...product, similarity };
    });
  
  return similarProducts
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

async function generateCrossSellRecommendations(
  sessionId: string,
  products: any[],
  limit: number
): Promise<any[]> {
  // Logique de cross-sell basée sur les complémentarités
  const behavior = await getUserBehavior(sessionId);
  
  const crossSellProducts = products.map(product => {
    let crossSellScore = 0;
    
    // Si l'utilisateur regarde des robes, suggérer des accessoires
    if (behavior.viewedCategories.includes('robes') && 
        ['accessoires', 'chaussures', 'sacs'].includes(product.category)) {
      crossSellScore += 40;
    }
    
    // Si l'utilisateur regarde des tops, suggérer des bas
    if (behavior.viewedCategories.includes('tops') && 
        ['pantalons', 'jupes'].includes(product.category)) {
      crossSellScore += 35;
    }
    
    // Complémentarité de couleurs
    if (behavior.preferredColors.some(color => product.colors?.includes(color))) {
      crossSellScore += 20;
    }
    
    crossSellScore += (product.rating || 0) * 5;
    
    return { ...product, crossSellScore };
  });
  
  return crossSellProducts
    .sort((a, b) => b.crossSellScore - a.crossSellScore)
    .slice(0, limit);
}

async function generateUpsellRecommendations(
  sessionId: string,
  products: any[],
  limit: number
): Promise<any[]> {
  const behavior = await getUserBehavior(sessionId);
  const avgPrice = behavior.averagePriceRange[1]; // Prix max habituel
  
  // Filtrer les produits plus chers mais pas trop
  const upsellProducts = products
    .filter(product => {
      const price = parseFloat(product.price.replace('€', ''));
      return price > avgPrice && price <= avgPrice * 1.5; // Max 50% plus cher
    })
    .map(product => ({
      ...product,
      upsellScore: (product.rating || 0) * 20 + (product.sales || 0) * 0.1
    }));
  
  return upsellProducts
    .sort((a, b) => b.upsellScore - a.upsellScore)
    .slice(0, limit);
}

async function getUserBehavior(sessionId: string, userId?: string) {
  // Simuler la récupération du comportement utilisateur
  return {
    preferredCategories: ['robes', 'tops'],
    preferredColors: ['noir', 'blanc', 'beige'],
    averagePriceRange: [80, 150],
    viewedProducts: ['1', '3'],
    viewedCategories: ['robes', 'pantalons'],
    purchaseHistory: []
  };
}

function calculateConfidence(sessionId: string, resultCount: number): number {
  // Calculer la confiance basée sur la quantité de données utilisateur
  const baseConfidence = 60;
  const dataBonus = Math.min(resultCount * 3, 30);
  return Math.min(baseConfidence + dataBonus, 95);
}
import { NextApiRequest, NextApiResponse } from 'next';
import { cache } from '../../../lib/cache/redis';

interface BehaviorEvent {
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'purchase' | 'search' | 'filter_apply' | 'favorite_add';
  productId?: string;
  category?: string;
  searchQuery?: string;
  filters?: Record<string, any>;
  timeSpent?: number;
  page?: string;
  metadata?: Record<string, any>;
}

interface TrackRequest {
  sessionId: string;
  userId?: string;
  events: BehaviorEvent[];
  timestamp?: number;
}

interface BehaviorResponse {
  success: boolean;
  message?: string;
  insights?: {
    profile: UserProfile;
    recommendations: string[];
    nextBestAction: string;
  };
  error?: string;
}

interface UserProfile {
  segments: string[];
  interests: string[];
  priceRange: [number, number];
  preferredCategories: string[];
  preferredColors: string[];
  behaviors: {
    isFrequentBrowser: boolean;
    isImpulseBuyer: boolean;
    isPriceConscious: boolean;
    isLoyalCustomer: boolean;
  };
  engagement: {
    sessionCount: number;
    avgSessionDuration: number;
    conversionRate: number;
    lastActivity: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BehaviorResponse>
) {
  if (req.method === 'POST') {
    return trackBehavior(req, res);
  } else if (req.method === 'GET') {
    return getBehaviorInsights(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }
}

async function trackBehavior(
  req: NextApiRequest,
  res: NextApiResponse<BehaviorResponse>
) {
  try {
    const { sessionId, userId, events, timestamp = Date.now() }: TrackRequest = req.body;

    if (!sessionId || !events || events.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and events are required'
      });
    }

    // Clé de cache pour le comportement utilisateur
    const behaviorKey = `behavior:${userId || sessionId}`;
    
    // Récupérer le comportement existant
    let userBehavior = await cache.get(behaviorKey, { tags: ['behavior', 'ai'] }) || {
      sessionId,
      userId,
      events: [],
      profile: initializeProfile(),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // Ajouter les nouveaux événements
    const processedEvents = events.map(event => ({
      ...event,
      timestamp,
      sessionId
    }));

    userBehavior.events.push(...processedEvents);
    userBehavior.updatedAt = timestamp;

    // Analyser et mettre à jour le profil
    userBehavior.profile = await analyzeUserProfile(userBehavior.events);

    // Sauvegarder le comportement mis à jour
    await cache.set(behaviorKey, userBehavior, {
      ttl: 86400 * 30, // 30 jours
      tags: ['behavior', 'ai', `session:${sessionId}`]
    });

    // Générer des insights en temps réel
    const insights = await generateInsights(userBehavior);

    // Mettre à jour les statistiques globales
    await updateGlobalStats(events);

    res.status(200).json({
      success: true,
      message: `Tracked ${events.length} behavior events`,
      insights
    });

  } catch (error) {
    console.error('Behavior tracking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function getBehaviorInsights(
  req: NextApiRequest,
  res: NextApiResponse<BehaviorResponse>
) {
  try {
    const { sessionId, userId } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const behaviorKey = `behavior:${userId || sessionId}`;
    const userBehavior = await cache.get(behaviorKey, { tags: ['behavior'] });

    if (!userBehavior) {
      return res.status(404).json({
        success: false,
        error: 'No behavior data found'
      });
    }

    const insights = await generateInsights(userBehavior);

    res.status(200).json({
      success: true,
      insights
    });

  } catch (error) {
    console.error('Behavior insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

function initializeProfile(): UserProfile {
  return {
    segments: [],
    interests: [],
    priceRange: [0, 1000],
    preferredCategories: [],
    preferredColors: [],
    behaviors: {
      isFrequentBrowser: false,
      isImpulseBuyer: false,
      isPriceConscious: false,
      isLoyalCustomer: false
    },
    engagement: {
      sessionCount: 0,
      avgSessionDuration: 0,
      conversionRate: 0,
      lastActivity: new Date().toISOString()
    }
  };
}

async function analyzeUserProfile(events: any[]): Promise<UserProfile> {
  const profile = initializeProfile();
  
  if (events.length === 0) return profile;

  // Analyser les catégories préférées
  const categoryViews = new Map<string, number>();
  const colorViews = new Map<string, number>();
  const pricePoints: number[] = [];
  let totalTimeSpent = 0;
  let purchaseCount = 0;
  let searchCount = 0;

  events.forEach(event => {
    switch (event.type) {
      case 'product_view':
        if (event.category) {
          categoryViews.set(event.category, (categoryViews.get(event.category) || 0) + 1);
        }
        if (event.metadata?.price) {
          const price = parseFloat(event.metadata.price.replace('€', ''));
          if (!isNaN(price)) pricePoints.push(price);
        }
        if (event.metadata?.colors) {
          event.metadata.colors.forEach((color: string) => {
            colorViews.set(color, (colorViews.get(color) || 0) + 1);
          });
        }
        if (event.timeSpent) {
          totalTimeSpent += event.timeSpent;
        }
        break;
        
      case 'purchase':
        purchaseCount++;
        break;
        
      case 'search':
        searchCount++;
        break;
    }
  });

  // Calculer les préférences
  profile.preferredCategories = Array.from(categoryViews.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category);

  profile.preferredColors = Array.from(colorViews.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([color]) => color);

  // Calculer la gamme de prix préférée
  if (pricePoints.length > 0) {
    pricePoints.sort((a, b) => a - b);
    const q1 = pricePoints[Math.floor(pricePoints.length * 0.25)];
    const q3 = pricePoints[Math.floor(pricePoints.length * 0.75)];
    profile.priceRange = [q1 || 0, q3 || 1000];
  }

  // Analyser les comportements
  const productViews = events.filter(e => e.type === 'product_view').length;
  const sessionDuration = totalTimeSpent / 1000; // en secondes

  profile.behaviors.isFrequentBrowser = productViews > 20;
  profile.behaviors.isImpulseBuyer = purchaseCount > 0 && sessionDuration < 300; // < 5 min
  profile.behaviors.isPriceConscious = searchCount > 5 || (pricePoints.length > 0 && Math.max(...pricePoints) < 100);
  profile.behaviors.isLoyalCustomer = purchaseCount > 1;

  // Calculer l'engagement
  const sessions = new Set(events.map(e => e.sessionId)).size;
  profile.engagement.sessionCount = sessions;
  profile.engagement.avgSessionDuration = sessionDuration / sessions;
  profile.engagement.conversionRate = sessions > 0 ? (purchaseCount / sessions) * 100 : 0;
  profile.engagement.lastActivity = new Date().toISOString();

  // Déterminer les segments
  profile.segments = determineSegments(profile);
  profile.interests = determineInterests(events, profile);

  return profile;
}

function determineSegments(profile: UserProfile): string[] {
  const segments: string[] = [];

  // Segments basés sur le comportement
  if (profile.behaviors.isFrequentBrowser) {
    segments.push('browser_enthusiast');
  }
  
  if (profile.behaviors.isImpulseBuyer) {
    segments.push('impulse_buyer');
  }
  
  if (profile.behaviors.isPriceConscious) {
    segments.push('price_conscious');
  }
  
  if (profile.behaviors.isLoyalCustomer) {
    segments.push('loyal_customer');
  }

  // Segments basés sur l'engagement
  if (profile.engagement.conversionRate > 10) {
    segments.push('high_converter');
  } else if (profile.engagement.conversionRate > 0) {
    segments.push('occasional_buyer');
  } else {
    segments.push('browser_only');
  }

  // Segments basés sur le prix
  const avgPrice = (profile.priceRange[0] + profile.priceRange[1]) / 2;
  if (avgPrice > 200) {
    segments.push('premium_customer');
  } else if (avgPrice > 100) {
    segments.push('mid_range_customer');
  } else {
    segments.push('budget_conscious');
  }

  return segments;
}

function determineInterests(events: any[], profile: UserProfile): string[] {
  const interests: string[] = [];

  // Intérêts basés sur les catégories
  profile.preferredCategories.forEach(category => {
    switch (category) {
      case 'robes':
        interests.push('formal_wear', 'elegance');
        break;
      case 'tops':
        interests.push('casual_wear', 'versatility');
        break;
      case 'pantalons':
        interests.push('professional_wear', 'comfort');
        break;
      case 'accessoires':
        interests.push('style_completion', 'details');
        break;
    }
  });

  // Intérêts basés sur les recherches
  const searchEvents = events.filter(e => e.type === 'search');
  searchEvents.forEach(event => {
    if (event.searchQuery) {
      const query = event.searchQuery.toLowerCase();
      if (query.includes('soirée') || query.includes('elegant')) {
        interests.push('evening_wear');
      }
      if (query.includes('travail') || query.includes('bureau')) {
        interests.push('work_wear');
      }
      if (query.includes('casual') || query.includes('quotidien')) {
        interests.push('everyday_wear');
      }
    }
  });

  return [...new Set(interests)]; // Supprimer les doublons
}

async function generateInsights(userBehavior: any) {
  const profile = userBehavior.profile;
  const recommendations: string[] = [];
  let nextBestAction = '';

  // Générer des recommandations basées sur le profil
  if (profile.behaviors.isFrequentBrowser && !profile.behaviors.isLoyalCustomer) {
    recommendations.push('Proposer une offre de première commande');
    recommendations.push('Montrer des témoignages clients');
    nextBestAction = 'send_first_buyer_offer';
  }

  if (profile.behaviors.isPriceConscious) {
    recommendations.push('Mettre en avant les promotions');
    recommendations.push('Proposer des produits de la gamme accessible');
    if (!nextBestAction) nextBestAction = 'show_sales_section';
  }

  if (profile.segments.includes('premium_customer')) {
    recommendations.push('Présenter la collection haut de gamme');
    recommendations.push('Proposer un service client premium');
    if (!nextBestAction) nextBestAction = 'show_premium_collection';
  }

  if (profile.engagement.conversionRate === 0 && profile.engagement.sessionCount > 3) {
    recommendations.push('Proposer une assistance shopping personnalisée');
    recommendations.push('Envoyer un code de réduction');
    if (!nextBestAction) nextBestAction = 'offer_personal_shopper';
  }

  return {
    profile,
    recommendations,
    nextBestAction: nextBestAction || 'continue_browsing'
  };
}

async function updateGlobalStats(events: BehaviorEvent[]) {
  const statsKey = 'global_behavior_stats';
  
  let stats = await cache.get(statsKey, { tags: ['stats', 'behavior'] }) || {
    totalEvents: 0,
    eventTypes: {},
    popularCategories: {},
    averageSessionDuration: 0,
    conversionRate: 0,
    lastUpdated: Date.now()
  };

  events.forEach(event => {
    stats.totalEvents++;
    stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
    
    if (event.category) {
      stats.popularCategories[event.category] = (stats.popularCategories[event.category] || 0) + 1;
    }
  });

  stats.lastUpdated = Date.now();

  // Sauvegarder les stats globales
  await cache.set(statsKey, stats, {
    ttl: 86400, // 24 heures
    tags: ['stats', 'behavior', 'global']
  });
}
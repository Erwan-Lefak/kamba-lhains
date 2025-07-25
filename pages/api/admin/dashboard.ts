import { NextApiRequest, NextApiResponse } from 'next';
import { cache } from '../../../lib/cache/redis';

interface DashboardStats {
  sales: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    topProducts: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  orders: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    total: number;
    averageValue: number;
    fulfillmentRate: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    returning: number;
    retention: number;
    segments: {
      vip: number;
      loyal: number;
      occasional: number;
      new: number;
    };
    churnRate: number;
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
    featured: number;
    categories: {
      [key: string]: number;
    };
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      category: string;
    }>;
  };
  performance: {
    pageViews: number;
    uniqueVisitors: number;
    sessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    averageOrderValue: number;
    loadTime: number;
    uptime: number;
    errorRate: number;
  };
  ai: {
    recommendationAccuracy: number;
    personalizedViews: number;
    aiGeneratedSales: number;
    activeModels: number;
    modelPerformance: {
      [key: string]: {
        accuracy: number;
        latency: number;
        usage: number;
      };
    };
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: string;
    priority: 'low' | 'medium' | 'high';
    category: 'system' | 'sales' | 'inventory' | 'security' | 'ai';
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'product' | 'system' | 'ai';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
}

interface DashboardResponse {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Vérification d'authentification admin
  if (!isAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  try {
    const { range = 'today' } = req.query;
    const timeRange = range as 'today' | 'week' | 'month';
    
    // Vérifier le cache
    const cacheKey = `admin_dashboard:${timeRange}`;
    const cached = await cache.get(cacheKey, { tags: ['admin', 'dashboard'] });
    
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached
      });
    }

    // Générer les statistiques
    const stats = await generateDashboardStats(timeRange);
    
    // Mettre en cache pour 5 minutes
    await cache.set(cacheKey, stats, {
      ttl: 300,
      tags: ['admin', 'dashboard', `range:${timeRange}`]
    });

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

async function generateDashboardStats(timeRange: 'today' | 'week' | 'month'): Promise<DashboardStats> {
  // En production, récupérer les vraies données depuis la base
  // Ici on simule des données réalistes
  
  const multipliers = {
    today: 1,
    week: 7,
    month: 30
  };
  
  const mult = multipliers[timeRange];
  const baseDate = new Date();
  
  // Simuler des données de ventes
  const baseSales = Math.floor(Math.random() * 15000) + 5000;
  const todaySales = baseSales;
  const weekSales = baseSales * 7 + Math.floor(Math.random() * 10000);
  const monthSales = weekSales * 4.3 + Math.floor(Math.random() * 50000);
  const salesGrowth = (Math.random() - 0.4) * 25; // Bias towards positive growth
  
  const sales = {
    today: todaySales,
    thisWeek: weekSales,
    thisMonth: monthSales,
    growth: salesGrowth,
    target: todaySales * 1.15,
    trend: salesGrowth > 5 ? 'up' as const : salesGrowth < -5 ? 'down' as const : 'stable' as const,
    topProducts: [
      { id: '1', name: 'Robe Aube Dorée', sales: 156, revenue: 22620 },
      { id: '2', name: 'Blouse Zenith', sales: 98, revenue: 8722 },
      { id: '3', name: 'Pantalon Crépuscule', sales: 134, revenue: 16750 },
      { id: '4', name: 'Robe Émeraude', sales: 89, revenue: 12460 }
    ]
  };

  // Simuler des données de commandes
  const totalOrders = Math.floor(Math.random() * 200) + 50;
  const orders = {
    pending: Math.floor(totalOrders * 0.15),
    processing: Math.floor(totalOrders * 0.25),
    shipped: Math.floor(totalOrders * 0.35),
    delivered: Math.floor(totalOrders * 0.20),
    cancelled: Math.floor(totalOrders * 0.05),
    total: totalOrders,
    averageValue: todaySales / totalOrders,
    fulfillmentRate: 92.5 + Math.random() * 5
  };

  // Simuler des données utilisateurs
  const totalUsers = Math.floor(Math.random() * 10000) + 15000;
  const activeUsers = Math.floor(totalUsers * 0.35);
  const newUsers = Math.floor(Math.random() * 500) + 100;
  const returningUsers = activeUsers - newUsers;
  
  const users = {
    total: totalUsers,
    active: activeUsers,
    new: newUsers,
    returning: returningUsers,
    retention: (returningUsers / activeUsers) * 100,
    segments: {
      vip: Math.floor(totalUsers * 0.05),
      loyal: Math.floor(totalUsers * 0.15),
      occasional: Math.floor(totalUsers * 0.35),
      new: Math.floor(totalUsers * 0.25)
    },
    churnRate: 5 + Math.random() * 10
  };

  // Simuler des données produits
  const totalProducts = Math.floor(Math.random() * 500) + 1200;
  const products = {
    total: totalProducts,
    outOfStock: Math.floor(totalProducts * 0.05),
    lowStock: Math.floor(totalProducts * 0.12),
    featured: Math.floor(totalProducts * 0.08),
    categories: {
      'robes': Math.floor(totalProducts * 0.35),
      'tops': Math.floor(totalProducts * 0.25),
      'pantalons': Math.floor(totalProducts * 0.20),
      'accessoires': Math.floor(totalProducts * 0.15),
      'chaussures': Math.floor(totalProducts * 0.05)
    },
    topSelling: [
      { id: '1', name: 'Robe Aube Dorée', sales: 156, category: 'robes' },
      { id: '2', name: 'Blouse Zenith', sales: 98, category: 'tops' },
      { id: '3', name: 'Pantalon Crépuscule', sales: 134, category: 'pantalons' },
      { id: '4', name: 'Robe Émeraude', sales: 89, category: 'robes' },
      { id: '5', name: 'Veste Éclipse', sales: 76, category: 'tops' }
    ]
  };

  // Simuler des données de performance
  const performance = {
    pageViews: Math.floor(Math.random() * 50000) + 75000,
    uniqueVisitors: Math.floor(Math.random() * 15000) + 25000,
    sessionDuration: Math.floor(Math.random() * 300) + 180, // en secondes
    bounceRate: 25 + Math.random() * 20,
    conversionRate: 2.5 + Math.random() * 2,
    averageOrderValue: todaySales / totalOrders,
    loadTime: 0.8 + Math.random() * 1.2, // en secondes
    uptime: 99.5 + Math.random() * 0.5,
    errorRate: Math.random() * 2 // 0-2%
  };

  // Simuler des données IA
  const aiModels = ['PersonalizationEngine', 'SearchRanking', 'RecommendationHybrid', 'SentimentAnalyzer'];
  const modelPerformance: any = {};
  
  aiModels.forEach(model => {
    modelPerformance[model] = {
      accuracy: 0.85 + Math.random() * 0.10,
      latency: Math.floor(Math.random() * 100) + 20,
      usage: Math.floor(Math.random() * 1000) + 500
    };
  });

  const ai = {
    recommendationAccuracy: 87.5 + Math.random() * 5,
    personalizedViews: Math.floor(Math.random() * 25000) + 45000,
    aiGeneratedSales: todaySales * (0.35 + Math.random() * 0.15), // 35-50% des ventes
    activeModels: aiModels.length,
    modelPerformance
  };

  // Générer des alertes
  const alerts = generateAlerts();
  const recentActivity = generateRecentActivity();

  return {
    sales,
    orders,
    users,
    products,
    performance,
    ai,
    alerts,
    recentActivity
  };
}

function generateAlerts() {
  const possibleAlerts = [
    {
      type: 'warning' as const,
      title: 'Stock faible',
      message: '12 produits ont un stock inférieur à 5 unités',
      priority: 'medium' as const,
      category: 'inventory' as const
    },
    {
      type: 'success' as const,
      title: 'Objectif atteint',
      message: 'Les ventes de la semaine ont dépassé l\'objectif de 15%',
      priority: 'low' as const,
      category: 'sales' as const
    },
    {
      type: 'info' as const,
      title: 'Mise à jour système',
      message: 'Une mise à jour de sécurité sera déployée ce soir',
      priority: 'medium' as const,
      category: 'system' as const
    },
    {
      type: 'warning' as const,
      title: 'Performance IA',
      message: 'Le modèle de recommandations montre une baisse de précision',
      priority: 'high' as const,
      category: 'ai' as const
    },
    {
      type: 'error' as const,
      title: 'Tentative d\'intrusion',
      message: '3 tentatives de connexion suspectes détectées',
      priority: 'high' as const,
      category: 'security' as const
    }
  ];

  return possibleAlerts
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2)
    .map((alert, index) => ({
      id: `alert_${Date.now()}_${index}`,
      ...alert,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }));
}

function generateRecentActivity() {
  const possibleActivities = [
    {
      type: 'order' as const,
      title: 'Nouvelle commande',
      description: 'Commande #12847 passée par Marie Dubois (145€)',
      metadata: { orderId: '12847', amount: 145, customer: 'Marie Dubois' }
    },
    {
      type: 'user' as const,
      title: 'Nouvel utilisateur',
      description: 'Pierre Martin s\'est inscrit depuis Paris',
      metadata: { userId: 'user_1234', location: 'Paris' }
    },
    {
      type: 'product' as const,
      title: 'Produit mis à jour',
      description: 'Robe Aube Dorée - Stock mis à jour (15 → 23 unités)',
      metadata: { productId: 'prod_1', oldStock: 15, newStock: 23 }
    },
    {
      type: 'system' as const,
      title: 'Sauvegarde terminée',
      description: 'Sauvegarde automatique des données completée avec succès',
      metadata: { backupSize: '2.3GB', duration: '12min' }
    },
    {
      type: 'ai' as const,
      title: 'Modèle IA mis à jour',
      description: 'PersonalizationEngine v2.1 déployé avec 3% d\'amélioration',
      metadata: { model: 'PersonalizationEngine', version: '2.1', improvement: 3 }
    }
  ];

  return possibleActivities
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 4) + 6)
    .map((activity, index) => ({
      id: `activity_${Date.now()}_${index}`,
      ...activity,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function isAuthenticated(req: NextApiRequest): boolean {
  // Simuler une vérification d'authentification
  const authHeader = req.headers.authorization;
  const cookieAuth = req.headers.cookie?.includes('admin_token=admin_authenticated');
  
  return !!(authHeader || cookieAuth);
}
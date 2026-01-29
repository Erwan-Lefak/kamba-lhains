import { cache } from '../cache/redis';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  unit: string;
  format: 'currency' | 'percentage' | 'number' | 'duration';
  category: 'revenue' | 'customer' | 'product' | 'conversion' | 'retention';
  description: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  timestamp: string;
}

interface MetricCalculation {
  metric: string;
  formula: string;
  dependencies: string[];
  calculation: (data: any) => number;
}

interface BusinessInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'trend' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations: string[];
  metrics: string[];
  confidence: number;
  timestamp: string;
}

interface CustomerSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  customers: number;
  revenue: number;
  avgOrderValue: number;
  frequency: number;
  ltv: number;
  churnRate: number;
  growthRate: number;
}

export class BusinessMetricsEngine {
  private calculations: Map<string, MetricCalculation> = new Map();
  
  constructor() {
    this.initializeCalculations();
  }

  /**
   * Calculer toutes les métriques business
   */
  async calculateAllMetrics(timeRange: string = '30d'): Promise<BusinessMetric[]> {
    const cacheKey = `business_metrics:${timeRange}`;
    const cached = await cache.get(cacheKey, { tags: ['metrics', 'business'] });
    
    if (cached) {
      return (cached as BusinessMetric[]) || [];
    }

    const rawData = await this.getRawData(timeRange);
    const metrics: BusinessMetric[] = [];

    // Métriques de revenus
    metrics.push(...await this.calculateRevenueMetrics(rawData));
    
    // Métriques clients
    metrics.push(...await this.calculateCustomerMetrics(rawData));
    
    // Métriques produits
    metrics.push(...await this.calculateProductMetrics(rawData));
    
    // Métriques de conversion
    metrics.push(...await this.calculateConversionMetrics(rawData));
    
    // Métriques de rétention
    metrics.push(...await this.calculateRetentionMetrics(rawData));

    // Mise en cache pour 1 heure
    await cache.set(cacheKey, metrics, {
      ttl: 3600,
      tags: ['metrics', 'business', `range:${timeRange}`]
    });

    return metrics;
  }

  /**
   * Générer des insights business automatiques
   */
  async generateBusinessInsights(metrics: BusinessMetric[]): Promise<BusinessInsight[]> {
    const insights: BusinessInsight[] = [];
    
    // Analyser les tendances de revenus
    const revenueMetrics = metrics.filter(m => m.category === 'revenue');
    insights.push(...this.analyzeRevenueTrends(revenueMetrics));
    
    // Analyser les comportements clients
    const customerMetrics = metrics.filter(m => m.category === 'customer');
    insights.push(...this.analyzeCustomerBehavior(customerMetrics));
    
    // Analyser les performances produits
    const productMetrics = metrics.filter(m => m.category === 'product');
    insights.push(...this.analyzeProductPerformance(productMetrics));
    
    // Analyser les conversions
    const conversionMetrics = metrics.filter(m => m.category === 'conversion');
    insights.push(...this.analyzeConversionFunnels(conversionMetrics));

    return insights.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact] || b.confidence - a.confidence;
    });
  }

  /**
   * Calculer la segmentation clients avancée
   */
  async calculateCustomerSegmentation(): Promise<CustomerSegment[]> {
    const rawData = await this.getCustomerData();
    
    const segments: CustomerSegment[] = [
      {
        id: 'vip',
        name: 'Clients VIP',
        criteria: { ltv: { gte: 1000 }, frequency: { gte: 5 } },
        customers: 0,
        revenue: 0,
        avgOrderValue: 0,
        frequency: 0,
        ltv: 0,
        churnRate: 0,
        growthRate: 0
      },
      {
        id: 'loyal',
        name: 'Clients Fidèles',
        criteria: { ltv: { gte: 500, lt: 1000 }, frequency: { gte: 3 } },
        customers: 0,
        revenue: 0,
        avgOrderValue: 0,
        frequency: 0,
        ltv: 0,
        churnRate: 0,
        growthRate: 0
      },
      {
        id: 'occasional',
        name: 'Clients Occasionnels',
        criteria: { frequency: { gte: 2, lt: 3 } },
        customers: 0,
        revenue: 0,
        avgOrderValue: 0,
        frequency: 0,
        ltv: 0,
        churnRate: 0,
        growthRate: 0
      },
      {
        id: 'new',
        name: 'Nouveaux Clients',
        criteria: { frequency: { eq: 1 }, registeredDays: { lte: 30 } },
        customers: 0,
        revenue: 0,
        avgOrderValue: 0,
        frequency: 0,
        ltv: 0,
        churnRate: 0,
        growthRate: 0
      },
      {
        id: 'at_risk',
        name: 'Clients à Risque',
        criteria: { daysSinceLastOrder: { gte: 90 }, frequency: { gte: 2 } },
        customers: 0,
        revenue: 0,
        avgOrderValue: 0,
        frequency: 0,
        ltv: 0,
        churnRate: 0,
        growthRate: 0
      }
    ];

    // Calculer les métriques pour chaque segment
    for (const segment of segments) {
      const segmentData = this.filterCustomersBySegment(rawData, segment.criteria);
      
      segment.customers = segmentData.length;
      segment.revenue = segmentData.reduce((sum, c) => sum + c.totalSpent, 0);
      segment.avgOrderValue = segment.revenue / segmentData.reduce((sum, c) => sum + c.orderCount, 0) || 0;
      segment.frequency = segmentData.reduce((sum, c) => sum + c.orderCount, 0) / segment.customers || 0;
      segment.ltv = segment.revenue / segment.customers || 0;
      segment.churnRate = this.calculateChurnRate(segmentData);
      segment.growthRate = this.calculateGrowthRate(segmentData);
    }

    return segments;
  }

  /**
   * Calculer les métriques de cohort
   */
  async calculateCohortAnalysis(period: 'weekly' | 'monthly' = 'monthly'): Promise<any> {
    const cohortData = await this.getCohortData(period);
    
    const cohorts = new Map();
    
    cohortData.forEach(customer => {
      const cohortKey = this.getCohortKey(customer.firstOrderDate, period);
      
      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, {
          cohort: cohortKey,
          customers: new Set(),
          periods: new Map()
        });
      }
      
      const cohort = cohorts.get(cohortKey);
      cohort.customers.add(customer.id);
      
      customer.orders.forEach((order: any) => {
        const periodKey = this.getPeriodKey(order.date, customer.firstOrderDate, period);
        
        if (!cohort.periods.has(periodKey)) {
          cohort.periods.set(periodKey, new Set());
        }
        
        cohort.periods.get(periodKey).add(customer.id);
      });
    });

    // Calculer les taux de rétention par période
    const cohortAnalysis = Array.from(cohorts.values()).map(cohort => {
      const baseSize = cohort.customers.size;
      const retentionRates: number[] = [];
      
      for (let period = 0; period <= 12; period++) {
        const activeCustomers = cohort.periods.get(period)?.size || 0;
        retentionRates.push(activeCustomers / baseSize);
      }
      
      return {
        cohort: cohort.cohort,
        size: baseSize,
        retentionRates
      };
    });

    return cohortAnalysis;
  }

  /**
   * Prédictions basées sur les tendances
   */
  async generatePredictions(metrics: BusinessMetric[], horizon: number = 30): Promise<any> {
    const predictions = {
      revenue: this.predictRevenue(metrics, horizon),
      customers: this.predictCustomerGrowth(metrics, horizon),
      churn: this.predictChurnRate(metrics, horizon),
      ltv: this.predictLifetimeValue(metrics, horizon)
    };

    return predictions;
  }

  // Méthodes privées pour les calculs

  private initializeCalculations() {
    // Revenus
    this.calculations.set('mrr', {
      metric: 'Monthly Recurring Revenue',
      formula: 'SUM(subscription_revenue) / months',
      dependencies: ['subscriptions', 'revenue'],
      calculation: (data) => data.subscriptionRevenue || 0
    });

    this.calculations.set('arpu', {
      metric: 'Average Revenue Per User',
      formula: 'total_revenue / active_users',
      dependencies: ['revenue', 'users'],
      calculation: (data) => data.totalRevenue / data.activeUsers || 0
    });

    this.calculations.set('ltv', {
      metric: 'Customer Lifetime Value',
      formula: 'avg_order_value * purchase_frequency * gross_margin * lifespan',
      dependencies: ['orders', 'customers'],
      calculation: (data) => data.avgOrderValue * data.frequency * data.margin * data.lifespan || 0
    });
  }

  private async getRawData(timeRange: string): Promise<any> {
    // En production, récupérer les vraies données
    return {
      orders: this.generateMockOrders(timeRange),
      customers: this.generateMockCustomers(timeRange),
      products: this.generateMockProducts(timeRange),
      sessions: this.generateMockSessions(timeRange),
      events: this.generateMockEvents(timeRange)
    };
  }

  private async calculateRevenueMetrics(data: any): Promise<BusinessMetric[]> {
    const orders = data.orders || [];
    
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const previousRevenue = orders
      .filter((o: any) => new Date(o.date) < this.getPreviousPeriodStart())
      .reduce((sum: number, order: any) => sum + order.total, 0);
    
    const avgOrderValue = totalRevenue / orders.length || 0;
    const grossMargin = totalRevenue * 0.4; // 40% margin simulé
    
    return [
      {
        id: 'total_revenue',
        name: 'Chiffre d\'affaires total',
        value: totalRevenue,
        previousValue: previousRevenue,
        change: totalRevenue - previousRevenue,
        changePercent: previousRevenue ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0,
        unit: 'EUR',
        format: 'currency',
        category: 'revenue',
        description: 'Revenus totaux générés sur la période',
        trend: totalRevenue > previousRevenue ? 'up' : 'down',
        target: previousRevenue * 1.1,
        timestamp: new Date().toISOString()
      },
      {
        id: 'avg_order_value',
        name: 'Panier moyen',
        value: avgOrderValue,
        unit: 'EUR',
        format: 'currency',
        category: 'revenue',
        description: 'Valeur moyenne des commandes',
        trend: 'stable',
        timestamp: new Date().toISOString()
      },
      {
        id: 'gross_margin',
        name: 'Marge brute',
        value: grossMargin,
        unit: 'EUR',
        format: 'currency',
        category: 'revenue',
        description: 'Profit brut après coûts directs',
        trend: 'up',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private async calculateCustomerMetrics(data: any): Promise<BusinessMetric[]> {
    const customers = data.customers || [];
    const orders = data.orders || [];
    
    const newCustomers = customers.filter((c: any) => 
      new Date(c.createdAt) >= this.getCurrentPeriodStart()
    ).length;
    
    const activeCustomers = customers.filter((c: any) => 
      orders.some((o: any) => o.customerId === c.id)
    ).length;
    
    const customerLifetimeValue = this.calculateLTV(customers, orders);
    const churnRate = this.calculateChurnRate(customers);
    const acquisitionCost = this.calculateCAC(customers);
    
    return [
      {
        id: 'new_customers',
        name: 'Nouveaux clients',
        value: newCustomers,
        unit: '',
        format: 'number',
        category: 'customer',
        description: 'Nombre de nouveaux clients acquis',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'active_customers',
        name: 'Clients actifs',
        value: activeCustomers,
        unit: '',
        format: 'number',
        category: 'customer',
        description: 'Clients ayant passé au moins une commande',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'customer_ltv',
        name: 'Valeur vie client',
        value: customerLifetimeValue,
        unit: 'EUR',
        format: 'currency',
        category: 'customer',
        description: 'Revenus moyens générés par client sur sa durée de vie',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'churn_rate',
        name: 'Taux d\'attrition',
        value: churnRate,
        unit: '%',
        format: 'percentage',
        category: 'retention',
        description: 'Pourcentage de clients perdus sur la période',
        trend: 'down',
        threshold: { warning: 15, critical: 25 },
        timestamp: new Date().toISOString()
      },
      {
        id: 'cac',
        name: 'Coût d\'acquisition client',
        value: acquisitionCost,
        unit: 'EUR',
        format: 'currency',
        category: 'customer',
        description: 'Coût moyen pour acquérir un nouveau client',
        trend: 'down',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private async calculateProductMetrics(data: any): Promise<BusinessMetric[]> {
    const products = data.products || [];
    const orders = data.orders || [];
    
    const bestSellers = this.getBestSellingProducts(products, orders);
    const avgProductsPerOrder = this.getAvgProductsPerOrder(orders);
    const inventoryTurnover = this.calculateInventoryTurnover(products, orders);
    
    return [
      {
        id: 'products_per_order',
        name: 'Produits par commande',
        value: avgProductsPerOrder,
        unit: '',
        format: 'number',
        category: 'product',
        description: 'Nombre moyen de produits par commande',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'inventory_turnover',
        name: 'Rotation stock',
        value: inventoryTurnover,
        unit: 'x/an',
        format: 'number',
        category: 'product',
        description: 'Vitesse de rotation du stock',
        trend: 'stable',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private async calculateConversionMetrics(data: any): Promise<BusinessMetric[]> {
    const sessions = data.sessions || [];
    const orders = data.orders || [];
    const events = data.events || [];
    
    const conversionRate = (orders.length / sessions.length) * 100;
    const addToCartRate = (events.filter((e: any) => e.type === 'add_to_cart').length / sessions.length) * 100;
    const checkoutRate = (events.filter((e: any) => e.type === 'checkout_start').length / 
                         events.filter((e: any) => e.type === 'add_to_cart').length) * 100;
    
    return [
      {
        id: 'conversion_rate',
        name: 'Taux de conversion',
        value: conversionRate,
        unit: '%',
        format: 'percentage',
        category: 'conversion',
        description: 'Pourcentage de visiteurs qui effectuent un achat',
        trend: 'up',
        target: 3.5,
        timestamp: new Date().toISOString()
      },
      {
        id: 'add_to_cart_rate',
        name: 'Taux d\'ajout panier',
        value: addToCartRate,
        unit: '%',
        format: 'percentage',
        category: 'conversion',
        description: 'Pourcentage de visiteurs qui ajoutent un produit au panier',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'checkout_rate',
        name: 'Taux de finalisation',
        value: checkoutRate,
        unit: '%',
        format: 'percentage',
        category: 'conversion',
        description: 'Pourcentage d\'ajouts panier qui se transforment en commande',
        trend: 'stable',
        timestamp: new Date().toISOString()
      }
    ];
  }

  private async calculateRetentionMetrics(data: any): Promise<BusinessMetric[]> {
    const customers = data.customers || [];
    const orders = data.orders || [];
    
    const repeatPurchaseRate = this.calculateRepeatPurchaseRate(customers, orders);
    const customerRetentionRate = this.calculateRetentionRate(customers, orders);
    const avgDaysBetweenOrders = this.calculateAvgDaysBetweenOrders(orders);
    
    return [
      {
        id: 'repeat_purchase_rate',
        name: 'Taux de rachat',
        value: repeatPurchaseRate,
        unit: '%',
        format: 'percentage',
        category: 'retention',
        description: 'Pourcentage de clients qui passent plusieurs commandes',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'retention_rate',
        name: 'Taux de rétention',
        value: customerRetentionRate,
        unit: '%',
        format: 'percentage',
        category: 'retention',
        description: 'Pourcentage de clients qui reviennent acheter',
        trend: 'up',
        timestamp: new Date().toISOString()
      },
      {
        id: 'days_between_orders',
        name: 'Délai entre commandes',
        value: avgDaysBetweenOrders,
        unit: 'jours',
        format: 'number',
        category: 'retention',
        description: 'Nombre moyen de jours entre deux commandes',
        trend: 'down',
        timestamp: new Date().toISOString()
      }
    ];
  }

  // Méthodes d'analyse pour les insights

  private analyzeRevenueTrends(metrics: BusinessMetric[]): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    
    const revenueMetric = metrics.find(m => m.id === 'total_revenue');
    if (revenueMetric && revenueMetric.changePercent) {
      if (revenueMetric.changePercent > 20) {
        insights.push({
          id: 'revenue_growth',
          type: 'achievement',
          title: 'Croissance exceptionnelle du chiffre d\'affaires',
          description: `Le chiffre d'affaires a augmenté de ${revenueMetric.changePercent.toFixed(1)}% par rapport à la période précédente.`,
          impact: 'high',
          actionable: true,
          recommendations: [
            'Analyser les facteurs de cette croissance',
            'Intensifier les efforts marketing sur les canaux performants',
            'Optimiser la gestion des stocks pour répondre à la demande'
          ],
          metrics: ['total_revenue'],
          confidence: 95,
          timestamp: new Date().toISOString()
        });
      } else if (revenueMetric.changePercent < -10) {
        insights.push({
          id: 'revenue_decline',
          type: 'warning',
          title: 'Baisse significative du chiffre d\'affaires',
          description: `Le chiffre d'affaires a diminué de ${Math.abs(revenueMetric.changePercent).toFixed(1)}%.`,
          impact: 'high',
          actionable: true,
          recommendations: [
            'Identifier les causes de la baisse',
            'Lancer des campagnes promotionnelles',
            'Améliorer l\'expérience client'
          ],
          metrics: ['total_revenue'],
          confidence: 90,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return insights;
  }

  private analyzeCustomerBehavior(metrics: BusinessMetric[]): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    
    const churnMetric = metrics.find(m => m.id === 'churn_rate');
    const ltvMetric = metrics.find(m => m.id === 'customer_ltv');
    
    if (churnMetric && churnMetric.value > 20) {
      insights.push({
        id: 'high_churn',
        type: 'warning',
        title: 'Taux d\'attrition élevé',
        description: `${churnMetric.value.toFixed(1)}% des clients ont cessé d'acheter.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Mettre en place un programme de fidélisation',
          'Améliorer le service client',
          'Analyser les raisons de départ des clients'
        ],
        metrics: ['churn_rate'],
        confidence: 85,
        timestamp: new Date().toISOString()
      });
    }
    
    return insights;
  }

  private analyzeProductPerformance(metrics: BusinessMetric[]): BusinessInsight[] {
    // Analyser les performances produits et suggérer des optimisations
    return [];
  }

  private analyzeConversionFunnels(metrics: BusinessMetric[]): BusinessInsight[] {
    const insights: BusinessInsight[] = [];
    
    const conversionRate = metrics.find(m => m.id === 'conversion_rate');
    const checkoutRate = metrics.find(m => m.id === 'checkout_rate');
    
    if (conversionRate && conversionRate.value < 2) {
      insights.push({
        id: 'low_conversion',
        type: 'opportunity',
        title: 'Taux de conversion à optimiser',
        description: `Le taux de conversion de ${conversionRate.value.toFixed(2)}% est en dessous de la moyenne du secteur.`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Optimiser les pages produits',
          'Simplifier le processus de commande',
          'Améliorer les descriptions et photos produits'
        ],
        metrics: ['conversion_rate'],
        confidence: 80,
        timestamp: new Date().toISOString()
      });
    }
    
    return insights;
  }

  // Méthodes utilitaires

  private getCurrentPeriodStart(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }

  private getPreviousPeriodStart(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 60);
    return date;
  }

  private calculateLTV(customers: any[], orders: any[]): number {
    // Calcul simplifié de la LTV
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    return customers.length > 0 ? totalRevenue / customers.length : 0;
  }

  private calculateChurnRate(customers: any[]): number {
    // Simulation du calcul de churn
    return Math.random() * 15 + 5; // 5-20%
  }

  private calculateCAC(customers: any[]): number {
    // Simulation du coût d'acquisition client
    return Math.random() * 50 + 20; // 20-70EUR
  }

  private getBestSellingProducts(products: any[], orders: any[]): any[] {
    // Analyser les produits les plus vendus
    return products.slice(0, 10);
  }

  private getAvgProductsPerOrder(orders: any[]): number {
    if (orders.length === 0) return 0;
    const totalItems = orders.reduce((sum, order) => sum + (order.items?.length || 1), 0);
    return totalItems / orders.length;
  }

  private calculateInventoryTurnover(products: any[], orders: any[]): number {
    // Simulation de la rotation des stocks
    return Math.random() * 8 + 4; // 4-12 fois par an
  }

  private calculateRepeatPurchaseRate(customers: any[], orders: any[]): number {
    const customersWithMultipleOrders = customers.filter(customer => 
      orders.filter(order => order.customerId === customer.id).length > 1
    ).length;
    
    return customers.length > 0 ? (customersWithMultipleOrders / customers.length) * 100 : 0;
  }

  private calculateRetentionRate(customers: any[], orders: any[]): number {
    // Simulation du taux de rétention
    return Math.random() * 20 + 60; // 60-80%
  }

  private calculateAvgDaysBetweenOrders(orders: any[]): number {
    // Simulation du délai moyen entre commandes
    return Math.random() * 60 + 30; // 30-90 jours
  }

  // Méthodes de génération de données mock (à remplacer par de vraies données)

  private generateMockOrders(timeRange: string): any[] {
    const orders = [];
    const count = timeRange === '7d' ? 50 : timeRange === '30d' ? 200 : 500;
    
    for (let i = 0; i < count; i++) {
      orders.push({
        id: `order_${i}`,
        customerId: `customer_${Math.floor(Math.random() * 100)}`,
        total: Math.random() * 200 + 50,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [{ productId: `product_${Math.floor(Math.random() * 50)}`, quantity: Math.floor(Math.random() * 3) + 1 }]
      });
    }
    
    return orders;
  }

  private generateMockCustomers(timeRange: string): any[] {
    const customers = [];
    const count = timeRange === '7d' ? 30 : timeRange === '30d' ? 120 : 300;
    
    for (let i = 0; i < count; i++) {
      customers.push({
        id: `customer_${i}`,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastOrderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return customers;
  }

  private generateMockProducts(timeRange: string): any[] {
    return Array(50).fill(0).map((_, i) => ({
      id: `product_${i}`,
      name: `Product ${i}`,
      stock: Math.floor(Math.random() * 100),
      price: Math.random() * 200 + 50
    }));
  }

  private generateMockSessions(timeRange: string): any[] {
    const sessions = [];
    const count = timeRange === '7d' ? 500 : timeRange === '30d' ? 2000 : 5000;
    
    for (let i = 0; i < count; i++) {
      sessions.push({
        id: `session_${i}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: Math.random() * 1800 + 60 // 1-30 minutes
      });
    }
    
    return sessions;
  }

  private generateMockEvents(timeRange: string): any[] {
    const events = [];
    const count = timeRange === '7d' ? 1000 : timeRange === '30d' ? 4000 : 10000;
    const eventTypes = ['page_view', 'add_to_cart', 'checkout_start', 'purchase'];
    
    for (let i = 0; i < count; i++) {
      events.push({
        id: `event_${i}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        sessionId: `session_${Math.floor(Math.random() * 2000)}`,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    return events;
  }

  private async getCustomerData(): Promise<any[]> {
    // Récupérer les données détaillées des clients
    return this.generateMockCustomers('90d');
  }

  private async getCohortData(period: string): Promise<any[]> {
    // Récupérer les données pour l'analyse de cohorte
    return [];
  }

  private getCohortKey(date: string, period: string): string {
    const d = new Date(date);
    if (period === 'weekly') {
      const week = Math.floor(d.getTime() / (7 * 24 * 60 * 60 * 1000));
      return `W${week}`;
    } else {
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  }

  private getPeriodKey(orderDate: string, firstOrderDate: string, period: string): number {
    const order = new Date(orderDate);
    const first = new Date(firstOrderDate);
    
    if (period === 'weekly') {
      return Math.floor((order.getTime() - first.getTime()) / (7 * 24 * 60 * 60 * 1000));
    } else {
      const months = (order.getFullYear() - first.getFullYear()) * 12 + order.getMonth() - first.getMonth();
      return months;
    }
  }

  private filterCustomersBySegment(customers: any[], criteria: any): any[] {
    return customers.filter(customer => {
      return Object.entries(criteria).every(([key, condition]: [string, any]) => {
        const value = customer[key];
        
        if (condition.gte !== undefined && value < condition.gte) return false;
        if (condition.lt !== undefined && value >= condition.lt) return false;
        if (condition.lte !== undefined && value > condition.lte) return false;
        if (condition.eq !== undefined && value !== condition.eq) return false;
        
        return true;
      });
    });
  }

  private calculateGrowthRate(customers: any[]): number {
    // Simulation du taux de croissance
    return Math.random() * 10 - 2; // -2% à +8%
  }

  private predictRevenue(metrics: BusinessMetric[], horizon: number): any {
    const revenueMetric = metrics.find(m => m.id === 'total_revenue');
    if (!revenueMetric) return null;
    
    const growthRate = revenueMetric.changePercent || 0;
    const currentRevenue = revenueMetric.value;
    
    return {
      predicted: currentRevenue * (1 + growthRate / 100),
      confidence: 75,
      range: {
        min: currentRevenue * 0.8,
        max: currentRevenue * 1.3
      }
    };
  }

  private predictCustomerGrowth(metrics: BusinessMetric[], horizon: number): any {
    return {
      predicted: 150,
      confidence: 70,
      range: { min: 120, max: 180 }
    };
  }

  private predictChurnRate(metrics: BusinessMetric[], horizon: number): any {
    return {
      predicted: 12,
      confidence: 80,
      range: { min: 8, max: 18 }
    };
  }

  private predictLifetimeValue(metrics: BusinessMetric[], horizon: number): any {
    return {
      predicted: 450,
      confidence: 65,
      range: { min: 350, max: 600 }
    };
  }
}

// Instance globale
export const businessMetrics = new BusinessMetricsEngine();
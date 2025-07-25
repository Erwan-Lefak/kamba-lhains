// Système d'analytics comportementales avancé
interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  elementType: string;
  elementId?: string;
}

interface ConversionFunnel {
  step: string;
  users: number;
  conversions: number;
  conversionRate: number;
  averageTime: number;
  dropoffReasons: string[];
}

interface UserJourney {
  sessionId: string;
  userId?: string;
  steps: JourneyStep[];
  totalDuration: number;
  deviceType: string;
  referrer: string;
  exitPage: string;
  converted: boolean;
}

interface JourneyStep {
  page: string;
  timestamp: number;
  duration: number;
  interactions: number;
  scrollDepth: number;
  ctaClicks: string[];
}

class AdvancedAnalytics {
  private heatmapData: HeatmapData[] = [];
  private userJourneys: Map<string, UserJourney> = new Map();
  private conversionFunnels: Map<string, ConversionFunnel[]> = new Map();
  private abTests: Map<string, ABTestConfig> = new Map();

  // Heatmap tracking
  trackHeatmapEvent(event: MouseEvent | TouchEvent, elementType: string) {
    const rect = document.documentElement.getBoundingClientRect();
    const x = 'clientX' in event ? event.clientX : event.touches[0].clientX;
    const y = 'clientY' in event ? event.clientY : event.touches[0].clientY;
    
    const heatmapPoint: HeatmapData = {
      x: (x / window.innerWidth) * 100,
      y: (y / window.innerHeight) * 100,
      intensity: 1,
      timestamp: Date.now(),
      elementType,
      elementId: (event.target as HTMLElement)?.id
    };
    
    this.heatmapData.push(heatmapPoint);
    this.throttledSendHeatmap();
  }

  // User Journey tracking
  startUserJourney(sessionId: string, userId?: string) {
    const journey: UserJourney = {
      sessionId,
      userId,
      steps: [],
      totalDuration: 0,
      deviceType: this.getDeviceType(),
      referrer: document.referrer,
      exitPage: '',
      converted: false
    };
    
    this.userJourneys.set(sessionId, journey);
    this.trackPageView(sessionId, window.location.pathname);
  }

  trackPageView(sessionId: string, page: string) {
    const journey = this.userJourneys.get(sessionId);
    if (!journey) return;

    const now = Date.now();
    const lastStep = journey.steps[journey.steps.length - 1];
    
    // Finaliser l'étape précédente
    if (lastStep) {
      lastStep.duration = now - lastStep.timestamp;
    }

    // Nouvelle étape
    const step: JourneyStep = {
      page,
      timestamp: now,
      duration: 0,
      interactions: 0,
      scrollDepth: 0,
      ctaClicks: []
    };
    
    journey.steps.push(step);
    this.setupPageTracking(sessionId);
  }

  private setupPageTracking(sessionId: string) {
    let maxScroll = 0;
    let interactionCount = 0;

    // Tracking du scroll
    const scrollHandler = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);
      this.updateCurrentStep(sessionId, { scrollDepth: maxScroll });
    };

    // Tracking des interactions
    const interactionHandler = (event: Event) => {
      interactionCount++;
      this.updateCurrentStep(sessionId, { interactions: interactionCount });
      
      // Tracking spécifique des CTA
      const target = event.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        const ctaText = target.textContent?.trim() || target.getAttribute('aria-label') || 'Unknown CTA';
        const journey = this.userJourneys.get(sessionId);
        const currentStep = journey?.steps[journey.steps.length - 1];
        if (currentStep) {
          currentStep.ctaClicks.push(ctaText);
        }
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    document.addEventListener('click', interactionHandler);
    
    // Nettoyage après 30 secondes d'inactivité
    setTimeout(() => {
      window.removeEventListener('scroll', scrollHandler);
      document.removeEventListener('click', interactionHandler);
    }, 30000);
  }

  private updateCurrentStep(sessionId: string, updates: Partial<JourneyStep>) {
    const journey = this.userJourneys.get(sessionId);
    if (!journey || journey.steps.length === 0) return;
    
    const currentStep = journey.steps[journey.steps.length - 1];
    Object.assign(currentStep, updates);
  }

  // Conversion Funnel Analysis
  defineFunnel(name: string, steps: string[]) {
    const funnel: ConversionFunnel[] = steps.map(step => ({
      step,
      users: 0,
      conversions: 0,
      conversionRate: 0,
      averageTime: 0,
      dropoffReasons: []
    }));
    
    this.conversionFunnels.set(name, funnel);
  }

  trackFunnelStep(funnelName: string, stepName: string, sessionId: string) {
    const funnel = this.conversionFunnels.get(funnelName);
    if (!funnel) return;
    
    const step = funnel.find(s => s.step === stepName);
    if (!step) return;
    
    step.users++;
    this.analyzeFunnelPerformance(funnelName);
  }

  private analyzeFunnelPerformance(funnelName: string) {
    const funnel = this.conversionFunnels.get(funnelName);
    if (!funnel) return;
    
    for (let i = 0; i < funnel.length; i++) {
      const currentStep = funnel[i];
      const nextStep = funnel[i + 1];
      
      if (nextStep) {
        currentStep.conversions = nextStep.users;
        currentStep.conversionRate = currentStep.users > 0 
          ? (nextStep.users / currentStep.users) * 100 
          : 0;
      }
    }
  }

  // A/B Testing System
  createABTest(testName: string, variants: string[], trafficSplit: number[] = [50, 50]) {
    const config: ABTestConfig = {
      name: testName,
      variants,
      trafficSplit,
      active: true,
      startDate: new Date(),
      results: new Map()
    };
    
    this.abTests.set(testName, config);
  }

  getABTestVariant(testName: string, userId: string): string {
    const test = this.abTests.get(testName);
    if (!test || !test.active) return test?.variants[0] || 'control';
    
    // Hash consistent pour le même utilisateur
    const hash = this.hashString(userId + testName);
    const bucket = hash % 100;
    
    let cumulative = 0;
    for (let i = 0; i < test.variants.length; i++) {
      cumulative += test.trafficSplit[i];
      if (bucket < cumulative) {
        return test.variants[i];
      }
    }
    
    return test.variants[0];
  }

  trackABTestConversion(testName: string, variant: string, metric: string, value: number = 1) {
    const test = this.abTests.get(testName);
    if (!test) return;
    
    if (!test.results.has(variant)) {
      test.results.set(variant, new Map());
    }
    
    const variantResults = test.results.get(variant)!;
    const current = variantResults.get(metric) || 0;
    variantResults.set(metric, current + value);
  }

  // Predictive Analytics
  async predictUserBehavior(sessionId: string): Promise<UserPrediction> {
    const journey = this.userJourneys.get(sessionId);
    if (!journey) {
      return { conversionProbability: 0, recommendedActions: [] };
    }

    // Analyse des patterns comportementaux
    const totalInteractions = journey.steps.reduce((sum, step) => sum + step.interactions, 0);
    const averageScrollDepth = journey.steps.reduce((sum, step) => sum + step.scrollDepth, 0) / journey.steps.length;
    const ctaEngagement = journey.steps.reduce((sum, step) => sum + step.ctaClicks.length, 0);
    
    // Score de probabilité de conversion (algorithme simplifié)
    let conversionScore = 0;
    
    // Facteurs positifs
    if (totalInteractions > 10) conversionScore += 0.3;
    if (averageScrollDepth > 75) conversionScore += 0.2;
    if (ctaEngagement > 3) conversionScore += 0.3;
    if (journey.steps.length > 3) conversionScore += 0.2;
    
    // Facteurs de risque
    const bounceRisk = journey.steps.length === 1 && journey.steps[0].duration < 10000;
    if (bounceRisk) conversionScore -= 0.4;
    
    const conversionProbability = Math.max(0, Math.min(1, conversionScore));
    
    // Recommandations d'actions
    const recommendedActions: string[] = [];
    
    if (conversionProbability < 0.3) {
      recommendedActions.push('show_personalized_offer');
      recommendedActions.push('trigger_exit_intent_popup');
    } else if (conversionProbability > 0.7) {
      recommendedActions.push('show_upsell_products');
      recommendedActions.push('enable_express_checkout');
    }
    
    if (averageScrollDepth < 50) {
      recommendedActions.push('highlight_key_benefits');
    }
    
    return { conversionProbability, recommendedActions };
  }

  // Utility methods
  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private throttledSendHeatmap = this.throttle(() => {
    // Envoyer les données heatmap vers l'API
    if (this.heatmapData.length > 0) {
      this.sendAnalyticsData('heatmap', this.heatmapData.splice(0, 100));
    }
  }, 5000);

  private throttle(func: Function, delay: number) {
    let timeoutId: number;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay) as any;
    };
  }

  private async sendAnalyticsData(type: string, data: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data, timestamp: Date.now() })
      });
    } catch (error) {
      console.error('Failed to send analytics data:', error);
    }
  }

  // Export des données pour analyse
  exportHeatmapData(): HeatmapData[] {
    return [...this.heatmapData];
  }

  exportUserJourneys(): UserJourney[] {
    return Array.from(this.userJourneys.values());
  }

  exportFunnelData(): Record<string, ConversionFunnel[]> {
    return Object.fromEntries(this.conversionFunnels);
  }

  exportABTestResults(): Record<string, ABTestResults> {
    const results: Record<string, ABTestResults> = {};
    
    this.abTests.forEach((test, name) => {
      results[name] = {
        variants: test.variants,
        results: Object.fromEntries(
          Array.from(test.results.entries()).map(([key, value]) => 
            [key, value instanceof Map ? Object.fromEntries(value.entries()) : value]
          )
        ),
        startDate: test.startDate,
        active: test.active
      };
    });
    
    return results;
  }
}

// Types
interface ABTestConfig {
  name: string;
  variants: string[];
  trafficSplit: number[];
  active: boolean;
  startDate: Date;
  results: Map<string, Map<string, number>>;
}

interface UserPrediction {
  conversionProbability: number;
  recommendedActions: string[];
}

interface ABTestResults {
  variants: string[];
  results: Record<string, Record<string, number>>;
  startDate: Date;
  active: boolean;
}

// Instance globale
export const analyticsEngine = new AdvancedAnalytics();

// Hook React pour utiliser les analytics
export function useAdvancedAnalytics(sessionId: string) {
  const startTracking = (userId?: string) => {
    analyticsEngine.startUserJourney(sessionId, userId);
  };

  const trackPage = (page: string) => {
    analyticsEngine.trackPageView(sessionId, page);
  };

  const trackFunnel = (funnelName: string, step: string) => {
    analyticsEngine.trackFunnelStep(funnelName, step, sessionId);
  };

  const getABVariant = (testName: string, userId: string) => {
    return analyticsEngine.getABTestVariant(testName, userId);
  };

  const trackConversion = (testName: string, variant: string, metric: string, value?: number) => {
    analyticsEngine.trackABTestConversion(testName, variant, metric, value);
  };

  const predictBehavior = async () => {
    return analyticsEngine.predictUserBehavior(sessionId);
  };

  return {
    startTracking,
    trackPage,
    trackFunnel,
    getABVariant,
    trackConversion,
    predictBehavior
  };
}
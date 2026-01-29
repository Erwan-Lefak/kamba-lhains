// Système de heatmaps comportementales avancé
interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  sessionId: string;
  pageUrl: string;
  elementId?: string;
  elementType?: string;
  action: 'click' | 'hover' | 'scroll' | 'focus';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  viewportWidth: number;
  viewportHeight: number;
}

interface ScrollData {
  maxScroll: number;
  timeSpentSections: Record<string, number>;
  scrollSpeed: number;
  bounceRate: boolean;
}

interface ConversionFunnel {
  step: string;
  users: number;
  conversions: number;
  conversionRate: number;
  avgTimeSpent: number;
  dropOffReasons: string[];
}

class AdvancedHeatmapEngine {
  private heatmapData: Map<string, HeatmapPoint[]> = new Map();
  private scrollData: Map<string, ScrollData> = new Map();
  private sessionStartTime: number = Date.now();
  private currentPage: string = '';
  private isRecording: boolean = false;

  constructor() {
    this.initializeTracking();
  }

  // Initialisation du tracking
  private initializeTracking() {
    if (typeof window === 'undefined') return;

    this.currentPage = window.location.pathname;
    this.isRecording = true;

    // Tracking des clics
    document.addEventListener('click', this.handleClick.bind(this), true);
    
    // Tracking des mouvements de souris (desktop uniquement)
    if (this.getDeviceType() === 'desktop') {
      document.addEventListener('mousemove', this.handleMouseMove.bind(this));
      document.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
    }

    // Tracking du scroll
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });

    // Tracking du focus
    document.addEventListener('focusin', this.handleFocus.bind(this), true);

    // Tracking des interactions tactiles
    document.addEventListener('touchstart', this.handleTouch.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });

    // Tracking de la sortie de page
    window.addEventListener('beforeunload', this.handlePageExit.bind(this));

    // Intersection Observer pour les éléments visibles
    this.setupVisibilityTracking();
  }

  // Gestion des clics
  private handleClick(event: MouseEvent) {
    if (!this.isRecording) return;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    const heatmapPoint: HeatmapPoint = {
      x: event.clientX,
      y: event.clientY,
      intensity: 1,
      timestamp: Date.now(),
      sessionId: this.generateSessionId(),
      pageUrl: this.currentPage,
      elementId: target.id || undefined,
      elementType: target.tagName.toLowerCase(),
      action: 'click',
      deviceType: this.getDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };

    this.addHeatmapPoint(heatmapPoint);

    // Tracking spécial pour les produits
    if (target.closest('[data-product-id]')) {
      const productId = target.closest('[data-product-id]')?.getAttribute('data-product-id');
      this.trackProductInteraction(productId!, 'click', event.clientX, event.clientY);
    }

    // Tracking des CTA
    if (target.matches('button, [role="button"], .cta-button')) {
      this.trackCTAClick(target, event.clientX, event.clientY);
    }
  }

  // Gestion du mouvement de souris (sampling pour performance)
  private mouseMoveThrottle = 0;
  private handleMouseMove(event: MouseEvent) {
    if (!this.isRecording || this.getDeviceType() !== 'desktop') return;

    // Throttling pour éviter trop de points
    const now = Date.now();
    if (now - this.mouseMoveThrottle < 100) return;
    this.mouseMoveThrottle = now;

    // Seulement si la souris reste immobile plus de 500ms
    setTimeout(() => {
      const heatmapPoint: HeatmapPoint = {
        x: event.clientX,
        y: event.clientY,
        intensity: 0.3,
        timestamp: Date.now(),
        sessionId: this.generateSessionId(),
        pageUrl: this.currentPage,
        action: 'hover',
        deviceType: this.getDeviceType(),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };

      this.addHeatmapPoint(heatmapPoint);
    }, 500);
  }

  // Gestion du scroll avec métriques avancées
  private lastScrollY = 0;
  private scrollStartTime = Date.now();
  private handleScroll() {
    if (!this.isRecording) return;

    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollPercent = (scrollY / maxScroll) * 100;

    // Calcul de la vitesse de scroll
    const now = Date.now();
    const timeDiff = now - this.scrollStartTime;
    const scrollDiff = Math.abs(scrollY - this.lastScrollY);
    const scrollSpeed = scrollDiff / timeDiff;

    // Mise à jour des données de scroll
    const sessionId = this.generateSessionId();
    const currentScrollData = this.scrollData.get(sessionId) || {
      maxScroll: 0,
      timeSpentSections: {},
      scrollSpeed: 0,
      bounceRate: false
    };

    currentScrollData.maxScroll = Math.max(currentScrollData.maxScroll, scrollPercent);
    currentScrollData.scrollSpeed = scrollSpeed;

    // Tracking des sections visitées
    const section = this.getCurrentSection(scrollY);
    if (section) {
      currentScrollData.timeSpentSections[section] = 
        (currentScrollData.timeSpentSections[section] || 0) + timeDiff;
    }

    this.scrollData.set(sessionId, currentScrollData);

    // Point de heatmap pour le scroll
    const heatmapPoint: HeatmapPoint = {
      x: window.innerWidth / 2,
      y: scrollY,
      intensity: 0.2,
      timestamp: now,
      sessionId: sessionId,
      pageUrl: this.currentPage,
      action: 'scroll',
      deviceType: this.getDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };

    this.addHeatmapPoint(heatmapPoint);

    this.lastScrollY = scrollY;
    this.scrollStartTime = now;
  }

  // Tracking tactile (mobile/tablet)
  private handleTouch(event: TouchEvent) {
    if (!this.isRecording) return;

    const touch = event.touches[0];
    const target = event.target as HTMLElement;

    const heatmapPoint: HeatmapPoint = {
      x: touch.clientX,
      y: touch.clientY,
      intensity: 1,
      timestamp: Date.now(),
      sessionId: this.generateSessionId(),
      pageUrl: this.currentPage,
      elementId: target.id || undefined,
      elementType: target.tagName.toLowerCase(),
      action: 'click',
      deviceType: this.getDeviceType(),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };

    this.addHeatmapPoint(heatmapPoint);
  }

  // Tracking des interactions produit
  private trackProductInteraction(productId: string, action: string, x: number, y: number) {
    // Données spécifiques aux produits
    const productData = {
      productId,
      action,
      coordinates: { x, y },
      timestamp: Date.now(),
      sessionId: this.generateSessionId(),
      pageUrl: this.currentPage
    };

    // Envoi vers l'API analytics
    this.sendAnalytics('product_interaction', productData);
  }

  // Tracking des CTA
  private trackCTAClick(element: HTMLElement, x: number, y: number) {
    const ctaData = {
      ctaText: element.textContent?.trim(),
      ctaClass: element.className,
      ctaId: element.id,
      coordinates: { x, y },
      timestamp: Date.now(),
      sessionId: this.generateSessionId(),
      pageUrl: this.currentPage
    };

    this.sendAnalytics('cta_click', ctaData);
  }

  // Génération de heatmap visuelle
  generateHeatmapVisualization(pageUrl: string, options: {
    width: number;
    height: number;
    radius?: number;
    intensity?: number;
  }) {
    const points = this.heatmapData.get(pageUrl) || [];
    const { width, height, radius = 25, intensity = 0.6 } = options;

    // Création du canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Création du gradient radial pour chaque point
    points.forEach(point => {
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      );

      const alpha = Math.min(point.intensity * intensity, 1);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${alpha * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(
        point.x - radius, point.y - radius,
        radius * 2, radius * 2
      );
    });

    return canvas.toDataURL();
  }

  // Analyse du funnel de conversion
  analyzeConversionFunnel(steps: string[]): ConversionFunnel[] {
    const funnel: ConversionFunnel[] = [];
    let previousUsers = this.getUniqueUsers();

    steps.forEach((step, index) => {
      const stepUsers = this.getUsersForStep(step);
      const conversions = index === 0 ? stepUsers : stepUsers;
      const conversionRate = previousUsers > 0 ? (conversions / previousUsers) * 100 : 0;
      const avgTimeSpent = this.getAverageTimeForStep(step);
      const dropOffReasons = this.getDropOffReasons(step);

      funnel.push({
        step,
        users: conversions,
        conversions,
        conversionRate,
        avgTimeSpent,
        dropOffReasons
      });

      previousUsers = conversions;
    });

    return funnel;
  }

  // Méthodes utilitaires
  private addHeatmapPoint(point: HeatmapPoint) {
    const pagePoints = this.heatmapData.get(point.pageUrl) || [];
    pagePoints.push(point);
    this.heatmapData.set(point.pageUrl, pagePoints);

    // Limitation du nombre de points pour les performances
    if (pagePoints.length > 1000) {
      pagePoints.splice(0, pagePoints.length - 1000);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getCurrentSection(scrollY: number): string | null {
    // Logique pour identifier la section actuelle basée sur le scroll
    const sections = document.querySelectorAll('section[id], [data-section]');
    
    for (const section of Array.from(sections)) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        return section.id || section.getAttribute('data-section') || 'unknown';
      }
    }
    
    return null;
  }

  private sendAnalytics(event: string, data: any) {
    // En production, envoyer vers l'API analytics
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const payload = JSON.stringify({ event, data, timestamp: Date.now() });
      navigator.sendBeacon('/api/analytics', payload);
    }
  }

  // Méthodes pour l'analyse du funnel
  private getUniqueUsers(): number {
    const sessions = new Set();
    this.heatmapData.forEach(points => {
      points.forEach(point => sessions.add(point.sessionId));
    });
    return sessions.size;
  }

  private getUsersForStep(step: string): number {
    // Logique pour compter les utilisateurs qui ont atteint cette étape
    return Math.floor(Math.random() * 100); // Placeholder
  }

  private getAverageTimeForStep(step: string): number {
    // Calcul du temps moyen passé sur cette étape
    return Math.floor(Math.random() * 60000); // Placeholder
  }

  private getDropOffReasons(step: string): string[] {
    // Analyse des raisons d'abandon
    return ['Temps de chargement', 'Navigation confuse', 'Prix trop élevé'];
  }

  // API publique
  public getHeatmapData(pageUrl: string) {
    return this.heatmapData.get(pageUrl) || [];
  }

  public getScrollAnalytics(sessionId: string) {
    return this.scrollData.get(sessionId);
  }

  public startRecording() {
    this.isRecording = true;
  }

  public stopRecording() {
    this.isRecording = false;
  }

  private handleMouseEnter(event: MouseEvent) {
    // Tracking des hover sur éléments spécifiques
  }

  private handleFocus(event: FocusEvent) {
    // Tracking du focus sur les éléments interactifs
  }

  private handleTouchMove(event: TouchEvent) {
    // Tracking des mouvements tactiles
  }

  private handlePageExit() {
    // Envoi des données avant fermeture
    this.sendAnalytics('page_exit', {
      timeSpent: Date.now() - this.sessionStartTime,
      maxScroll: this.scrollData.get(this.generateSessionId())?.maxScroll || 0
    });
  }

  private setupVisibilityTracking() {
    // Intersection Observer pour tracker la visibilité des éléments
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.sendAnalytics('element_visible', {
            elementId: entry.target.id,
            elementClass: entry.target.className,
            visibilityRatio: entry.intersectionRatio
          });
        }
      });
    }, { threshold: [0.5, 1.0] });

    // Observer les éléments importants
    document.querySelectorAll('[data-track-visibility]').forEach(el => {
      observer.observe(el);
    });
  }
}

// Instance globale
export const heatmapEngine = new AdvancedHeatmapEngine();

// Hook React pour utiliser les heatmaps
export function useHeatmapTracking(pageUrl: string) {
  const trackClick = (x: number, y: number, elementId?: string) => {
    // Logique de tracking
  };

  const getHeatmapVisualization = (options: any) => {
    return heatmapEngine.generateHeatmapVisualization(pageUrl, options);
  };

  const getAnalytics = () => {
    return {
      heatmapData: heatmapEngine.getHeatmapData(pageUrl),
      scrollData: heatmapEngine.getScrollAnalytics(pageUrl)
    };
  };

  return {
    trackClick,
    getHeatmapVisualization,
    getAnalytics
  };
}
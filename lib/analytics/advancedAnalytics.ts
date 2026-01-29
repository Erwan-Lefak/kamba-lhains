// Advanced analytics and tracking system
import React from 'react';
import { performanceManager } from '../performance';

interface AnalyticsEvent {
  id: string;
  name: string;
  category: 'page_view' | 'user_interaction' | 'business' | 'performance' | 'error' | 'conversion';
  timestamp: number;
  sessionId: string;
  userId?: string;
  properties: Record<string, any>;
  context: AnalyticsContext;
  value?: number; // For conversion tracking
}

interface AnalyticsContext {
  page: {
    url: string;
    title: string;
    path: string;
    referrer: string;
  };
  user: {
    id?: string;
    isAuthenticated: boolean;
    segments: string[];
    cohort?: string;
  };
  session: {
    id: string;
    isFirstSession: boolean;
    duration: number;
    pageViews: number;
    events: number;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    screen: { width: number; height: number };
    viewport: { width: number; height: number };
  };
  campaign?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

interface AnalyticsConfig {
  enableAutoTracking: boolean;
  enablePerformanceTracking: boolean;
  enableErrorTracking: boolean;
  enableHeatmaps: boolean;
  sampleRate: number;
  flushInterval: number;
  maxQueueSize: number;
  endpoints: {
    events: string;
    performance: string;
    errors: string;
  };
}

class AdvancedAnalytics {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionData: Partial<AnalyticsContext['session']>;
  private sessionId: string;
  private flushTimer: NodeJS.Timeout | null = null;
  private pageLoadTime: number;
  private isInitialized = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enableAutoTracking: true,
      enablePerformanceTracking: true,
      enableErrorTracking: true,
      enableHeatmaps: false,
      sampleRate: 1.0,
      flushInterval: 10000, // 10 seconds
      maxQueueSize: 100,
      endpoints: {
        events: '/api/analytics/events',
        performance: '/api/analytics/performance',
        errors: '/api/analytics/errors',
      },
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.sessionData = {
      id: this.sessionId,
      isFirstSession: !localStorage.getItem('analytics_session_exists'),
      pageViews: 0,
      events: 0,
    };
    this.pageLoadTime = Date.now();

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Mark session as existing
    localStorage.setItem('analytics_session_exists', 'true');

    // Auto-tracking setup
    if (this.config.enableAutoTracking) {
      this.setupAutoTracking();
    }

    // Performance tracking
    if (this.config.enablePerformanceTracking) {
      this.setupPerformanceTracking();
    }

    // Error tracking integration
    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    // Start flush timer
    this.startFlushTimer();

    // Track initial page view
    this.trackPageView();

    this.isInitialized = true;
  }

  private setupAutoTracking() {
    // Click tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
        this.track('button_click', {
          button_text: target.textContent?.trim(),
          button_type: target.getAttribute('type'),
          element_id: target.id,
          element_class: target.className,
        });
      }

      // Track link clicks
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        this.track('link_click', {
          link_url: link.href,
          link_text: link.textContent?.trim(),
          is_external: link.hostname !== window.location.hostname,
          element_id: link.id,
        });
      }

      // Track product interactions
      const productCard = target.closest('[data-product-id]');
      if (productCard) {
        this.track('product_interaction', {
          product_id: productCard.getAttribute('data-product-id'),
          interaction_type: target.getAttribute('data-action') || 'click',
          element_type: target.tagName.toLowerCase(),
        });
      }
    });

    // Scroll tracking
    let scrollDepth = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    
    window.addEventListener('scroll', this.throttle(() => {
      const depth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      scrollThresholds.forEach(threshold => {
        if (depth >= threshold && scrollDepth < threshold) {
          this.track('scroll_depth', {
            depth_percentage: threshold,
            page_height: document.body.scrollHeight,
            viewport_height: window.innerHeight,
          });
        }
      });
      
      scrollDepth = Math.max(scrollDepth, depth);
    }, 250));

    // Form interactions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submit', {
        form_id: form.id,
        form_action: form.action,
        form_method: form.method,
        field_count: form.elements.length,
      });
    });

    // Visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        visibility_state: document.visibilityState,
        hidden: document.hidden,
      });
    });
  }

  private setupPerformanceTracking() {
    // Web Vitals
    this.trackWebVitals();

    // Resource timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.trackResourceTiming();
      }, 1000);
    });

    // Long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            this.track('long_task', {
              duration: entry.duration,
              start_time: entry.startTime,
              name: entry.name,
            });
          });
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task observer not supported');
      }
    }
  }

  private setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        line_number: event.lineno,
        column_number: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.track('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack,
      });
    });
  }

  private trackWebVitals() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Report CLS after 5 seconds
      setTimeout(() => {
        this.track('web_vital_cls', { value: clsValue });
      }, 5000);

      // LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.track('web_vital_lcp', { value: lastEntry.startTime });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as any;
          const fid = eventEntry.processingStart - entry.startTime;
          this.track('web_vital_fid', { value: fid });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

    } catch (e) {
      console.warn('Web Vitals tracking not supported');
    }
  }

  private trackResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach((resource: any) => {
      if (resource.duration > 100) { // Only track slow resources
        this.track('slow_resource', {
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize,
          type: resource.initiatorType,
          start_time: resource.startTime,
        });
      }
    });
  }

  // Main tracking method
  public track(
    eventName: string,
    properties: Record<string, any> = {},
    options: {
      category?: AnalyticsEvent['category'];
      value?: number;
      userId?: string;
    } = {}
  ): void {
    if (Math.random() > this.config.sampleRate) return;

    const event: AnalyticsEvent = {
      id: this.generateId(),
      name: eventName,
      category: options.category || 'user_interaction',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: options.userId,
      properties,
      context: this.getContext(),
      value: options.value,
    };

    this.eventQueue.push(event);
    this.sessionData.events = (this.sessionData.events || 0) + 1;

    // Flush immediately for critical events
    if (event.category === 'error' || event.category === 'conversion') {
      this.flush();
    } else if (this.eventQueue.length >= this.config.maxQueueSize) {
      this.flush();
    }
  }

  // Specialized tracking methods
  public trackPageView(customProperties: Record<string, any> = {}): void {
    this.sessionData.pageViews = (this.sessionData.pageViews || 0) + 1;

    this.track('page_view', {
      ...customProperties,
      session_page_views: this.sessionData.pageViews,
      time_on_previous_page: this.pageLoadTime ? Date.now() - this.pageLoadTime : 0,
    }, { category: 'page_view' });

    this.pageLoadTime = Date.now();
  }

  public trackConversion(
    conversionName: string,
    value: number,
    properties: Record<string, any> = {}
  ): void {
    this.track(`conversion_${conversionName}`, properties, {
      category: 'conversion',
      value,
    });
  }

  public trackUserAction(
    action: string,
    target: string,
    properties: Record<string, any> = {}
  ): void {
    this.track('user_action', {
      action,
      target,
      ...properties,
    }, { category: 'user_interaction' });
  }

  public trackBusinessEvent(
    eventName: string,
    properties: Record<string, any> = {}
  ): void {
    this.track(eventName, properties, { category: 'business' });
  }

  // User identification
  public identify(userId: string, traits: Record<string, any> = {}): void {
    this.track('user_identify', {
      user_id: userId,
      traits,
    });

    // Store user context
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('analytics_user_id', userId);
      localStorage.setItem('analytics_user_traits', JSON.stringify(traits));
    }
  }

  // Custom dimensions and segments
  public setUserSegment(segment: string): void {
    const segments = this.getUserSegments();
    if (!segments.includes(segment)) {
      segments.push(segment);
      localStorage.setItem('analytics_user_segments', JSON.stringify(segments));
    }
  }

  public removeUserSegment(segment: string): void {
    const segments = this.getUserSegments().filter(s => s !== segment);
    localStorage.setItem('analytics_user_segments', JSON.stringify(segments));
  }

  private getUserSegments(): string[] {
    const stored = localStorage.getItem('analytics_user_segments');
    return stored ? JSON.parse(stored) : [];
  }

  // Context generation
  private getContext(): AnalyticsContext {
    return {
      page: {
        url: window.location.href,
        title: document.title,
        path: window.location.pathname,
        referrer: document.referrer,
      },
      user: {
        id: localStorage.getItem('analytics_user_id') || undefined,
        isAuthenticated: Boolean(localStorage.getItem('analytics_user_id')),
        segments: this.getUserSegments(),
        cohort: this.getUserCohort(),
      },
      session: {
        id: this.sessionId,
        isFirstSession: this.sessionData.isFirstSession || false,
        duration: Date.now() - this.pageLoadTime,
        pageViews: this.sessionData.pageViews || 0,
        events: this.sessionData.events || 0,
      },
      device: this.getDeviceInfo(),
      campaign: this.getCampaignData(),
    };
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    return {
      type: this.getDeviceType(),
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getCampaignData() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      source: urlParams.get('utm_source') || undefined,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
    };
  }

  private getUserCohort(): string | undefined {
    const userId = localStorage.getItem('analytics_user_id');
    if (!userId) return undefined;
    
    // Simple cohort based on user ID hash
    const hash = this.simpleHash(userId);
    return `cohort_${hash % 10}`;
  }

  // Utility methods
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Data management
  private startFlushTimer(): void {
    if (this.flushTimer) return;
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch(this.config.endpoints.events, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
    }
  }

  // Cleanup
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.flush(); // Final flush
  }
}

// Singleton instance
export const analytics = new AdvancedAnalytics();

// React hook
export const useAnalytics = () => {
  const track = React.useCallback((name: string, properties?: Record<string, any>) => {
    analytics.track(name, properties);
  }, []);

  const trackPageView = React.useCallback((properties?: Record<string, any>) => {
    analytics.trackPageView(properties);
  }, []);

  const trackConversion = React.useCallback((name: string, value: number, properties?: Record<string, any>) => {
    analytics.trackConversion(name, value, properties);
  }, []);

  const identify = React.useCallback((userId: string, traits?: Record<string, any>) => {
    analytics.identify(userId, traits);
  }, []);

  return {
    track,
    trackPageView,
    trackConversion,
    identify,
    setUserSegment: analytics.setUserSegment.bind(analytics),
    removeUserSegment: analytics.removeUserSegment.bind(analytics),
  };
};

export default analytics;
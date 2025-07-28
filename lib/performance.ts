// Performance monitoring et optimisations avancées
import React from 'react';

interface PerformanceConfig {
  enableMetrics: boolean;
  enableAnalytics: boolean;
  sampleRate: number;
}

class PerformanceManager {
  private config: PerformanceConfig;
  private metrics: Map<string, number> = new Map();

  constructor(config: PerformanceConfig) {
    this.config = config;
    this.initializePerformanceObservers();
  }

  private initializePerformanceObservers() {
    if (typeof window === 'undefined' || !this.config.enableMetrics) return;

    // Web Vitals Observer
    try {
      // CLS Observer
      new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.recordMetric('CLS', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });

      // LCP Observer
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // FID Observer
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as any; // PerformanceEventTiming
          const fid = eventEntry.processingStart ? eventEntry.processingStart - entry.startTime : 0;
          this.recordMetric('FID', fid);
        }
      }).observe({ entryTypes: ['first-input'] });

    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    
    // Envoyer les métriques si activé
    if (this.config.enableAnalytics && Math.random() < this.config.sampleRate) {
      this.sendMetric(name, value);
    }
  }

  private sendMetric(name: string, value: number) {
    // Utiliser navigator.sendBeacon pour l'envoi non-bloquant
    if ('sendBeacon' in navigator) {
      const data = JSON.stringify({
        metric: name,
        value,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      
      navigator.sendBeacon('/api/metrics', data);
    }
  }

  // Méthodes d'optimisation
  preloadResource(url: string, as: string = 'image') {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  }

  prefetchResource(url: string) {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    return fn().then(result => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    }).catch(error => {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    });
  }

  // Optimisations d'images
  generateResponsiveSizes(breakpoints: number[] = [640, 768, 1024, 1280, 1536]) {
    return breakpoints
      .map((bp, index) => {
        if (index === breakpoints.length - 1) {
          return `${bp}px`;
        }
        return `(max-width: ${bp}px) ${Math.round(bp * 0.9)}px`;
      })
      .join(', ');
  }

  // Lazy loading optimisé
  createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) {
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  }

  // Bundle analysis helpers
  reportBundleSize() {
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle size analysis available in production build');
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Instance globale
export const performanceManager = new PerformanceManager({
  enableMetrics: process.env.NODE_ENV === 'production',
  enableAnalytics: process.env.NODE_ENV === 'production',
  sampleRate: 0.1 // 10% des utilisateurs
});

// Utilitaires d'optimisation
export const optimizeImage = (src: string, width: number, quality: number = 75) => {
  if (src.startsWith('http')) return src;
  
  // Utiliser le service d'optimisation Next.js
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString()
  });
  
  return `/_next/image?${params}`;
};

export const preloadCriticalResources = () => {
  // Précharger les ressources critiques
  const criticalImages = [
    '/images/ui/logo.png',
    '/images/ui/video-poster.jpg'
  ];
  
  const criticalFonts = [
    '/fonts/manrope-variable.woff2'
  ];

  criticalImages.forEach(url => {
    performanceManager.preloadResource(url, 'image');
  });

  criticalFonts.forEach(url => {
    performanceManager.preloadResource(url, 'font');
  });
};

// HOC pour mesurer les performances des composants
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const PerformanceTrackedComponent = (props: P) => {
    const start = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - start;
      performanceManager.recordMetric(`${componentName}_render`, renderTime);
    });

    return React.createElement(WrappedComponent, props);
  };
  
  return PerformanceTrackedComponent;
}
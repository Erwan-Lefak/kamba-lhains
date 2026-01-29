import { useEffect, useState, useCallback, useRef } from 'react';
import { performanceManager } from '../lib/performance';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  renderTime?: number; // Component render time
  memoryUsage?: number; // Memory usage
  domNodeCount?: number; // DOM node count
  imagesLoaded?: number; // Images loaded count
  fps?: number; // Frames per second
}

interface UsePerformanceOptions {
  trackComponent?: boolean;
  trackMemory?: boolean;
  trackFPS?: boolean;
  componentName?: string;
  sampleRate?: number;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    trackComponent = false,
    trackMemory = false,
    trackFPS = false,
    componentName = 'component',
    sampleRate = 1.0
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const renderStartRef = useRef<number>(performance.now());
  const frameRef = useRef<number>(0);
  const fpsRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    // Vérifier la compatibilité
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Mesurer FCP
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          fcpObserver.disconnect();
        }
      }
    });

    // Mesurer LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });

    // Mesurer FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        const eventEntry = entry as any; // PerformanceEventTiming
        if (eventEntry.processingStart) {
          setMetrics(prev => ({ ...prev, fid: eventEntry.processingStart - entry.startTime }));
          fidObserver.disconnect();
        }
      }
    });

    // Mesurer CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Mesurer TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  // Suivi des performances de composant
  useEffect(() => {
    if (!trackComponent || Math.random() > sampleRate) return;

    const renderTime = performance.now() - renderStartRef.current;
    performanceManager.recordMetric(`${componentName}_render_time`, renderTime);
    
    setMetrics(prev => ({
      ...prev,
      renderTime
    }));
  });

  // Suivi de la mémoire
  useEffect(() => {
    if (!trackMemory || typeof window === 'undefined') return;

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory) {
          const memoryUsage = memory.usedJSHeapSize;
          setMetrics(prev => ({
            ...prev,
            memoryUsage
          }));
        }
      }
    };

    measureMemory();
    const interval = setInterval(measureMemory, 5000);
    return () => clearInterval(interval);
  }, [trackMemory]);

  // Suivi des FPS
  useEffect(() => {
    if (!trackFPS) return;

    const measureFPS = (currentTime: number) => {
      if (lastFrameTimeRef.current) {
        const delta = currentTime - lastFrameTimeRef.current;
        const currentFps = 1000 / delta;
        
        fpsRef.current.push(currentFps);
        
        // Garder seulement les 60 dernières mesures
        if (fpsRef.current.length > 60) {
          fpsRef.current.shift();
        }
        
        // Calculer la moyenne
        const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(avgFps)
        }));
      }
      
      lastFrameTimeRef.current = currentTime;
      frameRef.current = requestAnimationFrame(measureFPS);
    };

    frameRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [trackFPS]);

  // Fonctions utilitaires
  const getPerformanceGrade = () => {
    const { fcp, lcp, fid, cls } = metrics;
    let score = 0;
    let total = 0;

    if (fcp !== null) {
      score += fcp < 1800 ? 100 : fcp < 3000 ? 75 : 50;
      total += 100;
    }
    if (lcp !== null) {
      score += lcp < 2500 ? 100 : lcp < 4000 ? 75 : 50;
      total += 100;
    }
    if (fid !== null) {
      score += fid < 100 ? 100 : fid < 300 ? 75 : 50;
      total += 100;
    }
    if (cls !== null) {
      score += cls < 0.1 ? 100 : cls < 0.25 ? 75 : 50;
      total += 100;
    }

    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const logMetrics = () => {
    if (process.env.NODE_ENV === 'development') {
      console.table(metrics);
      console.log(`Performance Grade: ${getPerformanceGrade()}%`);
    }
  };

  // Fonction pour marquer le début d'un rendu
  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Fonction pour envoyer les métriques
  const sendMetrics = useCallback(() => {
    if (Math.random() <= sampleRate && typeof window !== 'undefined') {
      const data = {
        component: componentName,
        metrics,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/performance', JSON.stringify(data));
      }
    }
  }, [componentName, metrics, sampleRate]);

  // Déterminer si l'application est performante
  const isPerformant = useCallback(() => {
    const grade = getPerformanceGrade();
    const fpsOk = !metrics.fps || metrics.fps >= 55;
    return grade >= 80 && fpsOk;
  }, [metrics, getPerformanceGrade]);

  // Obtenir des recommandations d'optimisation
  const getOptimizationTips = useCallback(() => {
    const tips: string[] = [];
    
    if (metrics.fcp && metrics.fcp > 3000) {
      tips.push('Optimiser le First Contentful Paint: réduire la taille des ressources critiques');
    }
    
    if (metrics.lcp && metrics.lcp > 4000) {
      tips.push('Optimiser le Largest Contentful Paint: optimiser les images et précharger les ressources critiques');
    }
    
    if (metrics.cls && metrics.cls > 0.25) {
      tips.push('Réduire le Cumulative Layout Shift: définir les dimensions des images et médias');
    }
    
    if (metrics.fid && metrics.fid > 300) {
      tips.push('Améliorer le First Input Delay: réduire le JavaScript blocking et utiliser le lazy loading');
    }
    
    if (metrics.fps && metrics.fps < 30) {
      tips.push('Améliorer les performances d\'animation: réduire la complexité CSS et optimiser les animations');
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      tips.push('Optimiser l\'utilisation mémoire: nettoyer les event listeners et optimiser les structures de données');
    }

    return tips;
  }, [metrics]);

  return {
    metrics,
    grade: getPerformanceGrade(),
    isPerformant: isPerformant(),
    optimizationTips: getOptimizationTips(),
    logMetrics,
    markRenderStart,
    sendMetrics,
  };
}

// Hook spécialisé pour les Web Vitals
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    CLS?: number;
    FID?: number;
    FCP?: number;
    LCP?: number;
    TTFB?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observers: PerformanceObserver[] = [];

    try {
      // Observer CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        setVitals(prev => ({ ...prev, CLS: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);

      // Observer LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);

      // Observer FID
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const eventEntry = entry as any;
          const fid = eventEntry.processingStart - entry.startTime;
          setVitals(prev => ({ ...prev, FID: fid }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);

    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    // Mesurer FCP
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) {
      setVitals(prev => ({ ...prev, FCP: fcpEntry.startTime }));
    }

    // Mesurer TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setVitals(prev => ({ ...prev, TTFB: ttfb }));
    }

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return vitals;
}
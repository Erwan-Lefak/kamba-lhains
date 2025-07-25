import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

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

  return {
    metrics,
    grade: getPerformanceGrade(),
    logMetrics,
  };
}
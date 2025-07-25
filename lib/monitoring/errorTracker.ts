import { NextApiRequest } from 'next';

export interface ErrorReport {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  environment: 'development' | 'production' | 'staging';
  tags: string[];
  context?: Record<string, any>;
}

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class ErrorTracker {
  private errors: ErrorReport[] = [];
  private metrics: MetricData[] = [];
  private maxErrors = 1000;
  private maxMetrics = 5000;

  /**
   * Capture une erreur avec contexte
   */
  captureError(
    error: Error | string,
    context?: {
      req?: NextApiRequest;
      userId?: string;
      tags?: string[];
      severity?: ErrorReport['severity'];
      extra?: Record<string, any>;
    }
  ): string {
    const errorId = this.generateId();
    const timestamp = Date.now();
    
    const errorReport: ErrorReport = {
      id: errorId,
      timestamp,
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      severity: context?.severity || 'medium',
      environment: (process.env.NODE_ENV as any) || 'development',
      tags: context?.tags || [],
      context: context?.extra
    };

    // Ajouter des informations de la requête si disponible
    if (context?.req) {
      errorReport.url = context.req.url;
      errorReport.method = context.req.method;
      errorReport.userAgent = context.req.headers['user-agent'];
      errorReport.ip = this.getClientIP(context.req);
    }

    if (context?.userId) {
      errorReport.userId = context.userId;
    }

    this.errors.push(errorReport);

    // Maintenir la limite du buffer
    if (this.errors.length > this.maxErrors) {
      this.errors.splice(0, this.errors.length - this.maxErrors);
    }

    // Log selon la sévérité
    this.logError(errorReport);

    // Envoyer vers service externe en production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorReport);
    }

    return errorId;
  }

  /**
   * Capture une métrique
   */
  captureMetric(
    name: string,
    value: number,
    tags?: Record<string, string>
  ): void {
    const metric: MetricData = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);

    // Maintenir la limite du buffer
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.splice(0, this.metrics.length - this.maxMetrics);
    }
  }

  /**
   * Capture le temps d'exécution d'une fonction
   */
  async capturePerformance<T>(
    name: string,
    operation: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      
      this.captureMetric(`${name}.duration`, duration, {
        ...tags,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.captureMetric(`${name}.duration`, duration, {
        ...tags,
        status: 'error'
      });
      
      this.captureError(error as Error, {
        tags: [`performance:${name}`, ...(tags ? Object.entries(tags).map(([k, v]) => `${k}:${v}`) : [])],
        severity: 'high'
      });
      
      throw error;
    }
  }

  /**
   * Obtient les erreurs récentes
   */
  getRecentErrors(
    hours: number = 24,
    severity?: ErrorReport['severity']
  ): ErrorReport[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    
    return this.errors.filter(error => {
      const isRecent = error.timestamp > cutoff;
      const matchesSeverity = !severity || error.severity === severity;
      return isRecent && matchesSeverity;
    });
  }

  /**
   * Obtient les statistiques d'erreurs
   */
  getErrorStats(hours: number = 24): {
    total: number;
    bySeverity: Record<string, number>;
    byHour: Array<{ hour: number; count: number }>;
    topErrors: Array<{ message: string; count: number }>;
    affectedUsers: number;
  } {
    const recentErrors = this.getRecentErrors(hours);
    
    // Par sévérité
    const bySeverity: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };
    
    recentErrors.forEach(error => {
      bySeverity[error.severity]++;
    });

    // Par heure
    const hourlyStats: Record<number, number> = {};
    const now = new Date();
    
    for (let i = 0; i < hours; i++) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000)).getHours();
      hourlyStats[hour] = 0;
    }
    
    recentErrors.forEach(error => {
      const hour = new Date(error.timestamp).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    const byHour = Object.entries(hourlyStats).map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }));

    // Top erreurs
    const errorCounts: Record<string, number> = {};
    recentErrors.forEach(error => {
      errorCounts[error.message] = (errorCounts[error.message] || 0) + 1;
    });

    const topErrors = Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Utilisateurs affectés
    const affectedUserIds = new Set(
      recentErrors
        .filter(error => error.userId)
        .map(error => error.userId!)
    );

    return {
      total: recentErrors.length,
      bySeverity,
      byHour,
      topErrors,
      affectedUsers: affectedUserIds.size
    };
  }

  /**
   * Obtient les métriques récentes
   */
  getRecentMetrics(
    metricName: string,
    hours: number = 24
  ): MetricData[] {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    
    return this.metrics.filter(metric => 
      metric.name === metricName && metric.timestamp > cutoff
    );
  }

  /**
   * Calcule les statistiques de performance
   */
  getPerformanceStats(
    metricName: string,
    hours: number = 24
  ): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  } {
    const metrics = this.getRecentMetrics(metricName, hours);
    
    if (metrics.length === 0) {
      return { count: 0, avg: 0, min: 0, max: 0, p95: 0, p99: 0 };
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count,
      avg: sum / count,
      min: values[0],
      max: values[count - 1],
      p95: values[Math.floor(count * 0.95)],
      p99: values[Math.floor(count * 0.99)]
    };
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Obtient l'IP du client
   */
  private getClientIP(req: NextApiRequest): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const xRealIP = req.headers['x-real-ip'];
    
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }
    
    if (typeof xRealIP === 'string') {
      return xRealIP;
    }
    
    return 'unknown';
  }

  /**
   * Log l'erreur selon sa sévérité
   */
  private logError(error: ErrorReport): void {
    const logData = {
      id: error.id,
      message: error.message,
      severity: error.severity,
      url: error.url,
      userId: error.userId,
      tags: error.tags
    };

    switch (error.severity) {
      case 'critical':
        console.error('🚨 CRITICAL ERROR:', logData);
        break;
      case 'high':
        console.error('🔴 HIGH SEVERITY ERROR:', logData);
        break;
      case 'medium':
        console.warn('🟡 MEDIUM SEVERITY ERROR:', logData);
        break;
      case 'low':
        console.log('🟢 LOW SEVERITY ERROR:', logData);
        break;
    }
  }

  /**
   * Envoie vers un service externe (placeholder)
   */
  private async sendToExternalService(error: ErrorReport): Promise<void> {
    // En production, intégrer avec Sentry, DataDog, etc.
    try {
      // Exemple d'intégration webhook
      if (process.env.ERROR_WEBHOOK_URL) {
        await fetch(process.env.ERROR_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(error)
        });
      }
    } catch (sendError) {
      console.error('Failed to send error to external service:', sendError);
    }
  }

  /**
   * Nettoie les anciennes données
   */
  cleanup(maxAgeHours: number = 72): void {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    
    this.errors = this.errors.filter(error => error.timestamp > cutoff);
    this.metrics = this.metrics.filter(metric => metric.timestamp > cutoff);
  }
}

// Instance globale
export const errorTracker = new ErrorTracker();

// Middleware pour capturer automatiquement les erreurs API
export function withErrorTracking(
  handler: (req: NextApiRequest, res: any) => Promise<any>
) {
  return async (req: NextApiRequest, res: any) => {
    try {
      return await errorTracker.capturePerformance(
        `api.${req.method?.toLowerCase()}.${req.url?.replace(/[^a-zA-Z0-9]/g, '_')}`,
        () => handler(req, res),
        {
          method: req.method || 'unknown',
          endpoint: req.url || 'unknown'
        }
      );
    } catch (error) {
      errorTracker.captureError(error as Error, {
        req,
        severity: 'high',
        tags: ['api-error']
      });
      
      // Re-throw pour que l'erreur soit gérée normalement
      throw error;
    }
  };
}

// Nettoyage automatique toutes les heures
if (typeof window === 'undefined') {
  setInterval(() => {
    errorTracker.cleanup();
  }, 60 * 60 * 1000); // 1 heure
}
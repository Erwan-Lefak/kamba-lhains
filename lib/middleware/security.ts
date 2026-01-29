import { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';

interface SecurityConfig {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableXSSProtection?: boolean;
  enableFrameGuard?: boolean;
  enableContentTypeSniffing?: boolean;
  enableReferrerPolicy?: boolean;
  enablePermissionsPolicy?: boolean;
  rateLimitByIP?: boolean;
  detectSuspiciousActivity?: boolean;
}

interface SuspiciousActivity {
  ip: string;
  timestamp: number;
  reason: string;
  endpoint: string;
  userAgent?: string;
}

// Store pour les activités suspectes
const suspiciousActivities: SuspiciousActivity[] = [];
const blockedIPs = new Set<string>();

/**
 * Middleware de sécurité avancée
 */
export function securityHeaders(config: SecurityConfig = {}) {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableXSSProtection = true,
    enableFrameGuard = true,
    enableContentTypeSniffing = true,
    enableReferrerPolicy = true,
    enablePermissionsPolicy = true,
    detectSuspiciousActivity = true
  } = config;

  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = getClientIP(req);
    
    // Vérifier si l'IP est bloquée
    if (blockedIPs.has(ip)) {
      return res.status(403).json({
        success: false,
        error: 'Accès interdit',
        code: 'IP_BLOCKED'
      });
    }
    
    // Détecter les activités suspectes
    if (detectSuspiciousActivity) {
      const suspiciousCheck = await detectSuspiciousRequest(req);
      if (suspiciousCheck.isSuspicious) {
        logSuspiciousActivity({
          ip,
          timestamp: Date.now(),
          reason: suspiciousCheck.reason,
          endpoint: req.url || '',
          userAgent: req.headers['user-agent']
        });
        
        // Bloquer temporairement si trop d'activités suspectes
        if (getSuspiciousActivityCount(ip) > 5) {
          blockIP(ip, 60 * 60 * 1000); // Bloquer 1 heure
        }
      }
    }
    
    // Headers de sécurité
    if (enableCSP) {
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.stripe.com *.vercel.app",
          "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
          "font-src 'self' fonts.gstatic.com",
          "img-src 'self' data: blob: *.stripe.com *.vercel.app",
          "connect-src 'self' *.stripe.com api.stripe.com *.vercel.app",
          "frame-src 'self' *.stripe.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ')
      );
    }
    
    if (enableHSTS) {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    if (enableXSSProtection) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
    
    if (enableFrameGuard) {
      res.setHeader('X-Frame-Options', 'DENY');
    }
    
    if (enableContentTypeSniffing) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    
    if (enableReferrerPolicy) {
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
    
    if (enablePermissionsPolicy) {
      res.setHeader(
        'Permissions-Policy',
        [
          'camera=()',
          'microphone=()',
          'geolocation=()',
          'payment=(self)',
          'usb=()',
          'accelerometer=()',
          'gyroscope=()',
          'magnetometer=()'
        ].join(', ')
      );
    }
    
    // Headers additionnels
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    next();
  };
}

/**
 * Détecte les requêtes suspectes
 */
async function detectSuspiciousRequest(req: NextApiRequest): Promise<{
  isSuspicious: boolean;
  reason: string;
}> {
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers.referer || '';
  const ip = getClientIP(req);
  
  // Patterns suspects dans l'User-Agent
  const suspiciousUAPatterns = [
    /sqlmap/i,
    /nikto/i,
    /nessus/i,
    /burp/i,
    /wget/i,
    /curl/i,
    /python-requests/i,
    /postman/i
  ];
  
  if (suspiciousUAPatterns.some(pattern => pattern.test(userAgent))) {
    return {
      isSuspicious: true,
      reason: 'Suspicious User-Agent detected'
    };
  }
  
  // Patterns suspects dans l'URL
  const suspiciousURLPatterns = [
    /\.\./,  // Directory traversal
    /\bunion\s+select/i,  // SQL Injection
    /<script/i,  // XSS
    /javascript:/i,  // JavaScript injection
    /vbscript:/i,  // VBScript injection
    /onload=/i,  // Event handler injection
    /eval\(/i,  // Code evaluation
    /phpinfo/i,  // PHP info disclosure
    /wp-admin/i,  // WordPress admin access
    /\.php$/i,  // PHP file access (not expected)
    /\.asp$/i,  // ASP file access
    /\.jsp$/i   // JSP file access
  ];
  
  const url = req.url || '';
  if (suspiciousURLPatterns.some(pattern => pattern.test(url))) {
    return {
      isSuspicious: true,
      reason: 'Suspicious URL pattern detected'
    };
  }
  
  // Headers suspects
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-originating-ip',
    'x-remote-ip',
    'x-injected-by'
  ];
  
  for (const header of suspiciousHeaders) {
    const value = req.headers[header];
    if (value && typeof value === 'string' && value.includes('..')) {
      return {
        isSuspicious: true,
        reason: `Suspicious header: ${header}`
      };
    }
  }
  
  // Vérifier le body pour les patterns suspects
  if (req.body && typeof req.body === 'string') {
    const suspiciousBodyPatterns = [
      /<script/i,
      /javascript:/i,
      /union\s+select/i,
      /drop\s+table/i,
      /insert\s+into/i,
      /delete\s+from/i
    ];
    
    if (suspiciousBodyPatterns.some(pattern => pattern.test(req.body))) {
      return {
        isSuspicious: true,
        reason: 'Suspicious payload detected'
      };
    }
  }
  
  return {
    isSuspicious: false,
    reason: ''
  };
}

/**
 * Log une activité suspecte
 */
function logSuspiciousActivity(activity: SuspiciousActivity): void {
  suspiciousActivities.push(activity);
  
  // Garder seulement les 1000 dernières activités
  if (suspiciousActivities.length > 1000) {
    suspiciousActivities.splice(0, 100);
  }
  
  // Log pour monitoring externe
  console.warn('🚨 Suspicious activity detected:', {
    ip: activity.ip,
    reason: activity.reason,
    endpoint: activity.endpoint,
    timestamp: new Date(activity.timestamp).toISOString()
  });
}

/**
 * Compte les activités suspectes pour une IP dans les dernières 24h
 */
function getSuspiciousActivityCount(ip: string): number {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  return suspiciousActivities.filter(
    activity => activity.ip === ip && activity.timestamp > oneDayAgo
  ).length;
}

/**
 * Bloque une IP temporairement
 */
function blockIP(ip: string, durationMs: number): void {
  blockedIPs.add(ip);
  
  setTimeout(() => {
    blockedIPs.delete(ip);
    console.log(`🔓 IP ${ip} unblocked after temporary ban`);
  }, durationMs);
  
  console.warn(`🔒 IP ${ip} temporarily blocked for ${durationMs}ms`);
}

/**
 * Obtient l'IP réelle du client
 */
function getClientIP(req: NextApiRequest): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const xRealIP = req.headers['x-real-ip'];
  const connection = (req as any).connection;
  const socket = (req as any).socket;
  
  if (typeof xForwardedFor === 'string') {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (typeof xRealIP === 'string') {
    return xRealIP;
  }
  
  return connection?.remoteAddress || 
         socket?.remoteAddress || 
         '127.0.0.1';
}

/**
 * Génère un hash de la requête pour détecter les répétitions
 */
function generateRequestHash(req: NextApiRequest): string {
  const data = {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: getClientIP(req),
    body: typeof req.body === 'string' ? req.body.slice(0, 100) : ''
  };
  
  return createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');
}

/**
 * Obtient les statistiques de sécurité
 */
export function getSecurityStats(): {
  suspiciousActivitiesLast24h: number;
  uniqueSuspiciousIPs: number;
  currentlyBlockedIPs: number;
  topSuspiciousReasons: Array<{ reason: string; count: number }>;
} {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const recentActivities = suspiciousActivities.filter(
    activity => activity.timestamp > oneDayAgo
  );
  
  const uniqueIPs = new Set(recentActivities.map(activity => activity.ip));
  
  // Compter les raisons les plus fréquentes
  const reasons: { [key: string]: number } = {};
  recentActivities.forEach(activity => {
    reasons[activity.reason] = (reasons[activity.reason] || 0) + 1;
  });
  
  const topReasons = Object.entries(reasons)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    suspiciousActivitiesLast24h: recentActivities.length,
    uniqueSuspiciousIPs: uniqueIPs.size,
    currentlyBlockedIPs: blockedIPs.size,
    topSuspiciousReasons: topReasons
  };
}

/**
 * Middleware de sécurité par défaut
 */
export const defaultSecurityMiddleware = securityHeaders({
  enableCSP: true,
  enableHSTS: true,
  enableXSSProtection: true,
  enableFrameGuard: true,
  enableContentTypeSniffing: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
  detectSuspiciousActivity: true
});
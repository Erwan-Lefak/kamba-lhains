import { NextApiRequest, NextApiResponse } from 'next';

interface RateLimitConfig {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxRequests: number; // Nombre maximum de requêtes
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Store en mémoire (pour dev - utiliser Redis en production)
const rateLimitStore: RateLimitStore = {};

/**
 * Middleware de rate limiting basé sur l'IP
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Trop de requêtes, veuillez réessayer plus tard.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = config;

  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const ip = getClientIP(req);
    const key = `${ip}:${req.url}`;
    const now = Date.now();
    
    // Nettoyer les entrées expirées
    cleanExpiredEntries();
    
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 0,
        resetTime: now + windowMs
      };
    }
    
    const record = rateLimitStore[key];
    
    // Réinitialiser si la fenêtre est expirée
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Vérifier la limite
    if (record.count >= maxRequests) {
      const resetTime = Math.ceil((record.resetTime - now) / 1000);
      
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', resetTime);
      
      return res.status(429).json({
        success: false,
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: resetTime
      });
    }
    
    // Incrémenter le compteur
    record.count++;
    
    // Headers informatifs
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil((record.resetTime - now) / 1000));
    
    // Continuer vers le handler suivant
    const originalJson = res.json;
    const originalStatus = res.status;
    let responseStatus = 200;
    
    // Intercepter le status de la réponse
    res.status = function(code: number) {
      responseStatus = code;
      return originalStatus.call(this, code);
    };
    
    // Intercepter la réponse pour ajuster le compteur si nécessaire
    res.json = function(body: any) {
      // Décrémenter si on doit ignorer les succès/échecs
      if (
        (skipSuccessfulRequests && responseStatus >= 200 && responseStatus < 400) ||
        (skipFailedRequests && responseStatus >= 400)
      ) {
        record.count--;
      }
      
      return originalJson.call(this, body);
    };
    
    next();
  };
}

/**
 * Rate limiting spécialisé pour l'authentification
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  skipSuccessfulRequests: true
});

/**
 * Rate limiting général pour l'API
 */
export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: 'Limite de requêtes API dépassée. Réessayez dans une minute.'
});

/**
 * Rate limiting strict pour les actions sensibles
 */
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  maxRequests: 10,
  message: 'Limite d\'actions sensibles dépassée. Réessayez dans une heure.'
});

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
 * Nettoie les entrées expirées du store
 */
function cleanExpiredEntries(): void {
  const now = Date.now();
  
  for (const key in rateLimitStore) {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  }
}

/**
 * Réinitialise le rate limit pour une IP donnée (pour les tests)
 */
export function resetRateLimit(ip: string, url?: string): void {
  const key = url ? `${ip}:${url}` : ip;
  if (url) {
    delete rateLimitStore[key];
  } else {
    // Réinitialiser toutes les entrées pour cette IP
    for (const storeKey in rateLimitStore) {
      if (storeKey.startsWith(`${ip}:`)) {
        delete rateLimitStore[storeKey];
      }
    }
  }
}

/**
 * Obtient les statistiques de rate limiting
 */
export function getRateLimitStats(): { 
  totalEntries: number; 
  activeEntries: number;
  topIPs: Array<{ ip: string; requests: number }>;
} {
  const now = Date.now();
  const activeEntries = Object.keys(rateLimitStore).filter(
    key => rateLimitStore[key].resetTime > now
  );
  
  // Grouper par IP pour obtenir le top des IPs
  const ipCounts: { [ip: string]: number } = {};
  
  activeEntries.forEach(key => {
    const ip = key.split(':')[0];
    ipCounts[ip] = (ipCounts[ip] || 0) + rateLimitStore[key].count;
  });
  
  const topIPs = Object.entries(ipCounts)
    .map(([ip, requests]) => ({ ip, requests }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 10);
  
  return {
    totalEntries: Object.keys(rateLimitStore).length,
    activeEntries: activeEntries.length,
    topIPs
  };
}
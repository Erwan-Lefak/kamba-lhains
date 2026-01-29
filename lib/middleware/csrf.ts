import { NextApiRequest, NextApiResponse } from 'next';

/**
 * CSRF Protection Middleware
 *
 * Protects against Cross-Site Request Forgery attacks by:
 * 1. Verifying Origin/Referer headers match the host
 * 2. Requiring SameSite cookies (configured in NextAuth)
 * 3. Checking request method (POST, PUT, DELETE require validation)
 *
 * Usage: Wrap your API routes with this middleware
 */

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXTAUTH_URL,
  'https://kamba-lhains.com',
  'https://www.kamba-lhains.com',
].filter(Boolean);

export function csrfProtection(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Skip CSRF check for safe methods
    if (SAFE_METHODS.includes(req.method || '')) {
      return handler(req, res);
    }

    // Get origin or referer
    const origin = req.headers.origin || req.headers.referer;
    const host = req.headers.host;

    // In development, be more lenient
    if (process.env.NODE_ENV === 'development') {
      // Allow localhost requests
      if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
        return handler(req, res);
      }
    }

    // Verify origin matches allowed origins
    if (origin) {
      const originUrl = new URL(origin);
      const originHost = originUrl.host;

      // Check if origin is in allowed list or matches current host
      const isAllowed = ALLOWED_ORIGINS.some(allowedOrigin => {
        if (!allowedOrigin) return false;
        try {
          const allowedUrl = new URL(allowedOrigin);
          return allowedUrl.host === originHost;
        } catch {
          return false;
        }
      });

      if (!isAllowed && originHost !== host) {
        console.warn('[CSRF] Blocked request from unauthorized origin:', {
          origin: originHost,
          host,
          method: req.method,
          path: req.url,
        });

        return res.status(403).json({
          error: 'CSRF validation failed',
          message: 'Request origin not allowed'
        });
      }
    } else {
      // No origin or referer header - this is suspicious for state-changing requests
      console.warn('[CSRF] Blocked request without origin/referer:', {
        method: req.method,
        path: req.url,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      });

      return res.status(403).json({
        error: 'CSRF validation failed',
        message: 'Missing origin header'
      });
    }

    // CSRF check passed, proceed with handler
    return handler(req, res);
  };
}

/**
 * Enhanced CSRF protection with token validation
 * For forms, you can generate and validate CSRF tokens
 */
export function generateCsrfToken(): string {
  return Buffer.from(
    `${Date.now()}-${Math.random().toString(36)}`
  ).toString('base64');
}

export function validateCsrfToken(token: string, maxAge: number = 3600000): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [timestamp] = decoded.split('-');
    const tokenAge = Date.now() - parseInt(timestamp);
    return tokenAge < maxAge;
  } catch {
    return false;
  }
}

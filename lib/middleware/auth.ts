import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken, getTokenFromRequest } from '../auth';

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthenticatedRequest extends NextApiRequest {
  user: User;
}

interface AuthOptions {
  adminOnly?: boolean;
}

type AuthHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse>;
type OptionalAuthHandler = (req: NextApiRequest & { user?: User }, res: NextApiResponse) => Promise<void | NextApiResponse>;

export function withAuth(handler: AuthHandler, options: AuthOptions = {}): (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = getTokenFromRequest(req);
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token d\'authentification requis' 
        });
      }

      const user = await getUserFromToken(token);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token invalide ou expiré' 
        });
      }

      // Check role-based access
      if (options.adminOnly && user.role !== 'ADMIN') {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès administrateur requis' 
        });
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = user;

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur d\'authentification' 
      });
    }
  };
}

export function withOptionalAuth(handler: OptionalAuthHandler): (req: NextApiRequest, res: NextApiResponse) => Promise<void | NextApiResponse> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = getTokenFromRequest(req);
      
      if (token) {
        const user = await getUserFromToken(token);
        if (user) {
          (req as NextApiRequest & { user?: User }).user = user;
        }
      }

      return handler(req as NextApiRequest & { user?: User }, res);
    } catch (error) {
      console.error('Optional auth middleware error:', error);
      // Continue without authentication
      return handler(req as NextApiRequest & { user?: User }, res);
    }
  };
}
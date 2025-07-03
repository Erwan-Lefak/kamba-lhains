import { getUserFromToken, getTokenFromRequest } from '../auth'

export function withAuth(handler, options = {}) {
  return async (req, res) => {
    try {
      const token = getTokenFromRequest(req)
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token d\'authentification requis' 
        })
      }

      const user = await getUserFromToken(token)
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token invalide ou expiré' 
        })
      }

      // Check role-based access
      if (options.adminOnly && user.role !== 'ADMIN') {
        return res.status(403).json({ 
          success: false, 
          message: 'Accès administrateur requis' 
        })
      }

      // Attach user to request
      req.user = user

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur d\'authentification' 
      })
    }
  }
}

export function withOptionalAuth(handler) {
  return async (req, res) => {
    try {
      const token = getTokenFromRequest(req)
      
      if (token) {
        const user = await getUserFromToken(token)
        if (user) {
          req.user = user
        }
      }

      return handler(req, res)
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      // Continue without authentication
      return handler(req, res)
    }
  }
}
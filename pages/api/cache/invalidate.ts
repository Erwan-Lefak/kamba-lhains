import { NextApiRequest, NextApiResponse } from 'next';
import { cache } from '../../../lib/cache/redis';

interface InvalidateRequest {
  type: 'tag' | 'key' | 'pattern' | 'all';
  value?: string;
  tags?: string[];
  keys?: string[];
}

interface InvalidateResponse {
  success: boolean;
  message: string;
  invalidated?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvalidateResponse>
) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Vérification d'autorisation
  const authHeader = req.headers.authorization;
  if (!authHeader || !isValidAuthToken(authHeader)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    const { type, value, tags, keys }: InvalidateRequest = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type is required (tag, key, pattern, or all)'
      });
    }

    let invalidatedCount = 0;
    let message = '';

    switch (type) {
      case 'tag':
        if (!value) {
          return res.status(400).json({
            success: false,
            message: 'Tag value is required'
          });
        }
        invalidatedCount = await cache.invalidateTag(value);
        message = `Invalidated ${invalidatedCount} keys for tag: ${value}`;
        break;

      case 'key':
        if (!value) {
          return res.status(400).json({
            success: false,
            message: 'Key value is required'
          });
        }
        const deleted = await cache.del(value);
        invalidatedCount = deleted ? 1 : 0;
        message = deleted 
          ? `Invalidated key: ${value}` 
          : `Key not found: ${value}`;
        break;

      case 'pattern':
        if (!value) {
          return res.status(400).json({
            success: false,
            message: 'Pattern value is required'
          });
        }
        invalidatedCount = await invalidateByPattern(value);
        message = `Invalidated ${invalidatedCount} keys matching pattern: ${value}`;
        break;

      case 'all':
        const flushed = await cache.flush();
        message = flushed 
          ? 'All cache cleared successfully' 
          : 'Failed to clear cache';
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Must be: tag, key, pattern, or all'
        });
    }

    // Invalidation multiple si des tags/keys sont fournis
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        const count = await cache.invalidateTag(tag);
        invalidatedCount += count;
      }
      message += ` | Invalidated ${tags.length} additional tags`;
    }

    if (keys && keys.length > 0) {
      for (const key of keys) {
        const deleted = await cache.del(key);
        if (deleted) invalidatedCount++;
      }
      message += ` | Invalidated ${keys.length} additional keys`;
    }

    res.status(200).json({
      success: true,
      message,
      invalidated: invalidatedCount
    });

  } catch (error) {
    console.error('Cache invalidation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during cache invalidation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Vérification du token d'autorisation
 */
function isValidAuthToken(authHeader: string): boolean {
  const token = authHeader.replace('Bearer ', '');
  const validToken = process.env.CACHE_ADMIN_TOKEN;
  
  if (!validToken) {
    console.warn('CACHE_ADMIN_TOKEN not configured');
    return false;
  }
  
  return token === validToken;
}

/**
 * Invalidation par pattern (attention: peut être coûteux)
 */
async function invalidateByPattern(pattern: string): Promise<number> {
  if (!cache.isReady()) {
    return 0;
  }

  try {
    // Récupérer les clés correspondant au pattern
    const pipeline = cache.pipeline();
    pipeline.keys(pattern);
    const results = await pipeline.exec();
    
    if (!results || results[0][0] !== null) {
      return 0;
    }

    const keys = results[0][1] as string[];
    
    if (keys.length === 0) {
      return 0;
    }

    // Supprimer les clés par batch pour éviter de bloquer Redis
    const batchSize = 100;
    let deletedCount = 0;

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      const deletePipeline = cache.pipeline();
      
      batch.forEach(key => deletePipeline.del(key));
      
      const deleteResults = await deletePipeline.exec();
      
      if (deleteResults) {
        deletedCount += deleteResults.filter(result => result[0] === null && result[1] === 1).length;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Pattern invalidation error:', error);
    return 0;
  }
}
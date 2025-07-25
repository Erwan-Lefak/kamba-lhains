import { NextApiRequest, NextApiResponse } from 'next';
import { CacheWarmup } from '../../../lib/cache/strategies';
import { cache } from '../../../lib/cache/redis';

interface WarmupRequest {
  type: 'products' | 'pages' | 'custom';
  items?: string[];
  config?: {
    concurrency?: number;
    ttl?: number;
    tags?: string[];
  };
}

interface WarmupResponse {
  success: boolean;
  message: string;
  warmedUp?: number;
  failed?: number;
  duration?: number;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WarmupResponse>
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

  const startTime = Date.now();

  try {
    const { type, items = [], config = {} }: WarmupRequest = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Type is required (products, pages, or custom)'
      });
    }

    const {
      concurrency = 5,
      ttl = 3600,
      tags = ['warmup']
    } = config;

    let warmedUp = 0;
    let failed = 0;
    let message = '';

    switch (type) {
      case 'products':
        if (items.length === 0) {
          // Récupérer les produits populaires par défaut
          const popularProducts = await getPopularProducts();
          await CacheWarmup.warmupProducts(popularProducts);
          warmedUp = popularProducts.length;
          message = `Warmed up ${warmedUp} popular products`;
        } else {
          await CacheWarmup.warmupProducts(items);
          warmedUp = items.length;
          message = `Warmed up ${warmedUp} specified products`;
        }
        break;

      case 'pages':
        if (items.length === 0) {
          // Pages par défaut à warmer
          const defaultPages = [
            '/',
            '/boutique',
            '/nouvelle-collection',
            '/tous-les-produits',
            '/aube',
            '/zenith',
            '/crepuscule'
          ];
          await CacheWarmup.warmupPages(defaultPages);
          warmedUp = defaultPages.length;
          message = `Warmed up ${warmedUp} default pages`;
        } else {
          await CacheWarmup.warmupPages(items);
          warmedUp = items.length;
          message = `Warmed up ${warmedUp} specified pages`;
        }
        break;

      case 'custom':
        if (items.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Items are required for custom warmup'
          });
        }

        // Warmup personnalisé
        const results = await customWarmup(items, {
          concurrency,
          ttl,
          tags,
          onProgress: (completed, total) => {
            console.log(`Custom warmup progress: ${completed}/${total}`);
          }
        });

        warmedUp = results.success;
        failed = results.failed;
        message = `Custom warmup completed: ${warmedUp} success, ${failed} failed`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type. Must be: products, pages, or custom'
        });
    }

    const duration = Date.now() - startTime;

    res.status(200).json({
      success: true,
      message,
      warmedUp,
      failed,
      duration
    });

  } catch (error) {
    console.error('Cache warmup error:', error);
    const duration = Date.now() - startTime;
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during cache warmup',
      duration,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Récupération des produits populaires
 */
async function getPopularProducts(): Promise<string[]> {
  try {
    // Simuler la récupération des produits populaires
    // En réalité, cela viendrait de votre base de données ou analytics
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?featured=true&limit=20`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch popular products');
    }

    const data = await response.json();
    return data.products?.map((p: any) => p.id.toString()) || [];
  } catch (error) {
    console.error('Error fetching popular products:', error);
    // Fallback avec des IDs par défaut
    return ['1', '2', '3', '4', '5'];
  }
}

/**
 * Warmup personnalisé avec gestion granulaire
 */
async function customWarmup(
  items: string[],
  options: {
    concurrency: number;
    ttl: number;
    tags: string[];
    onProgress?: (completed: number, total: number) => void;
  }
): Promise<{ success: number; failed: number }> {
  const { concurrency, ttl, tags, onProgress } = options;
  let success = 0;
  let failed = 0;

  // Traitement par batch
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    
    const promises = batch.map(async (item) => {
      try {
        // Déterminer le type d'item et le fetcher approprié
        let data;
        let key;

        if (item.startsWith('/')) {
          // C'est un path de page
          key = `page:${item}`;
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${item}`);
          data = await response.text();
        } else if (item.startsWith('product:')) {
          // C'est un ID de produit
          const productId = item.replace('product:', '');
          key = `product:${productId}`;
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`);
          data = await response.json();
        } else if (item.startsWith('user:')) {
          // C'est un ID d'utilisateur
          const userId = item.replace('user:', '');
          key = `user:${userId}`;
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`);
          data = await response.json();
        } else {
          // Traitement générique
          key = item;
          data = { cached: true, timestamp: Date.now() };
        }

        await cache.set(key, data, { ttl, tags });
        success++;
        
      } catch (error) {
        console.error(`Warmup failed for item ${item}:`, error);
        failed++;
      } finally {
        onProgress?.(success + failed, items.length);
      }
    });

    await Promise.allSettled(promises);
  }

  return { success, failed };
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
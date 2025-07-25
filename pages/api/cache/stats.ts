import { NextApiRequest, NextApiResponse } from 'next';
import { cache } from '../../../lib/cache/redis';

interface CacheStatsResponse {
  success: boolean;
  data?: {
    hits: number;
    misses: number;
    keys: number;
    memory: string;
    hitRate: number;
    uptime: string;
    connections: number;
    operations: {
      gets: number;
      sets: number;
      deletes: number;
    };
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CacheStatsResponse>
) {
  // Seules les requêtes GET sont autorisées
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  // Vérification d'autorisation (optionnel - à adapter selon vos besoins)
  const authHeader = req.headers.authorization;
  if (process.env.NODE_ENV === 'production' && !authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  try {
    // Récupérer les statistiques de base
    const basicStats = await cache.getStats();

    // Récupérer des informations supplémentaires depuis Redis
    const redisInfo = await getRedisInfo();

    const stats = {
      ...basicStats,
      uptime: redisInfo.uptime || '0s',
      connections: redisInfo.connections || 0,
      operations: {
        gets: redisInfo.gets || 0,
        sets: redisInfo.sets || 0,
        deletes: redisInfo.deletes || 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cache statistics'
    });
  }
}

async function getRedisInfo(): Promise<{
  uptime?: string;
  connections?: number;
  gets?: number;
  sets?: number;
  deletes?: number;
}> {
  try {
    if (!cache.isReady()) {
      return {};
    }

    // Utiliser le pipeline pour récupérer plusieurs infos
    const pipeline = cache.pipeline();
    pipeline.info('server');
    pipeline.info('clients');
    pipeline.info('stats');
    
    const results = await pipeline.exec();
    
    if (!results || results.some(result => result[0] !== null)) {
      return {};
    }

    const [serverInfo, clientsInfo, statsInfo] = results.map(result => result[1] as string);

    // Parser les informations
    const parseInfo = (info: string): Record<string, string> => {
      const parsed: Record<string, string> = {};
      info.split('\r\n').forEach(line => {
        const [key, value] = line.split(':');
        if (key && value) {
          parsed[key] = value;
        }
      });
      return parsed;
    };

    const server = parseInfo(serverInfo);
    const clients = parseInfo(clientsInfo);
    const stats = parseInfo(statsInfo);

    // Convertir l'uptime en format lisible
    const uptimeSeconds = parseInt(server.uptime_in_seconds || '0');
    const uptime = formatUptime(uptimeSeconds);

    return {
      uptime,
      connections: parseInt(clients.connected_clients || '0'),
      gets: parseInt(stats.keyspace_hits || '0'),
      sets: parseInt(stats.keyspace_misses || '0'),
      deletes: parseInt(stats.evicted_keys || '0')
    };
  } catch (error) {
    console.error('Error getting Redis info:', error);
    return {};
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
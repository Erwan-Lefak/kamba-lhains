import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CacheStats {
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
}

interface CacheMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
}

export default function CacheMonitor({ 
  autoRefresh = true, 
  refreshInterval = 30000,
  onError 
}: CacheMonitorProps) {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cache/stats');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch cache stats');
      }

      setStats(data.data);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const invalidateCache = async (type: string, value?: string) => {
    try {
      const response = await fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CACHE_ADMIN_TOKEN}`
        },
        body: JSON.stringify({ type, value })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}`);
        fetchStats(); // Refresh stats
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const warmupCache = async (type: string) => {
    try {
      const response = await fetch('/api/cache/warmup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CACHE_ADMIN_TOKEN}`
        },
        body: JSON.stringify({ type })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message} (${data.duration}ms)`);
        fetchStats(); // Refresh stats
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading && !stats) {
    return (
      <div className="cache-monitor loading">
        <div className="loader">Loading cache stats...</div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="cache-monitor error">
        <h3>❌ Cache Monitor Error</h3>
        <p>{error}</p>
        <button onClick={fetchStats}>Retry</button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const hitRateColor = stats.hitRate >= 80 ? '#10b981' : stats.hitRate >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="cache-monitor">
      <div className="cache-header">
        <h3>📊 Cache Monitor</h3>
        <div className="cache-actions">
          <button onClick={fetchStats} disabled={loading}>
            🔄 Refresh
          </button>
          <button onClick={() => invalidateCache('all')}>
            🗑️ Clear All
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <div className="cache-stats-grid">
        {/* Hit Rate */}
        <motion.div 
          className="stat-card hit-rate"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="stat-header">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Hit Rate</span>
          </div>
          <div className="stat-value" style={{ color: hitRateColor }}>
            {stats.hitRate.toFixed(1)}%
          </div>
          <div className="stat-subtext">
            {stats.hits} hits / {stats.misses} misses
          </div>
        </motion.div>

        {/* Memory Usage */}
        <motion.div 
          className="stat-card memory"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="stat-header">
            <span className="stat-icon">💾</span>
            <span className="stat-label">Memory</span>
          </div>
          <div className="stat-value">{stats.memory}</div>
          <div className="stat-subtext">{stats.keys} keys</div>
        </motion.div>

        {/* Connections */}
        <motion.div 
          className="stat-card connections"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="stat-header">
            <span className="stat-icon">🔌</span>
            <span className="stat-label">Connections</span>
          </div>
          <div className="stat-value">{stats.connections}</div>
          <div className="stat-subtext">Uptime: {stats.uptime}</div>
        </motion.div>

        {/* Operations */}
        <motion.div 
          className="stat-card operations"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="stat-header">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">Operations</span>
          </div>
          <div className="operations-breakdown">
            <div>Gets: {stats.operations.gets}</div>
            <div>Sets: {stats.operations.sets}</div>
            <div>Deletes: {stats.operations.deletes}</div>
          </div>
        </motion.div>
      </div>

      {/* Cache Management Actions */}
      <div className="cache-management">
        <h4>🛠️ Cache Management</h4>
        
        <div className="management-section">
          <h5>Invalidation</h5>
          <div className="action-buttons">
            <button onClick={() => {
              const tag = prompt('Enter tag to invalidate:');
              if (tag) invalidateCache('tag', tag);
            }}>
              🏷️ Invalidate Tag
            </button>
            <button onClick={() => {
              const key = prompt('Enter key to invalidate:');
              if (key) invalidateCache('key', key);
            }}>
              🔑 Invalidate Key
            </button>
            <button onClick={() => invalidateCache('tag', 'products')}>
              🛍️ Clear Products
            </button>
            <button onClick={() => invalidateCache('tag', 'pages')}>
              📄 Clear Pages
            </button>
          </div>
        </div>

        <div className="management-section">
          <h5>Warmup</h5>
          <div className="action-buttons">
            <button onClick={() => warmupCache('products')}>
              🛍️ Warmup Products
            </button>
            <button onClick={() => warmupCache('pages')}>
              📄 Warmup Pages
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cache-monitor {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
        }

        .cache-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .cache-header h3 {
          margin: 0;
          color: #1f2937;
        }

        .cache-actions {
          display: flex;
          gap: 8px;
        }

        .cache-actions button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
        }

        .cache-actions button:hover {
          background: #f9fafb;
        }

        .cache-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .last-updated {
          color: #6b7280;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .cache-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-icon {
          font-size: 20px;
        }

        .stat-label {
          font-weight: 600;
          color: #374151;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .stat-subtext {
          font-size: 14px;
          color: #6b7280;
        }

        .operations-breakdown {
          font-size: 14px;
          color: #374151;
        }

        .operations-breakdown div {
          margin-bottom: 4px;
        }

        .cache-management {
          border-top: 1px solid #e5e7eb;
          padding-top: 24px;
        }

        .cache-management h4 {
          margin: 0 0 20px 0;
          color: #1f2937;
        }

        .management-section {
          margin-bottom: 24px;
        }

        .management-section h5 {
          margin: 0 0 12px 0;
          color: #374151;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .action-buttons button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .action-buttons button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .loading, .error {
          text-align: center;
          padding: 40px;
        }

        .loader {
          font-size: 16px;
          color: #6b7280;
        }

        .error h3 {
          color: #dc2626;
          margin-bottom: 12px;
        }

        .error button {
          padding: 8px 16px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .cache-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-buttons button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
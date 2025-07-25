import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './RecentActivity.module.css';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'system' | 'ai' | 'analytics';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  color: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function RecentActivity({ 
  limit = 10, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadActivities();
    
    if (autoRefresh) {
      const interval = setInterval(loadActivities, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'order',
          title: 'Nouvelle commande #2847',
          description: 'Marie Dupont a passé une commande de 245€',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          icon: '🛒',
          color: '#10b981',
          actionUrl: '/admin/orders/2847',
          priority: 'high',
          metadata: { amount: 245, customer: 'Marie Dupont' }
        },
        {
          id: '2',
          type: 'ai',
          title: 'Modèle IA mis à jour',
          description: 'PersonalizationEngine v2.1.0 déployé avec succès',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          icon: '🤖',
          color: '#8b5cf6',
          actionUrl: '/admin/ai/models',
          priority: 'medium'
        },
        {
          id: '3',
          type: 'user',
          title: 'Nouveau client VIP',
          description: 'Jean Martin a atteint le statut VIP',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          icon: '👑',
          color: '#f59e0b',
          actionUrl: '/admin/customers/jean-martin',
          priority: 'medium'
        },
        {
          id: '4',
          type: 'product',
          title: 'Stock faible détecté',
          description: 'Robe Aube Dorée - 3 unités restantes',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          icon: '⚠️',
          color: '#ef4444',
          actionUrl: '/admin/products/aube-doree',
          priority: 'high'
        },
        {
          id: '5',
          type: 'analytics',
          title: 'Pic de trafic détecté',
          description: '+150% visiteurs par rapport à hier',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          icon: '📈',
          color: '#3b82f6',
          actionUrl: '/admin/analytics/traffic',
          priority: 'medium'
        },
        {
          id: '6',
          type: 'system',
          title: 'Sauvegarde automatique',
          description: 'Sauvegarde de 2.3GB terminée avec succès',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          icon: '💾',
          color: '#06b6d4',
          priority: 'low'
        },
        {
          id: '7',
          type: 'order',
          title: 'Commande annulée #2845',
          description: 'Pierre Durand a annulé sa commande de 89€',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          icon: '❌',
          color: '#6b7280',
          actionUrl: '/admin/orders/2845',
          priority: 'low'
        },
        {
          id: '8',
          type: 'ai',
          title: 'Nouvelles recommandations générées',
          description: '1,247 recommandations personnalisées créées',
          timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
          icon: '✨',
          color: '#8b5cf6',
          actionUrl: '/admin/ai/recommendations',
          priority: 'low'
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, limit);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return styles.highPriority;
      case 'medium': return styles.mediumPriority;
      case 'low': return styles.lowPriority;
      default: return '';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Tout', icon: '🔍' },
    { value: 'order', label: 'Commandes', icon: '🛒' },
    { value: 'user', label: 'Utilisateurs', icon: '👥' },
    { value: 'product', label: 'Produits', icon: '🛍️' },
    { value: 'ai', label: 'IA', icon: '🤖' },
    { value: 'system', label: 'Système', icon: '⚙️' }
  ];

  return (
    <motion.div
      className={styles.recentActivity}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>📋 Activité Récente</h3>
          <p className={styles.subtitle}>
            {loading ? 'Chargement...' : `${filteredActivities.length} événements`}
          </p>
        </div>

        <div className={styles.headerActions}>
          {/* Refresh Button */}
          <button
            onClick={loadActivities}
            disabled={loading}
            className={`${styles.refreshButton} ${loading ? styles.spinning : ''}`}
          >
            🔄
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`${styles.filterButton} ${filter === option.value ? styles.active : ''}`}
          >
            <span className={styles.filterIcon}>{option.icon}</span>
            <span className={styles.filterLabel}>{option.label}</span>
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className={styles.activityList}>
        {loading ? (
          // Loading Skeleton
          <div className={styles.loadingContainer}>
            {[...Array(5)].map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonLine} style={{ width: '70%' }} />
                  <div className={styles.skeletonLine} style={{ width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayedActivities.length === 0 ? (
          // Empty State
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📭</span>
            <h4>Aucune activité</h4>
            <p>Aucune activité récente pour ce filtre</p>
          </div>
        ) : (
          // Activity Items
          <AnimatePresence>
            {displayedActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className={`${styles.activityItem} ${getPriorityClass(activity.priority)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: 'easeOut'
                }}
                whileHover={{ scale: 1.02, y: -1 }}
              >
                {/* Icon */}
                <div 
                  className={styles.activityIcon}
                  style={{ backgroundColor: activity.color }}
                >
                  <span>{activity.icon}</span>
                </div>

                {/* Content */}
                <div className={styles.activityContent}>
                  <div className={styles.activityHeader}>
                    <h4 className={styles.activityTitle}>{activity.title}</h4>
                    <span className={styles.activityTime}>
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className={styles.activityDescription}>
                    {activity.description}
                  </p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className={styles.activityMetadata}>
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <span key={key} className={styles.metadataItem}>
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {activity.actionUrl && (
                  <Link href={activity.actionUrl} className={styles.actionButton}>
                    →
                  </Link>
                )}

                {/* Priority Indicator */}
                <div className={`${styles.priorityIndicator} ${getPriorityClass(activity.priority)}`} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Show More/Less Button */}
      {!loading && filteredActivities.length > limit && (
        <motion.button
          onClick={() => setShowAll(!showAll)}
          className={styles.showMoreButton}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showAll ? '← Voir moins' : `Voir ${filteredActivities.length - limit} de plus →`}
        </motion.button>
      )}

      <style jsx>{`
        .${styles.recentActivity} {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          height: fit-content;
        }

        .${styles.header} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .${styles.titleSection} {
          flex: 1;
        }

        .${styles.title} {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .${styles.subtitle} {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .${styles.headerActions} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.refreshButton} {
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .${styles.refreshButton}:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .${styles.refreshButton}:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .${styles.refreshButton}.${styles.spinning} {
          animation: spin 1s linear infinite;
        }

        .${styles.filters} {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .${styles.filterButton} {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          color: #6b7280;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .${styles.filterButton}:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .${styles.filterButton}.${styles.active} {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .${styles.filterIcon} {
          font-size: 14px;
        }

        .${styles.filterLabel} {
          font-weight: 500;
        }

        .${styles.activityList} {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 500px;
          overflow-y: auto;
        }

        .${styles.activityList}::-webkit-scrollbar {
          width: 4px;
        }

        .${styles.activityList}::-webkit-scrollbar-track {
          background: transparent;
        }

        .${styles.activityList}::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }

        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .${styles.skeletonItem} {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
        }

        .${styles.skeletonIcon} {
          width: 32px;
          height: 32px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 50%;
          animation: loading 1.5s infinite;
        }

        .${styles.skeletonContent} {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .${styles.skeletonLine} {
          height: 12px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .${styles.emptyState} {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .${styles.emptyIcon} {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }

        .${styles.emptyState} h4 {
          margin: 0 0 8px 0;
          color: #374151;
        }

        .${styles.emptyState} p {
          margin: 0;
          font-size: 14px;
        }

        .${styles.activityItem} {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #f3f4f6;
          background: #fafbfc;
          position: relative;
          transition: all 0.2s;
          cursor: pointer;
        }

        .${styles.activityItem}:hover {
          background: #f9fafb;
          border-color: #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .${styles.activityItem}.${styles.highPriority} {
          border-left: 4px solid #ef4444;
        }

        .${styles.activityItem}.${styles.mediumPriority} {
          border-left: 4px solid #f59e0b;
        }

        .${styles.activityItem}.${styles.lowPriority} {
          border-left: 4px solid #10b981;
        }

        .${styles.activityIcon} {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .${styles.activityContent} {
          flex: 1;
          min-width: 0;
        }

        .${styles.activityHeader} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .${styles.activityTitle} {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          line-height: 1.3;
        }

        .${styles.activityTime} {
          font-size: 12px;
          color: #9ca3af;
          white-space: nowrap;
          flex-shrink: 0;
          margin-left: 8px;
        }

        .${styles.activityDescription} {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .${styles.activityMetadata} {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .${styles.metadataItem} {
          background: #f3f4f6;
          color: #6b7280;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .${styles.actionButton} {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border-radius: 4px;
          color: #6b7280;
          text-decoration: none;
          font-size: 12px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .${styles.actionButton}:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .${styles.priorityIndicator} {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .${styles.priorityIndicator}.${styles.highPriority} {
          background: #ef4444;
        }

        .${styles.priorityIndicator}.${styles.mediumPriority} {
          background: #f59e0b;
        }

        .${styles.priorityIndicator}.${styles.lowPriority} {
          background: #10b981;
        }

        .${styles.showMoreButton} {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          margin-top: 16px;
          transition: all 0.2s;
        }

        .${styles.showMoreButton}:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .${styles.filters} {
            gap: 6px;
          }

          .${styles.filterButton} {
            padding: 4px 8px;
            font-size: 11px;
          }

          .${styles.activityItem} {
            padding: 10px;
            gap: 10px;
          }

          .${styles.activityIcon} {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .${styles.activityTitle} {
            font-size: 13px;
          }

          .${styles.activityDescription} {
            font-size: 12px;
          }
        }
      `}</style>
    </motion.div>
  );
}
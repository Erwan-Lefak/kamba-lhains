import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from './QuickActions.module.css';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  disabled?: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-product',
    title: 'Ajouter Produit',
    description: 'Créer un nouveau produit',
    icon: '➕',
    color: '#10b981',
    href: '/admin/products/add'
  },
  {
    id: 'view-orders',
    title: 'Commandes',
    description: 'Gérer les commandes',
    icon: '📦',
    color: '#3b82f6',
    href: '/admin/orders',
    badge: '12'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Voir les statistiques',
    icon: '📊',
    color: '#8b5cf6',
    href: '/admin/analytics'
  },
  {
    id: 'customers',
    title: 'Clients',
    description: 'Gérer les clients',
    icon: '👥',
    color: '#f59e0b',
    href: '/admin/customers'
  },
  {
    id: 'backup',
    title: 'Sauvegarde',
    description: 'Créer une sauvegarde',
    icon: '💾',
    color: '#06b6d4',
    onClick: () => console.log('Backup initiated')
  },
  {
    id: 'settings',
    title: 'Paramètres',
    description: 'Configuration du site',
    icon: '⚙️',
    color: '#6b7280',
    href: '/admin/settings'
  }
];

export default function QuickActions() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleActionClick = async (action: QuickAction) => {
    if (action.disabled) return;

    if (action.onClick) {
      setActionLoading(action.id);
      try {
        await action.onClick();
      } catch (error) {
        console.error('Action failed:', error);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const visibleActions = isExpanded ? quickActions : quickActions.slice(0, 4);

  return (
    <motion.div
      className={styles.quickActions}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>⚡ Actions Rapides</h3>
          <p className={styles.subtitle}>Raccourcis pour les tâches courantes</p>
        </div>
        
        {quickActions.length > 4 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? 'Réduire' : 'Voir plus'}
            <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
              ▼
            </span>
          </button>
        )}
      </div>

      {/* Actions Grid */}
      <div className={styles.actionsGrid}>
        <AnimatePresence>
          {visibleActions.map((action, index) => (
            <motion.div
              key={action.id}
              className={`${styles.actionCard} ${action.disabled ? styles.disabled : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              whileHover={!action.disabled ? { 
                scale: 1.05, 
                y: -2,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              } : {}}
              whileTap={!action.disabled ? { scale: 0.95 } : {}}
            >
              {action.href ? (
                <Link href={action.href} className={styles.actionLink}>
                  <ActionContent 
                    action={action} 
                    loading={actionLoading === action.id} 
                  />
                </Link>
              ) : (
                <button
                  onClick={() => handleActionClick(action)}
                  className={styles.actionButton}
                  disabled={action.disabled || actionLoading === action.id}
                >
                  <ActionContent 
                    action={action} 
                    loading={actionLoading === action.id} 
                  />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <motion.div
        className={styles.quickStats}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🚀</span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>98.5%</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
        </div>
        
        <div className={styles.statDivider} />
        
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⚡</span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>1.2s</span>
            <span className={styles.statLabel}>Load Time</span>
          </div>
        </div>
        
        <div className={styles.statDivider} />
        
        <div className={styles.statItem}>
          <span className={styles.statIcon}>💾</span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>234MB</span>
            <span className={styles.statLabel}>Cache Size</span>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .${styles.quickActions} {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
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

        .${styles.expandButton} {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.expandButton}:hover {
          background: #f9fafb;
          border-color: #9ca3af;
          color: #374151;
        }

        .${styles.expandIcon} {
          font-size: 10px;
          transition: transform 0.2s;
        }

        .${styles.expandIcon}.${styles.expanded} {
          transform: rotate(180deg);
        }

        .${styles.actionsGrid} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .${styles.actionCard} {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .${styles.actionCard}.${styles.disabled} {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .${styles.actionLink}, .${styles.actionButton} {
          display: block;
          width: 100%;
          padding: 16px 12px;
          text-decoration: none;
          background: transparent;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .${styles.actionLink}:hover, .${styles.actionButton}:hover:not(:disabled) {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .${styles.actionButton}:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .${styles.quickStats} {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .${styles.statItem} {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .${styles.statIcon} {
          font-size: 16px;
        }

        .${styles.statContent} {
          display: flex;
          flex-direction: column;
        }

        .${styles.statValue} {
          font-size: 14px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .${styles.statLabel} {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .${styles.statDivider} {
          width: 1px;
          height: 32px;
          background: #e5e7eb;
          margin: 0 12px;
        }

        @media (max-width: 768px) {
          .${styles.actionsGrid} {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .${styles.quickStats} {
            flex-direction: column;
            gap: 12px;
          }
          
          .${styles.statDivider} {
            width: 100%;
            height: 1px;
            margin: 0;
          }
        }

        @media (max-width: 480px) {
          .${styles.actionsGrid} {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}

interface ActionContentProps {
  action: QuickAction;
  loading: boolean;
}

function ActionContent({ action, loading }: ActionContentProps) {
  return (
    <div className={styles.actionContent}>
      {/* Icon with Badge */}
      <div className={styles.iconSection}>
        <div 
          className={`${styles.iconContainer} ${loading ? styles.loading : ''}`}
          style={{ backgroundColor: action.color }}
        >
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <span className={styles.actionIcon}>{action.icon}</span>
          )}
        </div>
        
        {action.badge && (
          <span className={styles.actionBadge} style={{ backgroundColor: action.color }}>
            {action.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={styles.contentSection}>
        <h4 className={styles.actionTitle}>{action.title}</h4>
        <p className={styles.actionDescription}>{action.description}</p>
      </div>

      <style jsx>{`
        .${styles.actionContent} {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          height: 100%;
        }

        .${styles.iconSection} {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .${styles.iconContainer} {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .${styles.iconContainer}.${styles.loading} {
          animation: pulse 1.5s infinite;
        }

        .${styles.actionIcon} {
          font-size: 18px;
          color: white;
        }

        .${styles.spinner} {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .${styles.actionBadge} {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
          border: 2px solid white;
        }

        .${styles.contentSection} {
          flex: 1;
          text-align: center;
        }

        .${styles.actionTitle} {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .${styles.actionDescription} {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          line-height: 1.3;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
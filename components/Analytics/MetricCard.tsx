import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MetricCard.module.css';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  unit: string;
  format: 'currency' | 'percentage' | 'number' | 'duration';
  category: 'revenue' | 'customer' | 'product' | 'conversion' | 'retention';
  description: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  threshold?: {
    warning: number;
    critical: number;
  };
  timestamp: string;
}

interface MetricCardProps {
  metric: BusinessMetric;
  index: number;
  size?: 'small' | 'medium' | 'large';
  showTrend?: boolean;
  showTarget?: boolean;
  onClick?: (metric: BusinessMetric) => void;
}

export default function MetricCard({
  metric,
  index,
  size = 'medium',
  showTrend = true,
  showTarget = true,
  onClick
}: MetricCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);

  const formatValue = (value: number, format: string, unit: string): string => {
    switch (format) {
      case 'currency':
        return `${value.toLocaleString('fr-FR')}${unit}`;
      case 'percentage':
        return `${value.toFixed(1)}${unit}`;
      case 'number':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'duration':
        if (unit === 'jours') {
          return `${Math.round(value)} ${unit}`;
        }
        return `${value.toFixed(1)}${unit}`;
      default:
        return `${value}${unit}`;
    }
  };

  const getStatusColor = (): string => {
    if (!metric.threshold) return '#10b981';
    
    if (metric.value >= metric.threshold.critical) return '#ef4444';
    if (metric.value >= metric.threshold.warning) return '#f59e0b';
    return '#10b981';
  };

  const getStatusIcon = (): string => {
    if (!metric.threshold) return '✅';
    
    if (metric.value >= metric.threshold.critical) return '🚨';
    if (metric.value >= metric.threshold.warning) return '⚠️';
    return '✅';
  };

  const getTrendIcon = (): string => {
    switch (metric.trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➖';
      default: return '📊';
    }
  };

  const getTrendColor = (): string => {
    // Pour certaines métriques, une tendance "down" peut être positive
    const isPositiveDown = ['churn_rate', 'cac', 'days_between_orders'].includes(metric.id);
    
    switch (metric.trend) {
      case 'up': return isPositiveDown ? '#ef4444' : '#10b981';
      case 'down': return isPositiveDown ? '#10b981' : '#ef4444';
      case 'stable': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getProgressPercentage = (): number => {
    if (!metric.target) return 0;
    return Math.min((metric.value / metric.target) * 100, 100);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(metric);
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <motion.div
      className={`${styles.metricCard} ${styles[size]} ${onClick ? styles.clickable : ''}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Status Indicator */}
      <div 
        className={styles.statusIndicator}
        style={{ backgroundColor: getStatusColor() }}
      />

      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.metricInfo}>
          <h4 className={styles.metricName}>{metric.name}</h4>
          <p className={styles.metricDescription}>{metric.description}</p>
        </div>
        
        <div className={styles.metricStatus}>
          <span className={styles.statusIcon}>{getStatusIcon()}</span>
          {showTrend && (
            <span 
              className={styles.trendIcon}
              style={{ color: getTrendColor() }}
            >
              {getTrendIcon()}
            </span>
          )}
        </div>
      </div>

      {/* Value Section */}
      <div className={styles.valueSection}>
        <motion.div
          className={styles.mainValue}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        >
          <span className={styles.value}>
            {formatValue(metric.value, metric.format, metric.unit)}
          </span>
        </motion.div>

        {/* Change Indicator */}
        {metric.changePercent !== undefined && (
          <motion.div
            className={styles.changeIndicator}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          >
            <div 
              className={styles.changeValue}
              style={{ color: getTrendColor() }}
            >
              <span className={styles.changeIcon}>
                {metric.changePercent > 0 ? '↗' : metric.changePercent < 0 ? '↘' : '→'}
              </span>
              <span className={styles.changeText}>
                {Math.abs(metric.changePercent).toFixed(1)}%
              </span>
            </div>
            <span className={styles.changeLabel}>vs période précédente</span>
          </motion.div>
        )}
      </div>

      {/* Target Progress */}
      {showTarget && metric.target && (
        <div className={styles.targetSection}>
          <div className={styles.targetHeader}>
            <span className={styles.targetLabel}>Objectif</span>
            <span className={styles.targetValue}>
              {formatValue(metric.target, metric.format, metric.unit)}
            </span>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              style={{ backgroundColor: getStatusColor() }}
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ 
                delay: index * 0.1 + 0.4, 
                duration: 0.8,
                ease: 'easeOut'
              }}
            />
          </div>
          <span className={styles.progressText}>
            {getProgressPercentage().toFixed(0)}% de l'objectif
          </span>
        </div>
      )}

      {/* Threshold Indicators */}
      {metric.threshold && (
        <div className={styles.thresholdSection}>
          <div className={styles.thresholdItem}>
            <div className={styles.thresholdDot} style={{ backgroundColor: '#f59e0b' }} />
            <span className={styles.thresholdText}>
              Seuil d'alerte: {formatValue(metric.threshold.warning, metric.format, metric.unit)}
            </span>
          </div>
          <div className={styles.thresholdItem}>
            <div className={styles.thresholdDot} style={{ backgroundColor: '#ef4444' }} />
            <span className={styles.thresholdText}>
              Seuil critique: {formatValue(metric.threshold.critical, metric.format, metric.unit)}
            </span>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.expandedDetails}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.detailsContent}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Catégorie:</span>
                <span className={styles.detailValue}>{metric.category}</span>
              </div>
              
              {metric.previousValue && (
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Valeur précédente:</span>
                  <span className={styles.detailValue}>
                    {formatValue(metric.previousValue, metric.format, metric.unit)}
                  </span>
                </div>
              )}
              
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Dernière mise à jour:</span>
                <span className={styles.detailValue}>
                  {new Date(metric.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Overlay */}
      <AnimatePresence>
        {hovering && (
          <motion.div
            className={styles.hoverOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .${styles.metricCard} {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: ${onClick || !expanded ? 'pointer' : 'default'};
        }

        .${styles.metricCard}.${styles.small} {
          padding: 16px;
        }

        .${styles.metricCard}.${styles.large} {
          padding: 24px;
        }

        .${styles.metricCard}:hover {
          border-color: #d1d5db;
        }

        .${styles.metricCard}.${styles.clickable}:hover {
          border-color: #3b82f6;
        }

        .${styles.statusIndicator} {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 12px 12px 0 0;
        }

        .${styles.cardHeader} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .${styles.metricInfo} {
          flex: 1;
          min-width: 0;
        }

        .${styles.metricName} {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .${styles.metricDescription} {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .${styles.metricStatus} {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .${styles.statusIcon}, .${styles.trendIcon} {
          font-size: 16px;
        }

        .${styles.valueSection} {
          margin-bottom: 16px;
        }

        .${styles.mainValue} {
          margin-bottom: 8px;
        }

        .${styles.value} {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .${styles.small} .${styles.value} {
          font-size: 24px;
        }

        .${styles.large} .${styles.value} {
          font-size: 36px;
        }

        .${styles.changeIndicator} {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .${styles.changeValue} {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          font-size: 14px;
        }

        .${styles.changeIcon} {
          font-size: 12px;
        }

        .${styles.changeLabel} {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .${styles.targetSection} {
          margin-bottom: 16px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .${styles.targetHeader} {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .${styles.targetLabel} {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          text-transform: uppercase;
        }

        .${styles.targetValue} {
          font-size: 14px;
          color: #374151;
          font-weight: 600;
        }

        .${styles.progressBar} {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .${styles.progressFill} {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        .${styles.progressText} {
          font-size: 11px;
          color: #6b7280;
          text-align: center;
          display: block;
        }

        .${styles.thresholdSection} {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .${styles.thresholdItem} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.thresholdDot} {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .${styles.thresholdText} {
          font-size: 11px;
          color: #6b7280;
        }

        .${styles.expandedDetails} {
          border-top: 1px solid #f3f4f6;
          margin-top: 16px;
          overflow: hidden;
        }

        .${styles.detailsContent} {
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .${styles.detailRow} {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .${styles.detailLabel} {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .${styles.detailValue} {
          font-size: 12px;
          color: #374151;
          font-weight: 600;
        }

        .${styles.hoverOverlay} {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
          pointer-events: none;
          border-radius: 12px;
        }

        @media (max-width: 640px) {
          .${styles.metricCard} {
            padding: 16px;
          }

          .${styles.value} {
            font-size: 24px;
          }

          .${styles.cardHeader} {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .${styles.metricStatus} {
            align-self: flex-end;
          }
        }
      `}</style>
    </motion.div>
  );
}
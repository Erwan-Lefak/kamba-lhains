import React from 'react';
import { motion } from 'framer-motion';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  icon: string;
  color: string;
  loading?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  icon,
  color,
  loading = false,
  trend,
  onClick
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➖';
  };

  const getTrendColor = () => {
    if (change === undefined) return '#6b7280';
    
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#6b7280';
  };

  const formatChange = (value: number) => {
    const abs = Math.abs(value);
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${abs.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className={styles.statsCard}>
        <div className={styles.loadingContainer}>
          <div className={styles.skeleton} style={{ width: '60%', height: '20px' }} />
          <div className={styles.skeleton} style={{ width: '80%', height: '32px', marginTop: '8px' }} />
          <div className={styles.skeleton} style={{ width: '40%', height: '16px', marginTop: '8px' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${styles.statsCard} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>
        
        <div className={styles.iconContainer} style={{ backgroundColor: color }}>
          <span className={styles.icon}>{icon}</span>
        </div>
      </div>

      {/* Main Value */}
      <div className={styles.valueSection}>
        <motion.span
          className={styles.value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {value}
        </motion.span>
        
        {change !== undefined && (
          <motion.div
            className={styles.changeIndicator}
            style={{ color: getTrendColor() }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <span className={styles.trendIcon}>{getTrendIcon()}</span>
            <span className={styles.changeValue}>{formatChange(change)}</span>
          </motion.div>
        )}
      </div>

      {/* Progress Bar (optional) */}
      {trend && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(change || 0) * 2, 100)}%` }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {/* Hover Effect */}
      <motion.div
        className={styles.hoverOverlay}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      <style jsx>{`
        .${styles.statsCard} {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .${styles.statsCard}.${styles.clickable} {
          cursor: pointer;
        }

        .${styles.statsCard}.${styles.clickable}:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border-color: #d1d5db;
        }

        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
        }

        .${styles.skeleton} {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .${styles.cardHeader} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .${styles.titleSection} {
          flex: 1;
        }

        .${styles.title} {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin: 0 0 4px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .${styles.subtitle} {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .${styles.iconContainer} {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .${styles.icon} {
          font-size: 20px;
          filter: brightness(0) invert(1);
        }

        .${styles.valueSection} {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }

        .${styles.value} {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
        }

        .${styles.changeIndicator} {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
        }

        .${styles.trendIcon} {
          font-size: 12px;
        }

        .${styles.changeValue} {
          font-size: 13px;
        }

        .${styles.progressSection} {
          margin-top: 16px;
        }

        .${styles.progressBar} {
          width: 100%;
          height: 4px;
          background: #f3f4f6;
          border-radius: 2px;
          overflow: hidden;
        }

        .${styles.progressFill} {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        .${styles.hoverOverlay} {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .${styles.statsCard} {
            padding: 20px;
          }

          .${styles.value} {
            font-size: 24px;
          }

          .${styles.iconContainer} {
            width: 40px;
            height: 40px;
          }

          .${styles.icon} {
            font-size: 18px;
          }
        }
      `}</style>
    </motion.div>
  );
}
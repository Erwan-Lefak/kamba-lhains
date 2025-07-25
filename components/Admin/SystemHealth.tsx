import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SystemHealth.module.css';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  icon: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

interface SystemService {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  lastCheck: string;
  responseTime?: number;
  errorRate?: number;
  icon: string;
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [services, setServices] = useState<SystemService[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadSystemHealth();
    
    if (autoRefresh) {
      const interval = setInterval(loadSystemHealth, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadSystemHealth = async () => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockMetrics: HealthMetric[] = [
        {
          id: 'cpu',
          name: 'CPU',
          value: 45.2,
          unit: '%',
          status: 'healthy',
          threshold: { warning: 70, critical: 90 },
          icon: '🔥',
          description: 'Utilisation du processeur',
          trend: 'stable'
        },
        {
          id: 'memory',
          name: 'Mémoire',
          value: 68.5,
          unit: '%',
          status: 'warning',
          threshold: { warning: 80, critical: 95 },
          icon: '🧠',
          description: 'Utilisation de la RAM',
          trend: 'up'
        },
        {
          id: 'disk',
          name: 'Disque',
          value: 32.1,
          unit: '%',
          status: 'healthy',
          threshold: { warning: 80, critical: 95 },
          icon: '💾',
          description: 'Espace disque utilisé',
          trend: 'up'
        },
        {
          id: 'network',
          name: 'Réseau',
          value: 156.7,
          unit: 'Mbps',
          status: 'healthy',
          threshold: { warning: 800, critical: 950 },
          icon: '🌐',
          description: 'Bande passante utilisée',
          trend: 'stable'
        },
        {
          id: 'response_time',
          name: 'Temps de réponse',
          value: 89,
          unit: 'ms',
          status: 'healthy',
          threshold: { warning: 500, critical: 1000 },
          icon: '⚡',
          description: 'Temps de réponse moyen',
          trend: 'down'
        },
        {
          id: 'error_rate',
          name: 'Taux d\'erreur',
          value: 0.12,
          unit: '%',
          status: 'healthy',
          threshold: { warning: 1, critical: 5 },
          icon: '🚨',
          description: 'Pourcentage d\'erreurs',
          trend: 'stable'
        }
      ];

      const mockServices: SystemService[] = [
        {
          id: 'web',
          name: 'Serveur Web',
          status: 'online',
          uptime: 99.98,
          lastCheck: new Date().toISOString(),
          responseTime: 45,
          errorRate: 0.01,
          icon: '🌐'
        },
        {
          id: 'database',
          name: 'Base de données',
          status: 'online',
          uptime: 99.95,
          lastCheck: new Date().toISOString(),
          responseTime: 12,
          errorRate: 0.02,
          icon: '🗄️'
        },
        {
          id: 'redis',
          name: 'Cache Redis',
          status: 'online',
          uptime: 99.99,
          lastCheck: new Date().toISOString(),
          responseTime: 3,
          errorRate: 0.00,
          icon: '⚡'
        },
        {
          id: 'ai',
          name: 'Services IA',
          status: 'online',
          uptime: 99.92,
          lastCheck: new Date().toISOString(),
          responseTime: 234,
          errorRate: 0.05,
          icon: '🤖'
        },
        {
          id: 'cdn',
          name: 'CDN',
          status: 'degraded',
          uptime: 98.87,
          lastCheck: new Date().toISOString(),
          responseTime: 156,
          errorRate: 0.34,
          icon: '☁️'
        },
        {
          id: 'monitoring',
          name: 'Monitoring',
          status: 'online',
          uptime: 100.00,
          lastCheck: new Date().toISOString(),
          responseTime: 8,
          errorRate: 0.00,
          icon: '📊'
        }
      ];

      setMetrics(mockMetrics);
      setServices(mockServices);
    } catch (error) {
      console.error('Failed to load system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return '#10b981';
      case 'warning':
      case 'degraded':
        return '#f59e0b';
      case 'critical':
      case 'offline':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return '✅';
      case 'warning':
      case 'degraded':
        return '⚠️';
      case 'critical':
      case 'offline':
        return '❌';
      default:
        return '❓';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➖';
      default: return '';
    }
  };

  const getOverallHealth = () => {
    const criticalCount = metrics.filter(m => m.status === 'critical').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const offlineServices = services.filter(s => s.status === 'offline').length;
    
    if (criticalCount > 0 || offlineServices > 0) return 'critical';
    if (warningCount > 0) return 'warning';
    return 'healthy';
  };

  const overallHealth = getOverallHealth();

  if (loading) {
    return (
      <div className={styles.systemHealth}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Vérification de l'état du système...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.systemHealth}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>
            <span className={styles.titleIcon}>🏥</span>
            État du Système
          </h3>
          <div className={styles.overallStatus}>
            <span 
              className={styles.statusIndicator}
              style={{ backgroundColor: getStatusColor(overallHealth) }}
            />
            <span className={styles.statusText}>
              {overallHealth === 'healthy' && 'Système en bonne santé'}
              {overallHealth === 'warning' && 'Attention requise'}
              {overallHealth === 'critical' && 'Problème critique'}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`${styles.autoRefreshButton} ${autoRefresh ? styles.active : ''}`}
          >
            🔄
          </button>
          <button
            onClick={loadSystemHealth}
            className={styles.refreshButton}
          >
            ↻
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className={styles.metricsSection}>
        <h4 className={styles.sectionTitle}>Métriques Système</h4>
        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              className={`${styles.metricCard} ${styles[metric.status]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setExpandedMetric(
                expandedMetric === metric.id ? null : metric.id
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={styles.metricHeader}>
                <div className={styles.metricInfo}>
                  <span className={styles.metricIcon}>{metric.icon}</span>
                  <span className={styles.metricName}>{metric.name}</span>
                </div>
                <div className={styles.metricIndicators}>
                  {metric.trend && (
                    <span className={styles.trendIcon}>
                      {getTrendIcon(metric.trend)}
                    </span>
                  )}
                  <span className={styles.statusIcon}>
                    {getStatusIcon(metric.status)}
                  </span>
                </div>
              </div>

              <div className={styles.metricValue}>
                <span className={styles.value}>{metric.value}</span>
                <span className={styles.unit}>{metric.unit}</span>
              </div>

              <div className={styles.metricProgress}>
                <div className={styles.progressBar}>
                  <motion.div
                    className={styles.progressFill}
                    style={{ backgroundColor: getStatusColor(metric.status) }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min((metric.value / (metric.threshold.critical * 1.2)) * 100, 100)}%` 
                    }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <div className={styles.thresholds}>
                  <span 
                    className={styles.threshold}
                    style={{ 
                      left: `${(metric.threshold.warning / (metric.threshold.critical * 1.2)) * 100}%` 
                    }}
                  />
                  <span 
                    className={styles.threshold}
                    style={{ 
                      left: `${(metric.threshold.critical / (metric.threshold.critical * 1.2)) * 100}%` 
                    }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {expandedMetric === metric.id && (
                  <motion.div
                    className={styles.metricDetails}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className={styles.metricDescription}>
                      {metric.description}
                    </p>
                    <div className={styles.thresholdInfo}>
                      <div className={styles.thresholdItem}>
                        <span className={styles.thresholdLabel}>Seuil d'alerte:</span>
                        <span className={styles.thresholdValue}>
                          {metric.threshold.warning}{metric.unit}
                        </span>
                      </div>
                      <div className={styles.thresholdItem}>
                        <span className={styles.thresholdLabel}>Seuil critique:</span>
                        <span className={styles.thresholdValue}>
                          {metric.threshold.critical}{metric.unit}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services Status */}
      <div className={styles.servicesSection}>
        <h4 className={styles.sectionTitle}>Services</h4>
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={`${styles.serviceItem} ${styles[service.status]}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className={styles.serviceHeader}>
                <div className={styles.serviceInfo}>
                  <span className={styles.serviceIcon}>{service.icon}</span>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceName}>{service.name}</span>
                    <span className={styles.serviceUptime}>
                      Uptime: {service.uptime.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className={styles.serviceMetrics}>
                  {service.responseTime && (
                    <span className={styles.serviceMetric}>
                      {service.responseTime}ms
                    </span>
                  )}
                  <span 
                    className={styles.serviceStatus}
                    style={{ color: getStatusColor(service.status) }}
                  >
                    {getStatusIcon(service.status)} {service.status}
                  </span>
                </div>
              </div>
              
              {service.errorRate !== undefined && (
                <div className={styles.serviceProgress}>
                  <div className={styles.errorRate}>
                    <span className={styles.errorLabel}>Erreurs: </span>
                    <span className={styles.errorValue}>
                      {service.errorRate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .${styles.systemHealth} {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #6b7280;
        }

        .${styles.spinner} {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .${styles.header} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .${styles.titleSection} {
          flex: 1;
        }

        .${styles.title} {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .${styles.titleIcon} {
          font-size: 20px;
        }

        .${styles.overallStatus} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.statusIndicator} {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .${styles.statusText} {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .${styles.headerActions} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.autoRefreshButton}, .${styles.refreshButton} {
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .${styles.autoRefreshButton}:hover, .${styles.refreshButton}:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .${styles.autoRefreshButton}.${styles.active} {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        .${styles.sectionTitle} {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .${styles.metricsSection} {
          margin-bottom: 24px;
        }

        .${styles.metricsGrid} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .${styles.metricCard} {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.metricCard}:hover {
          background: #f3f4f6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .${styles.metricCard}.${styles.healthy} {
          border-left: 4px solid #10b981;
        }

        .${styles.metricCard}.${styles.warning} {
          border-left: 4px solid #f59e0b;
        }

        .${styles.metricCard}.${styles.critical} {
          border-left: 4px solid #ef4444;
        }

        .${styles.metricHeader} {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .${styles.metricInfo} {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .${styles.metricIcon} {
          font-size: 16px;
        }

        .${styles.metricName} {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .${styles.metricIndicators} {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .${styles.trendIcon}, .${styles.statusIcon} {
          font-size: 12px;
        }

        .${styles.metricValue} {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 12px;
        }

        .${styles.value} {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .${styles.unit} {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .${styles.metricProgress} {
          position: relative;
          margin-bottom: 8px;
        }

        .${styles.progressBar} {
          width: 100%;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
        }

        .${styles.progressFill} {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        .${styles.thresholds} {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
        }

        .${styles.threshold} {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.8);
        }

        .${styles.metricDetails} {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          overflow: hidden;
        }

        .${styles.metricDescription} {
          font-size: 12px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .${styles.thresholdInfo} {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .${styles.thresholdItem} {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        .${styles.thresholdLabel} {
          color: #9ca3af;
        }

        .${styles.thresholdValue} {
          color: #374151;
          font-weight: 500;
        }

        .${styles.servicesSection} {
        }

        .${styles.servicesList} {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .${styles.serviceItem} {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 16px;
          transition: all 0.2s;
        }

        .${styles.serviceItem}:hover {
          background: #f3f4f6;
        }

        .${styles.serviceItem}.${styles.online} {
          border-left: 4px solid #10b981;
        }

        .${styles.serviceItem}.${styles.degraded} {
          border-left: 4px solid #f59e0b;
        }

        .${styles.serviceItem}.${styles.offline} {
          border-left: 4px solid #ef4444;
        }

        .${styles.serviceHeader} {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .${styles.serviceInfo} {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .${styles.serviceIcon} {
          font-size: 18px;
        }

        .${styles.serviceDetails} {
          display: flex;
          flex-direction: column;
        }

        .${styles.serviceName} {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        .${styles.serviceUptime} {
          font-size: 12px;
          color: #6b7280;
        }

        .${styles.serviceMetrics} {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .${styles.serviceMetric} {
          font-size: 12px;
          color: #6b7280;
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .${styles.serviceStatus} {
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          text-transform: capitalize;
        }

        .${styles.serviceProgress} {
          margin-top: 8px;
        }

        .${styles.errorRate} {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .${styles.errorLabel} {
          font-size: 11px;
          color: #9ca3af;
        }

        .${styles.errorValue} {
          font-size: 11px;
          color: #374151;
          font-weight: 500;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .${styles.metricsGrid} {
            grid-template-columns: 1fr;
          }

          .${styles.header} {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .${styles.serviceHeader} {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .${styles.serviceMetrics} {
            justify-content: flex-start;
          }
        }
      `}</style>
    </motion.div>
  );
}
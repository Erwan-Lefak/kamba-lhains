import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { analyticsEngine } from '../../lib/analytics/behaviorTracker';
import styles from './AnalyticsDashboard.module.css';

interface AnalyticsDashboardProps {
  className?: string;
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

interface DashboardMetrics {
  totalUsers: number;
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: PageMetric[];
  funnelPerformance: FunnelMetric[];
  heatmapSummary: HeatmapSummary;
  abTestResults: ABTestSummary[];
}

interface PageMetric {
  page: string;
  views: number;
  averageTime: number;
  bounceRate: number;
}

interface FunnelMetric {
  step: string;
  users: number;
  conversionRate: number;
  dropoffRate: number;
}

interface HeatmapSummary {
  totalClicks: number;
  hotspots: Array<{ element: string; clicks: number }>;
  scrollDepth: number;
}

interface ABTestSummary {
  testName: string;
  variants: Array<{ name: string; conversionRate: number; users: number }>;
  winner?: string;
  confidence: number;
}

export default function AnalyticsDashboard({ 
  className, 
  timeRange: initialTimeRange = '24h' 
}: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'funnels' | 'heatmap' | 'abtests'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>(initialTimeRange);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simuler le chargement des métriques
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: DashboardMetrics = {
        totalUsers: 12543,
        conversionRate: 3.2,
        averageSessionDuration: 245000,
        bounceRate: 42.1,
        topPages: [
          { page: '/', views: 5234, averageTime: 120000, bounceRate: 35.2 },
          { page: '/nouvelle-collection', views: 3421, averageTime: 180000, bounceRate: 28.7 },
          { page: '/boutique', views: 2876, averageTime: 95000, bounceRate: 45.8 },
          { page: '/produit/1', views: 1987, averageTime: 203000, bounceRate: 22.1 }
        ],
        funnelPerformance: [
          { step: 'Visite', users: 1000, conversionRate: 100, dropoffRate: 0 },
          { step: 'Vue produit', users: 750, conversionRate: 75, dropoffRate: 25 },
          { step: 'Ajout panier', users: 300, conversionRate: 40, dropoffRate: 60 },
          { step: 'Checkout', users: 120, conversionRate: 40, dropoffRate: 60 },
          { step: 'Achat', users: 32, conversionRate: 26.7, dropoffRate: 73.3 }
        ],
        heatmapSummary: {
          totalClicks: 45672,
          hotspots: [
            { element: 'ProductCard', clicks: 8934 },
            { element: 'Navigation', clicks: 6721 },
            { element: 'CTA Button', clicks: 5432 },
            { element: 'Footer', clicks: 2876 }
          ],
          scrollDepth: 67.3
        },
        abTestResults: [
          {
            testName: 'Homepage Hero',
            variants: [
              { name: 'Control', conversionRate: 2.8, users: 5000 },
              { name: 'Video Background', conversionRate: 3.4, users: 5000 }
            ],
            winner: 'Video Background',
            confidence: 95.2
          },
          {
            testName: 'Product Card Layout',
            variants: [
              { name: 'Grid', conversionRate: 4.1, users: 2500 },
              { name: 'List', conversionRate: 3.9, users: 2500 }
            ],
            winner: 'Grid',
            confidence: 68.7
          }
        ]
      };
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getMetricColor = (value: number, type: 'conversion' | 'bounce' | 'time') => {
    switch (type) {
      case 'conversion':
        return value > 3 ? '#10B981' : value > 2 ? '#F59E0B' : '#EF4444';
      case 'bounce':
        return value < 40 ? '#10B981' : value < 60 ? '#F59E0B' : '#EF4444';
      default:
        return '#6366F1';
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSkeleton} />
          <div className={styles.loadingSkeleton} />
          <div className={styles.loadingSkeleton} />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`${styles.dashboard} ${className || ''}`}>
        <div className={styles.errorContainer}>
          <h3>Erreur de chargement</h3>
          <button onClick={loadMetrics} className={styles.retryButton}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dashboard} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Analytics Dashboard</h2>
        <div className={styles.timeRangeSelector}>
          {(['1h', '24h', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              className={`${styles.timeButton} ${timeRange === range ? styles.active : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        {[
          { key: 'overview' as const, label: 'Vue d\'ensemble', icon: '📊' },
          { key: 'funnels' as const, label: 'Tunnels', icon: '🔀' },
          { key: 'heatmap' as const, label: 'Heatmap', icon: '🔥' },
          { key: 'abtests' as const, label: 'A/B Tests', icon: '🧪' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={styles.content}
      >
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon}>👥</div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>{formatNumber(metrics.totalUsers)}</div>
                  <div className={styles.kpiLabel}>Utilisateurs</div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon}>💰</div>
                <div className={styles.kpiContent}>
                  <div 
                    className={styles.kpiValue}
                    style={{ color: getMetricColor(metrics.conversionRate, 'conversion') }}
                  >
                    {metrics.conversionRate.toFixed(1)}%
                  </div>
                  <div className={styles.kpiLabel}>Conversion</div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon}>⏱️</div>
                <div className={styles.kpiContent}>
                  <div className={styles.kpiValue}>
                    {formatDuration(metrics.averageSessionDuration)}
                  </div>
                  <div className={styles.kpiLabel}>Durée moyenne</div>
                </div>
              </div>

              <div className={styles.kpiCard}>
                <div className={styles.kpiIcon}>📤</div>
                <div className={styles.kpiContent}>
                  <div 
                    className={styles.kpiValue}
                    style={{ color: getMetricColor(metrics.bounceRate, 'bounce') }}
                  >
                    {metrics.bounceRate.toFixed(1)}%
                  </div>
                  <div className={styles.kpiLabel}>Taux de rebond</div>
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pages les plus visitées</h3>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Vues</th>
                      <th>Temps moyen</th>
                      <th>Rebond</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.topPages.map((page, index) => (
                      <tr key={index}>
                        <td className={styles.pageCell}>{page.page}</td>
                        <td>{formatNumber(page.views)}</td>
                        <td>{formatDuration(page.averageTime)}</td>
                        <td>
                          <span 
                            className={styles.metricBadge}
                            style={{ backgroundColor: getMetricColor(page.bounceRate, 'bounce') }}
                          >
                            {page.bounceRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'funnels' && (
          <div className={styles.funnels}>
            <h3 className={styles.sectionTitle}>Performance du tunnel de conversion</h3>
            <div className={styles.funnelChart}>
              {metrics.funnelPerformance.map((step, index) => (
                <div key={index} className={styles.funnelStep}>
                  <div className={styles.funnelStepHeader}>
                    <span className={styles.stepName}>{step.step}</span>
                    <span className={styles.stepUsers}>{formatNumber(step.users)} utilisateurs</span>
                  </div>
                  <div className={styles.funnelBar}>
                    <div 
                      className={styles.funnelBarFill}
                      style={{ 
                        width: `${step.conversionRate}%`,
                        backgroundColor: getMetricColor(step.conversionRate, 'conversion')
                      }}
                    />
                  </div>
                  <div className={styles.funnelMetrics}>
                    <span className={styles.conversionRate}>
                      {step.conversionRate.toFixed(1)}% conversion
                    </span>
                    {step.dropoffRate > 0 && (
                      <span className={styles.dropoffRate}>
                        {step.dropoffRate.toFixed(1)}% abandon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className={styles.heatmap}>
            <h3 className={styles.sectionTitle}>Analyse des interactions</h3>
            <div className={styles.heatmapSummary}>
              <div className={styles.heatmapKpi}>
                <div className={styles.heatmapNumber}>
                  {formatNumber(metrics.heatmapSummary.totalClicks)}
                </div>
                <div className={styles.heatmapLabel}>Clics totaux</div>
              </div>
              <div className={styles.heatmapKpi}>
                <div className={styles.heatmapNumber}>
                  {metrics.heatmapSummary.scrollDepth.toFixed(1)}%
                </div>
                <div className={styles.heatmapLabel}>Profondeur de scroll</div>
              </div>
            </div>
            
            <div className={styles.hotspots}>
              <h4>Zones les plus cliquées</h4>
              {metrics.heatmapSummary.hotspots.map((hotspot, index) => (
                <div key={index} className={styles.hotspot}>
                  <span className={styles.hotspotElement}>{hotspot.element}</span>
                  <span className={styles.hotspotClicks}>{formatNumber(hotspot.clicks)} clics</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'abtests' && (
          <div className={styles.abtests}>
            <h3 className={styles.sectionTitle}>Tests A/B en cours</h3>
            {metrics.abTestResults.map((test, index) => (
              <div key={index} className={styles.abTest}>
                <div className={styles.testHeader}>
                  <h4 className={styles.testName}>{test.testName}</h4>
                  {test.winner && (
                    <div className={styles.winner}>
                      🏆 Gagnant: {test.winner} ({test.confidence.toFixed(1)}% confiance)
                    </div>
                  )}
                </div>
                <div className={styles.variants}>
                  {test.variants.map((variant, vIndex) => (
                    <div 
                      key={vIndex} 
                      className={`${styles.variant} ${
                        variant.name === test.winner ? styles.winningVariant : ''
                      }`}
                    >
                      <div className={styles.variantName}>{variant.name}</div>
                      <div className={styles.variantMetrics}>
                        <span className={styles.variantUsers}>
                          {formatNumber(variant.users)} utilisateurs
                        </span>
                        <span className={styles.variantConversion}>
                          {variant.conversionRate.toFixed(1)}% conversion
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
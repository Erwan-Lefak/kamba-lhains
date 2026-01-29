import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { heatmapEngine } from '../../lib/analytics/heatmap';
import styles from './RealTimeDashboard.module.css';

interface RealTimeMetrics {
  activeUsers: number;
  pageViews: number;
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number; users: number }>;
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  geographicData: Array<{ country: string; users: number; flag: string }>;
  realtimeEvents: Array<{
    timestamp: number;
    event: string;
    page: string;
    user: string;
    details: any;
  }>;
}

interface ConversionFunnel {
  step: string;
  users: number;
  conversionRate: number;
  dropOff: number;
}

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    pageViews: 0,
    conversionRate: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
    geographicData: [],
    realtimeEvents: []
  });
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isLive, setIsLive] = useState(true);
  const [heatmapData, setHeatmapData] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Connexion WebSocket pour les données temps réel
  useEffect(() => {
    if (isLive) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => disconnectWebSocket();
  }, [isLive]);

  // Mise à jour des métriques
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        fetchMetrics();
        generateHeatmap();
      }
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [selectedTimeRange, isLive]);

  const connectWebSocket = () => {
    try {
      wsRef.current = new WebSocket('wss://your-domain.com/analytics-ws');
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateMetricsFromWebSocket(data);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsLive(false);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const fetchMetrics = async () => {
    try {
      // Simulation de données - en production, récupérer depuis l'API
      const mockMetrics: RealTimeMetrics = {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        conversionRate: Math.random() * 5 + 2,
        averageSessionDuration: Math.random() * 300 + 120,
        bounceRate: Math.random() * 30 + 20,
        topPages: [
          { path: '/', views: 2341, users: 1876 },
          { path: '/nouvelle-collection', views: 1543, users: 1234 },
          { path: '/boutique', views: 987, users: 823 },
          { path: '/produit/veste-jane', views: 756, users: 654 },
          { path: '/favoris', views: 432, users: 387 }
        ],
        deviceBreakdown: {
          mobile: Math.floor(Math.random() * 60) + 30,
          tablet: Math.floor(Math.random() * 20) + 10,
          desktop: Math.floor(Math.random() * 40) + 30
        },
        geographicData: [
          { country: 'France', users: 234, flag: '🇫🇷' },
          { country: 'Belgique', users: 89, flag: '🇧🇪' },
          { country: 'Suisse', users: 67, flag: '🇨🇭' },
          { country: 'Canada', users: 45, flag: '🇨🇦' },
          { country: 'Allemagne', users: 23, flag: '🇩🇪' }
        ],
        realtimeEvents: generateMockEvents()
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const generateMockEvents = () => {
    const events = ['page_view', 'product_click', 'add_to_cart', 'purchase', 'search'];
    const pages = ['/', '/nouvelle-collection', '/boutique', '/produit/veste-jane'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      timestamp: Date.now() - (i * 10000),
      event: events[Math.floor(Math.random() * events.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      user: `user_${Math.floor(Math.random() * 1000)}`,
      details: { device: 'mobile', location: 'Paris' }
    }));
  };

  const updateMetricsFromWebSocket = (data: any) => {
    setMetrics(prev => ({
      ...prev,
      activeUsers: data.activeUsers || prev.activeUsers,
      realtimeEvents: [data.event, ...prev.realtimeEvents.slice(0, 9)]
    }));
  };

  const generateHeatmap = () => {
    const heatmapImage = heatmapEngine.generateHeatmapVisualization('/', {
      width: 400,
      height: 800,
      radius: 20,
      intensity: 0.8
    });
    setHeatmapData(heatmapImage);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(Math.floor(num));
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.dashboardTitle}>
            Analytics Temps Réel
            <span className={`${styles.liveIndicator} ${isLive ? styles.live : ''}`}>
              {isLive ? '🔴 LIVE' : '⏸️ PAUSE'}
            </span>
          </h1>
          <p className={styles.lastUpdate}>
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.timeRangeSelector}>
            {(['1h', '24h', '7d', '30d'] as const).map(range => (
              <button
                key={range}
                className={`${styles.timeButton} ${
                  selectedTimeRange === range ? styles.active : ''
                }`}
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            className={`${styles.liveToggle} ${isLive ? styles.active : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Live'}
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className={styles.metricsGrid}>
        <motion.div 
          className={styles.metricCard}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>👥</span>
            <span className={styles.metricLabel}>Utilisateurs Actifs</span>
          </div>
          <div className={styles.metricValue}>
            {formatNumber(metrics.activeUsers)}
          </div>
          <div className={styles.metricChange}>
            +12% vs hier
          </div>
        </motion.div>

        <motion.div 
          className={styles.metricCard}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>📄</span>
            <span className={styles.metricLabel}>Pages Vues</span>
          </div>
          <div className={styles.metricValue}>
            {formatNumber(metrics.pageViews)}
          </div>
          <div className={styles.metricChange}>
            +8% vs hier
          </div>
        </motion.div>

        <motion.div 
          className={styles.metricCard}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>💰</span>
            <span className={styles.metricLabel}>Taux de Conversion</span>
          </div>
          <div className={styles.metricValue}>
            {metrics.conversionRate.toFixed(1)}%
          </div>
          <div className={styles.metricChange}>
            +0.3% vs hier
          </div>
        </motion.div>

        <motion.div 
          className={styles.metricCard}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>⏱️</span>
            <span className={styles.metricLabel}>Durée Moyenne</span>
          </div>
          <div className={styles.metricValue}>
            {formatDuration(metrics.averageSessionDuration)}
          </div>
          <div className={styles.metricChange}>
            +15s vs hier
          </div>
        </motion.div>
      </div>

      {/* Section principale avec graphiques */}
      <div className={styles.chartsSection}>
        {/* Heatmap */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            🔥 Heatmap des Clics
          </h3>
          <div className={styles.heatmapContainer}>
            {heatmapData ? (
              <Image width={600} height={750} src={heatmapData} 
                alt="Heatmap des interactions"
                className={styles.heatmapImage}
              />
            ) : (
              <div className={styles.heatmapPlaceholder}>
                Génération de la heatmap...
              </div>
            )}
          </div>
        </div>

        {/* Pages les plus visitées */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            📊 Pages Populaires
          </h3>
          <div className={styles.topPages}>
            {metrics.topPages.map((page, index) => (
              <motion.div
                key={page.path}
                className={styles.pageItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.pageRank}>#{index + 1}</div>
                <div className={styles.pageInfo}>
                  <div className={styles.pagePath}>{page.path}</div>
                  <div className={styles.pageStats}>
                    {formatNumber(page.views)} vues • {formatNumber(page.users)} utilisateurs
                  </div>
                </div>
                <div className={styles.pageBar}>
                  <div 
                    className={styles.pageBarFill}
                    style={{ width: `${(page.views / metrics.topPages[0].views) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Section secondaire */}
      <div className={styles.secondarySection}>
        {/* Répartition des appareils */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            📱 Répartition Appareils
          </h3>
          <div className={styles.deviceChart}>
            {Object.entries(metrics.deviceBreakdown).map(([device, percentage]) => (
              <div key={device} className={styles.deviceItem}>
                <div className={styles.deviceIcon}>
                  {device === 'mobile' && '📱'}
                  {device === 'tablet' && '💻'}
                  {device === 'desktop' && '🖥️'}
                </div>
                <div className={styles.deviceInfo}>
                  <div className={styles.deviceName}>
                    {device.charAt(0).toUpperCase() + device.slice(1)}
                  </div>
                  <div className={styles.devicePercentage}>
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                <div className={styles.deviceBar}>
                  <div 
                    className={styles.deviceBarFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Événements temps réel */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            ⚡ Activité Temps Réel
          </h3>
          <div className={styles.realtimeEvents}>
            <AnimatePresence>
              {metrics.realtimeEvents.map((event, index) => (
                <motion.div
                  key={`${event.timestamp}-${index}`}
                  className={styles.eventItem}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.eventTime}>
                    {new Date(event.timestamp).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                  <div className={styles.eventDetails}>
                    <span className={styles.eventType}>
                      {event.event.replace('_', ' ')}
                    </span>
                    <span className={styles.eventPage}>
                      {event.page}
                    </span>
                  </div>
                  <div className={styles.eventUser}>
                    {event.user}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Données géographiques */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>
            🌍 Utilisateurs par Pays
          </h3>
          <div className={styles.geoData}>
            {metrics.geographicData.map((country, index) => (
              <motion.div
                key={country.country}
                className={styles.countryItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className={styles.countryFlag}>{country.flag}</span>
                <span className={styles.countryName}>{country.country}</span>
                <span className={styles.countryUsers}>
                  {formatNumber(country.users)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
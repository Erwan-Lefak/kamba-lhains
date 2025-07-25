import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/Admin/AdminLayout';
import StatsCard from '../../components/Admin/StatsCard';
import QuickActions from '../../components/Admin/QuickActions';
import RecentActivity from '../../components/Admin/RecentActivity';
import SystemHealth from '../../components/Admin/SystemHealth';
import styles from '../../styles/Admin.module.css';

interface DashboardStats {
  sales: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    pending: number;
    processing: number;
    shipped: number;
    total: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  products: {
    total: number;
    outOfStock: number;
    lowStock: number;
    featured: number;
  };
  performance: {
    pageViews: number;
    uniqueVisitors: number;
    conversionRate: number;
    averageOrderValue: number;
  };
}

interface AdminDashboardProps {
  isAuthenticated: boolean;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function AdminDashboard({ isAuthenticated, user }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    loadDashboardStats();
  }, [timeRange]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginRequired}>
        <h1>Accès restreint</h1>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
        <Link href="/admin/login">Se connecter</Link>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <Head>
        <title>Dashboard Admin - Kamba Lhains</title>
      </Head>

      <div className={styles.adminDashboard}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.welcomeSection}>
            <h1>Bonjour, {user.name} 👋</h1>
            <p>Voici un aperçu de votre boutique aujourd'hui</p>
          </div>
          
          <div className={styles.timeRangeSelector}>
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                className={`${styles.timeButton} ${timeRange === range ? styles.active : ''}`}
                onClick={() => setTimeRange(range)}
              >
                {range === 'today' && 'Aujourd\'hui'}
                {range === 'week' && 'Cette semaine'}
                {range === 'month' && 'Ce mois'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Chargement des statistiques...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <StatsCard
                title="Ventes"
                value={`${stats?.sales.today.toLocaleString()}€`}
                change={stats?.sales.growth}
                icon="💰"
                color="#10b981"
              />
              <StatsCard
                title="Commandes"
                value={(stats?.orders.total || 0).toString()}
                subtitle={`${stats?.orders.pending} en attente`}
                icon="📦"
                color="#3b82f6"
              />
              <StatsCard
                title="Utilisateurs"
                value={(stats?.users.total || 0).toLocaleString()}
                subtitle={`${stats?.users.new} nouveaux`}
                icon="👥"
                color="#8b5cf6"
              />
              <StatsCard
                title="Taux de conversion"
                value={`${stats?.performance.conversionRate.toFixed(1)}%`}
                subtitle={`${stats?.performance.uniqueVisitors} visiteurs uniques`}
                icon="📈"
                color="#f59e0b"
              />
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
              {/* Left Column */}
              <div className={styles.leftColumn}>
                <RecentActivity />
                <QuickActions />
              </div>

              {/* Right Column */}
              <div className={styles.rightColumn}>
                <SystemHealth />
                
                {/* Stock Alerts */}
                <motion.div
                  className={styles.alertsCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className={styles.cardHeader}>
                    <h3>⚠️ Alertes Stock</h3>
                    <span className={styles.badge}>{stats?.products.outOfStock}</span>
                  </div>
                  <div className={styles.alertsList}>
                    <div className={styles.alertItem}>
                      <span className={styles.alertDot} style={{ backgroundColor: '#ef4444' }} />
                      <span>{stats?.products.outOfStock} produits en rupture</span>
                    </div>
                    <div className={styles.alertItem}>
                      <span className={styles.alertDot} style={{ backgroundColor: '#f59e0b' }} />
                      <span>{stats?.products.lowStock} produits en stock faible</span>
                    </div>
                  </div>
                  <Link href="/admin/products" className={styles.alertAction}>
                    Gérer le stock →
                  </Link>
                </motion.div>

                {/* Performance Summary */}
                <motion.div
                  className={styles.performanceCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3>📊 Performance</h3>
                  <div className={styles.performanceMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Pages vues</span>
                      <span className={styles.metricValue}>
                        {stats?.performance.pageViews.toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Panier moyen</span>
                      <span className={styles.metricValue}>
                        {stats?.performance.averageOrderValue.toFixed(0)}€
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>Rétention</span>
                      <span className={styles.metricValue}>
                        {stats?.users.retention.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .${styles.adminDashboard} {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .${styles.dashboardHeader} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .${styles.welcomeSection} h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .${styles.welcomeSection} p {
          color: #6b7280;
          margin: 0;
        }

        .${styles.timeRangeSelector} {
          display: flex;
          gap: 8px;
          background: #f3f4f6;
          padding: 4px;
          border-radius: 8px;
        }

        .${styles.timeButton} {
          padding: 8px 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;
        }

        .${styles.timeButton}.${styles.active} {
          background: white;
          color: #1f2937;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
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

        .${styles.statsGrid} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .${styles.mainGrid} {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .${styles.leftColumn}, .${styles.rightColumn} {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .${styles.alertsCard}, .${styles.performanceCard} {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .${styles.cardHeader} {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .${styles.cardHeader} h3 {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
        }

        .${styles.badge} {
          background: #fee2e2;
          color: #dc2626;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .${styles.alertsList} {
          margin-bottom: 16px;
        }

        .${styles.alertItem} {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
          color: #4b5563;
        }

        .${styles.alertDot} {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .${styles.alertAction} {
          color: #3b82f6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
        }

        .${styles.alertAction}:hover {
          text-decoration: underline;
        }

        .${styles.performanceCard} h3 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
        }

        .${styles.performanceMetrics} {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .${styles.metric} {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .${styles.metricLabel} {
          color: #6b7280;
          font-size: 14px;
        }

        .${styles.metricValue} {
          color: #1f2937;
          font-weight: 600;
          font-size: 14px;
        }

        .${styles.loginRequired} {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          color: #6b7280;
        }

        .${styles.loginRequired} h1 {
          color: #1f2937;
          margin-bottom: 16px;
        }

        .${styles.loginRequired} a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          margin-top: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .${styles.mainGrid} {
            grid-template-columns: 1fr;
          }
          
          .${styles.dashboardHeader} {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
        }

        @media (max-width: 640px) {
          .${styles.adminDashboard} {
            padding: 16px;
          }
          
          .${styles.statsGrid} {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Simulation de vérification d'authentification
  // En production, vérifier le token JWT/session
  const { req } = context;
  const authToken = req.cookies.admin_token;
  
  // Simuler une vérification d'authentification
  if (!authToken || authToken !== 'admin_authenticated') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false
      }
    };
  }

  // Simuler les données utilisateur admin
  const user = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: '/images/admin-avatar.jpg'
  };

  return {
    props: {
      isAuthenticated: true,
      user
    }
  };
};
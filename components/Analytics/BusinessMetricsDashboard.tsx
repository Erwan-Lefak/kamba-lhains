import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from './MetricCard';

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  category: 'revenue' | 'customer' | 'product' | 'conversion' | 'retention';
  trend: 'up' | 'down' | 'stable';
  threshold?: {
    warning: number;
    critical: number;
  };
}

export default function BusinessMetricsDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading metrics
    setTimeout(() => {
      setMetrics([
        {
          id: 'revenue',
          name: 'Chiffre d\'affaires',
          value: 128000,
          change: 12.5,
          unit: 'EUR',
          category: 'revenue',
          trend: 'up'
        },
        {
          id: 'customers',
          name: 'Nouveaux clients',
          value: 450,
          change: 8.2,
          unit: '',
          category: 'customer',
          trend: 'up'
        },
        {
          id: 'conversion',
          name: 'Taux de conversion',
          value: 3.2,
          change: -2.1,
          unit: '%',
          category: 'conversion',
          trend: 'down'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>Chargement des métriques...</h3>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: '20px' }}
    >
      <h1>📈 Analytics Business</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.id}
            metric={{
              ...metric,
              format: 'number' as const,
              description: `Métrique ${metric.name}`,
              timestamp: new Date().toISOString()
            }}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
}
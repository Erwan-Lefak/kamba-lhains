import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { usePersonalization } from '../../lib/ai/personalization';
import ProductCard from '../ProductCard';
import SkeletonCard from '../LoadingStates/SkeletonCard';
import styles from './RecommendationEngine.module.css';

interface RecommendationEngineProps {
  sessionId: string;
  currentProductId?: string;
  type: 'homepage' | 'product' | 'cart' | 'checkout';
  className?: string;
}

interface RecommendationSection {
  title: string;
  products: Product[];
  type: 'personalized' | 'trending' | 'similar' | 'recently_viewed';
  icon: string;
}

export default function RecommendationEngine({
  sessionId,
  currentProductId,
  type,
  className
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  
  const { getRecommendations, trackView } = usePersonalization(sessionId);

  useEffect(() => {
    loadRecommendations();
  }, [sessionId, currentProductId, type]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const sections: RecommendationSection[] = [];
      
      // Configuration des sections selon le contexte
      switch (type) {
        case 'homepage':
          sections.push(
            {
              title: 'Recommandé pour vous',
              products: await getRecommendations('personalized'),
              type: 'personalized',
              icon: '✨'
            },
            {
              title: 'Tendances actuelles',
              products: await getRecommendations('trending'),
              type: 'trending',
              icon: '🔥'
            }
          );
          break;
          
        case 'product':
          sections.push(
            {
              title: 'Produits similaires',
              products: await getRecommendations('similar'),
              type: 'similar',
              icon: '🎯'
            },
            {
              title: 'Vous pourriez aussi aimer',
              products: await getRecommendations('personalized'),
              type: 'personalized',
              icon: '💫'
            }
          );
          break;
          
        case 'cart':
          sections.push(
            {
              title: 'Complétez votre look',
              products: await getRecommendations('similar'),
              type: 'similar',
              icon: '👗'
            }
          );
          break;
          
        case 'checkout':
          sections.push(
            {
              title: 'Dernière chance',
              products: await getRecommendations('personalized'),
              type: 'personalized',
              icon: '⏰'
            }
          );
          break;
      }
      
      setRecommendations(sections.filter(section => section.products.length > 0));
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductView = (productId: string) => {
    trackView(productId, Date.now());
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const productVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.recommendationEngine} ${className || ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.sectionTitle}>
            <div className={styles.titleSkeleton} />
          </div>
          <div className={styles.productsGrid}>
            <SkeletonCard variant="product" count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.recommendationEngine} ${className || ''}`}>
      <AnimatePresence mode="wait">
        {recommendations.map((section, sectionIndex) => (
          <motion.div
            key={section.type}
            className={styles.recommendationSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header de section */}
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                {section.title}
              </h3>
              
              {section.products.length > 4 && (
                <button 
                  className={styles.seeAllButton}
                  onClick={() => {/* Navigation vers page complète */}}
                >
                  Voir tout
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Grille de produits */}
            <motion.div 
              className={styles.productsGrid}
              variants={sectionVariants}
            >
              {section.products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={productVariants}
                  className={styles.productWrapper}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onViewportEnter={() => handleProductView(product.id.toString())}
                >
                  <ProductCard 
                    product={product}
                    hideInfo={false}
                    noLink={false}
                  />
                  
                  {/* Badge de recommandation */}
                  <div className={styles.recommendationBadge}>
                    <span className={styles.badgeIcon}>{section.icon}</span>
                    <span className={styles.badgeText}>
                      {section.type === 'personalized' && 'Pour vous'}
                      {section.type === 'trending' && 'Tendance'}
                      {section.type === 'similar' && 'Similaire'}
                    </span>
                  </div>
                  
                  {/* Score de recommandation (dev mode) */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className={styles.debugScore}>
                      Score: {Math.round(Math.random() * 100)}%
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Navigation par onglets si plusieurs sections */}
            {recommendations.length > 1 && (
              <div className={styles.sectionTabs}>
                {recommendations.map((tab, tabIndex) => (
                  <button
                    key={tab.type}
                    className={`${styles.tab} ${
                      activeSection === tabIndex ? styles.activeTab : ''
                    }`}
                    onClick={() => setActiveSection(tabIndex)}
                  >
                    <span className={styles.tabIcon}>{tab.icon}</span>
                    <span className={styles.tabLabel}>{tab.title}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Analytics tracking */}
      <div className={styles.analyticsTracker} data-section-views={recommendations.length} />
    </div>
  );
}

// Hook pour utiliser les recommandations dans d'autres composants
export function useRecommendations(sessionId: string, type: string) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getRecommendations } = usePersonalization(sessionId);
  
  useEffect(() => {
    const loadRecs = async () => {
      setIsLoading(true);
      try {
        const recs = await getRecommendations(type as any);
        setRecommendations(recs);
      } catch (error) {
        console.error('Erreur recommandations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecs();
  }, [sessionId, type]);
  
  return { recommendations, isLoading };
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AIInsights.module.css';

interface UserProfile {
  segments: string[];
  interests: string[];
  priceRange: [number, number];
  preferredCategories: string[];
  preferredColors: string[];
  behaviors: {
    isFrequentBrowser: boolean;
    isImpulseBuyer: boolean;
    isPriceConscious: boolean;
    isLoyalCustomer: boolean;
  };
  engagement: {
    sessionCount: number;
    avgSessionDuration: number;
    conversionRate: number;
    lastActivity: string;
  };
}

interface Insights {
  profile: UserProfile;
  recommendations: string[];
  nextBestAction: string;
}

interface AIInsightsProps {
  sessionId: string;
  userId?: string;
  className?: string;
  onActionTaken?: (action: string) => void;
}

interface PersonalizationCard {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'offer' | 'recommendation' | 'insight';
  icon: string;
  confidence: number;
  actionable: boolean;
  action?: {
    label: string;
    type: string;
    data?: any;
  };
}

export default function AIInsights({ 
  sessionId, 
  userId, 
  className,
  onActionTaken 
}: AIInsightsProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [cards, setCards] = useState<PersonalizationCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'profile' | 'recommendations'>('insights');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadInsights();
  }, [sessionId, userId]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/behavior?sessionId=${sessionId}${userId ? `&userId=${userId}` : ''}`);
      const data = await response.json();

      if (data.success) {
        setInsights(data.insights);
        generatePersonalizationCards(data.insights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizationCards = (insightsData: Insights) => {
    const generatedCards: PersonalizationCard[] = [];
    const profile = insightsData.profile;

    // Carte de profil utilisateur
    generatedCards.push({
      id: 'user-profile',
      title: 'Votre Profil Shopping',
      description: `Vous êtes ${profile.segments.join(', ')}`,
      type: 'insight',
      icon: '👤',
      confidence: 95,
      actionable: false
    });

    // Recommandations personnalisées
    if (profile.behaviors.isPriceConscious) {
      generatedCards.push({
        id: 'price-conscious',
        title: 'Offres Spéciales pour Vous',
        description: 'Découvrez nos promotions dans votre gamme de prix préférée',
        type: 'offer',
        icon: '💰',
        confidence: 88,
        actionable: true,
        action: {
          label: 'Voir les offres',
          type: 'show_sales',
          data: { priceRange: profile.priceRange }
        }
      });
    }

    // Recommandations catégories
    if (profile.preferredCategories.length > 0) {
      generatedCards.push({
        id: 'category-rec',
        title: `Nouveautés ${profile.preferredCategories[0]}`,
        description: 'De nouveaux articles dans vos catégories préférées',
        type: 'recommendation',
        icon: '✨',
        confidence: 82,
        actionable: true,
        action: {
          label: 'Découvrir',
          type: 'show_category',
          data: { category: profile.preferredCategories[0] }
        }
      });
    }

    // Insight sur l'engagement
    if (profile.engagement.conversionRate === 0 && profile.engagement.sessionCount > 2) {
      generatedCards.push({
        id: 'first-purchase',
        title: 'Votre Premier Achat',
        description: 'Code promo -15% pour votre première commande',
        type: 'offer',
        icon: '🎁',
        confidence: 90,
        actionable: true,
        action: {
          label: 'Obtenir le code',
          type: 'first_buyer_offer',
          data: { discount: 15 }
        }
      });
    }

    // Recommendations basées sur les intérêts
    if (profile.interests.includes('formal_wear')) {
      generatedCards.push({
        id: 'formal-collection',
        title: 'Collection Soirée',
        description: 'Des pièces élégantes pour vos occasions spéciales',
        type: 'recommendation',
        icon: '👗',
        confidence: 75,
        actionable: true,
        action: {
          label: 'Explorer',
          type: 'show_formal_collection'
        }
      });
    }

    // Tip basé sur le comportement
    if (profile.behaviors.isFrequentBrowser) {
      generatedCards.push({
        id: 'browsing-tip',
        title: 'Liste de Souhaits',
        description: 'Sauvegardez vos coups de cœur pour ne rien oublier',
        type: 'tip',
        icon: '💡',
        confidence: 70,
        actionable: true,
        action: {
          label: 'Créer ma liste',
          type: 'create_wishlist'
        }
      });
    }

    setCards(generatedCards);
  };

  const handleCardAction = async (card: PersonalizationCard) => {
    if (!card.action || !card.actionable) return;

    try {
      // Tracker l'action
      await fetch('/api/ai/behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          events: [{
            type: 'ai_action_taken',
            metadata: {
              cardId: card.id,
              actionType: card.action.type,
              actionData: card.action.data
            }
          }]
        })
      });

      // Notifier le parent
      onActionTaken?.(card.action.type);

      // Actions spécifiques
      switch (card.action.type) {
        case 'show_sales':
          window.location.href = `/boutique?on_sale=true&min_price=${card.action.data?.priceRange[0]}&max_price=${card.action.data?.priceRange[1]}`;
          break;
        case 'show_category':
          window.location.href = `/boutique?category=${card.action.data?.category}`;
          break;
        case 'first_buyer_offer':
          // Afficher modal avec code promo
          alert(`Votre code promo: FIRST${card.action.data?.discount}`);
          break;
        case 'show_formal_collection':
          window.location.href = '/boutique?category=robes&style=formal';
          break;
        case 'create_wishlist':
          // Rediriger vers création de liste de souhaits
          window.location.href = '/wishlist';
          break;
      }
    } catch (error) {
      console.error('Error handling card action:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#10b981';
    if (confidence >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'offer': return '#8b5cf6';
      case 'recommendation': return '#3b82f6';
      case 'tip': return '#06b6d4';
      case 'insight': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.aiInsights} ${className || ''}`}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Analyse de vos préférences...</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className={`${styles.aiInsights} ${className || ''}`}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🤖</span>
          <h3>Aucune donnée disponible</h3>
          <p>Continuez à naviguer pour obtenir des recommandations personnalisées</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.aiInsights} ${className || ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles.titleIcon}>🤖</span>
          <h2>Recommandations IA</h2>
        </div>
        
        <div className={styles.tabs}>
          {[
            { key: 'insights', label: 'Insights', icon: '💡' },
            { key: 'profile', label: 'Profil', icon: '👤' },
            { key: 'recommendations', label: 'Suggestions', icon: '✨' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.cardsContainer}
            >
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className={`${styles.insightCard} ${styles[card.type]}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon} style={{ backgroundColor: getTypeColor(card.type) }}>
                      {card.icon}
                    </div>
                    <div className={styles.cardTitleSection}>
                      <h4 className={styles.cardTitle}>{card.title}</h4>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardType}>{card.type}</span>
                        <div 
                          className={styles.confidence}
                          style={{ color: getConfidenceColor(card.confidence) }}
                        >
                          {card.confidence}% confiance
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className={styles.cardDescription}>{card.description}</p>
                  
                  {card.actionable && card.action && (
                    <button
                      onClick={() => handleCardAction(card)}
                      className={styles.cardAction}
                      style={{ backgroundColor: getTypeColor(card.type) }}
                    >
                      {card.action.label}
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.profileSection}
            >
              <div className={styles.profileGrid}>
                {/* Segments */}
                <div className={styles.profileCard}>
                  <h4>Vos Segments</h4>
                  <div className={styles.segmentTags}>
                    {insights.profile.segments.map(segment => (
                      <span key={segment} className={styles.segmentTag}>
                        {segment.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Préférences */}
                <div className={styles.profileCard}>
                  <h4>Préférences</h4>
                  <div className={styles.preferences}>
                    <div className={styles.preferenceItem}>
                      <strong>Catégories:</strong> {insights.profile.preferredCategories.join(', ') || 'Non défini'}
                    </div>
                    <div className={styles.preferenceItem}>
                      <strong>Couleurs:</strong> {insights.profile.preferredColors.join(', ') || 'Non défini'}
                    </div>
                    <div className={styles.preferenceItem}>
                      <strong>Budget:</strong> {insights.profile.priceRange[0]}EUR - {insights.profile.priceRange[1]}EUR
                    </div>
                  </div>
                </div>

                {/* Comportements */}
                <div className={styles.profileCard}>
                  <h4>Comportements</h4>
                  <div className={styles.behaviors}>
                    {Object.entries(insights.profile.behaviors).map(([key, value]) => (
                      <div key={key} className={styles.behaviorItem}>
                        <span className={`${styles.behaviorIndicator} ${value ? styles.active : ''}`} />
                        <span className={styles.behaviorLabel}>
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement */}
                <div className={styles.profileCard}>
                  <h4>Engagement</h4>
                  <div className={styles.engagementStats}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{insights.profile.engagement.sessionCount}</span>
                      <span className={styles.statLabel}>Sessions</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{Math.round(insights.profile.engagement.avgSessionDuration)}s</span>
                      <span className={styles.statLabel}>Durée moy.</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>{insights.profile.engagement.conversionRate.toFixed(1)}%</span>
                      <span className={styles.statLabel}>Conversion</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={styles.recommendationsSection}
            >
              <div className={styles.recommendationsList}>
                {insights.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className={styles.recommendationItem}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className={styles.recommendationIcon}>💡</span>
                    <span className={styles.recommendationText}>{rec}</span>
                  </motion.div>
                ))}
              </div>

              <div className={styles.nextAction}>
                <h4>Action Recommandée</h4>
                <div className={styles.nextActionCard}>
                  <span className={styles.actionIcon}>🎯</span>
                  <span className={styles.actionText}>
                    {insights.nextBestAction.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .${styles.aiInsights} {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin: 20px 0;
        }

        .${styles.loadingContainer} {
          text-align: center;
          padding: 40px;
        }

        .${styles.spinner} {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        .${styles.emptyState} {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .${styles.emptyIcon} {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }

        .${styles.header} {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 16px;
        }

        .${styles.title} {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .${styles.titleIcon} {
          font-size: 24px;
        }

        .${styles.title} h2 {
          margin: 0;
          color: #1f2937;
        }

        .${styles.tabs} {
          display: flex;
          gap: 8px;
        }

        .${styles.tab} {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.tab}:hover {
          background: #f9fafb;
        }

        .${styles.tab}.${styles.activeTab} {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .${styles.tabIcon} {
          font-size: 16px;
        }

        .${styles.tabLabel} {
          font-size: 14px;
          font-weight: 500;
        }

        .${styles.content} {
          min-height: 300px;
        }

        .${styles.cardsContainer} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .${styles.insightCard} {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .${styles.insightCard}:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .${styles.cardHeader} {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .${styles.cardIcon} {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
        }

        .${styles.cardTitleSection} {
          flex: 1;
        }

        .${styles.cardTitle} {
          margin: 0 0 4px 0;
          color: #1f2937;
          font-size: 16px;
          font-weight: 600;
        }

        .${styles.cardMeta} {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .${styles.cardType} {
          font-size: 12px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 500;
        }

        .${styles.confidence} {
          font-size: 12px;
          font-weight: 500;
        }

        .${styles.cardDescription} {
          color: #4b5563;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .${styles.cardAction} {
          width: 100%;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .${styles.cardAction}:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .${styles.profileSection} {
          width: 100%;
        }

        .${styles.profileGrid} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .${styles.profileCard} {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .${styles.profileCard} h4 {
          margin: 0 0 16px 0;
          color: #1f2937;
          font-size: 16px;
        }

        .${styles.segmentTags} {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .${styles.segmentTag} {
          padding: 4px 8px;
          background: #dbeafe;
          color: #1d4ed8;
          border-radius: 4px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .${styles.preferences} {
          space-y: 8px;
        }

        .${styles.preferenceItem} {
          margin-bottom: 8px;
          font-size: 14px;
          color: #4b5563;
        }

        .${styles.behaviors} {
          space-y: 8px;
        }

        .${styles.behaviorItem} {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .${styles.behaviorIndicator} {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d1d5db;
        }

        .${styles.behaviorIndicator}.${styles.active} {
          background: #10b981;
        }

        .${styles.behaviorLabel} {
          font-size: 14px;
          color: #4b5563;
          text-transform: capitalize;
        }

        .${styles.engagementStats} {
          display: flex;
          justify-content: space-between;
        }

        .${styles.stat} {
          text-align: center;
        }

        .${styles.statValue} {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .${styles.statLabel} {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
        }

        .${styles.recommendationsSection} {
          width: 100%;
        }

        .${styles.recommendationsList} {
          margin-bottom: 24px;
        }

        .${styles.recommendationItem} {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          margin-bottom: 8px;
        }

        .${styles.recommendationIcon} {
          font-size: 16px;
          flex-shrink: 0;
        }

        .${styles.recommendationText} {
          color: #4b5563;
        }

        .${styles.nextAction} h4 {
          margin: 0 0 12px 0;
          color: #1f2937;
        }

        .${styles.nextActionCard} {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #fef3c7;
          border-radius: 8px;
          border: 1px solid #f59e0b;
        }

        .${styles.actionIcon} {
          font-size: 20px;
        }

        .${styles.actionText} {
          color: #92400e;
          font-weight: 500;
          text-transform: capitalize;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .${styles.header} {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .${styles.tabs} {
            width: 100%;
            justify-content: space-between;
          }

          .${styles.cardsContainer} {
            grid-template-columns: 1fr;
          }

          .${styles.profileGrid} {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
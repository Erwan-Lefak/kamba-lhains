import React from 'react';
import { motion } from 'framer-motion';
import styles from './SkeletonCard.module.css';

interface SkeletonCardProps {
  variant?: 'product' | 'gallery' | 'text' | 'collection' | 'profile';
  count?: number;
  animated?: boolean;
  className?: string;
}

// Animation variants for skeleton
const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

const pulseVariants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};

const SkeletonElement: React.FC<{
  className?: string;
  animated?: boolean;
  style?: React.CSSProperties;
}> = ({ className, animated = true, style }) => {
  const Component = animated ? motion.div : 'div';
  
  return (
    <Component
      className={`${styles.skeletonElement} ${className || ''}`}
      style={style}
      {...(animated && {
        variants: pulseVariants,
        initial: 'initial',
        animate: 'animate',
      })}
    >
      {animated && (
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      )}
    </Component>
  );
};

export default function SkeletonCard({ 
  variant = 'product', 
  count = 1, 
  animated = true,
  className
}: SkeletonCardProps) {
  const renderSkeleton = () => {
    const skeletonWrapper = (
      <motion.div 
        className={`${styles.skeletonCard} ${styles[variant]} ${className || ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {variant === 'product' && (
          <>
            <SkeletonElement 
              className={styles.imageSkeleton} 
              animated={animated}
            />
            <div className={styles.textSkeleton}>
              <SkeletonElement 
                className={styles.titleSkeleton} 
                animated={animated}
              />
              <SkeletonElement 
                className={styles.priceSkeleton} 
                animated={animated}
              />
              <div className={styles.actionsRow}>
                <SkeletonElement 
                  className={styles.buttonSkeleton} 
                  animated={animated}
                />
                <SkeletonElement 
                  className={styles.iconSkeleton} 
                  animated={animated}
                />
              </div>
            </div>
          </>
        )}
        
        {variant === 'gallery' && (
          <div className={styles.galleryGrid}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonElement 
                key={i}
                className={styles.galleryItem} 
                animated={animated}
              />
            ))}
          </div>
        )}
        
        {variant === 'text' && (
          <div className={styles.textBlockSkeleton}>
            <SkeletonElement 
              className={styles.textLineSkeleton} 
              animated={animated}
            />
            <SkeletonElement 
              className={styles.textLineSkeleton} 
              animated={animated}
            />
            <SkeletonElement 
              className={styles.textLineSkeletonShort} 
              animated={animated}
            />
          </div>
        )}

        {variant === 'collection' && (
          <>
            <SkeletonElement 
              className={styles.heroSkeleton} 
              animated={animated}
            />
            <div className={styles.collectionContent}>
              <SkeletonElement 
                className={styles.collectionTitle} 
                animated={animated}
              />
              <SkeletonElement 
                className={styles.collectionSubtitle} 
                animated={animated}
              />
              <div className={styles.productsGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonElement 
                    key={i}
                    className={styles.productGridItem} 
                    animated={animated}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {variant === 'profile' && (
          <div className={styles.profileSkeleton}>
            <SkeletonElement 
              className={styles.avatarSkeleton} 
              animated={animated}
              style={{ borderRadius: '50%' }}
            />
            <div className={styles.profileInfo}>
              <SkeletonElement 
                className={styles.nameSkeleton} 
                animated={animated}
              />
              <SkeletonElement 
                className={styles.titleSkeleton} 
                animated={animated}
              />
              <SkeletonElement 
                className={styles.bioSkeleton} 
                animated={animated}
              />
            </div>
          </div>
        )}
      </motion.div>
    );

    return skeletonWrapper;
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <motion.div 
      className={styles.skeletonContainer}
      variants={{
        show: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className={styles.skeletonWrapper}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </motion.div>
  );
}
import styles from './SkeletonCard.module.css';

interface SkeletonCardProps {
  variant?: 'product' | 'gallery' | 'text';
  count?: number;
}

export default function SkeletonCard({ variant = 'product', count = 1 }: SkeletonCardProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'product':
        return (
          <div className={styles.productSkeleton}>
            <div className={styles.imageSkeleton} />
            <div className={styles.textSkeleton}>
              <div className={styles.titleSkeleton} />
              <div className={styles.priceSkeleton} />
            </div>
          </div>
        );
      
      case 'gallery':
        return <div className={styles.gallerySkeleton} />;
      
      case 'text':
        return (
          <div className={styles.textBlockSkeleton}>
            <div className={styles.textLineSkeleton} />
            <div className={styles.textLineSkeleton} />
            <div className={styles.textLineSkeletonShort} />
          </div>
        );
      
      default:
        return <div className={styles.defaultSkeleton} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonWrapper}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
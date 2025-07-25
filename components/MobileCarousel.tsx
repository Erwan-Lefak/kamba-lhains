import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/HomePage.module.css';
import { Product } from '../types';

interface MobileCarouselProps {
  products: Product[];
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false); // Disabled auto-play for better UX

  const goToSlide = (index: number): void => {
    setCurrentIndex(index);
  };

  const goToPrevious = (): void => {
    const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (): void => {
    const newIndex = (currentIndex + 1) % products.length;
    setCurrentIndex(newIndex);
  };

  // Touch handling for horizontal swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className={styles.mobileCarousel}>
      <div 
        className={styles.mobileCarouselContainer}
        style={{
          transform: `translateX(-${currentIndex * 40}vw)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {products.map((product, index) => (
          <div key={`mobile-${product.id}`} className={styles.mobileProductSlot}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
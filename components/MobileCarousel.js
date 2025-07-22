import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/HomePage.module.css';

const MobileCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // Disabled auto-play for better UX

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % products.length;
    setCurrentIndex(newIndex);
  };

  // Touch handling for horizontal swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
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
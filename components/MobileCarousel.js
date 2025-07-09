import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from '../styles/HomePage.module.css';

const MobileCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, products.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % products.length;
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) {
      goToNext();
    } else if (isDownSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className={styles.mobileCarousel}>
      <div 
        className={styles.mobileCarouselContainer}
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
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

      {/* Navigation Arrows */}
      <div className={styles.carouselArrows}>
        <button 
          className={styles.carouselArrow}
          onClick={goToPrevious}
          aria-label="Produit précédent"
        >
          ▲
        </button>
        <button 
          className={styles.carouselArrow}
          onClick={goToNext}
          aria-label="Produit suivant"
        >
          ▼
        </button>
      </div>

      {/* Dots Navigation */}
      <div className={styles.carouselDots}>
        {products.map((_, index) => (
          <button
            key={index}
            className={`${styles.carouselDot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Aller au produit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/Products.module.css';

interface ProductCardProps {
  product: Product;
  hideInfo?: boolean;
}

export default function ProductCard({ product, hideInfo = false }: ProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  
  const availableImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = availableImages.length > 1;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [containerX, setContainerX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  
  
  // Créer un tableau infini : [dernière, ...images, première]
  const infiniteImages = hasMultipleImages 
    ? [availableImages[availableImages.length - 1], ...availableImages, availableImages[0]]
    : availableImages;

  // Initialiser la position correcte pour l'infini
  useEffect(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex(1); // Commencer sur la vraie première image
      setContainerX(-100); // Position -100% pour la vraie première image
    }
  }, [hasMultipleImages]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(selectedColor === color ? null : color);
  };

  const paginate = (direction: number) => {
    if (!hasMultipleImages) return; // Ne fait rien si une seule image
    
    const newIndex = currentImageIndex + direction;
    const newX = -newIndex * 100;
    
    setCurrentImageIndex(newIndex);
    setContainerX(newX);
    
    // Logique de reset invisible pour l'infini
    setTimeout(() => {
      if (newIndex >= availableImages.length + 1) {
        // Si on dépasse la dernière image, reset à la première vraie image
        setIsTransitioning(false);
        setCurrentImageIndex(1);
        setContainerX(-100);
        setTimeout(() => setIsTransitioning(true), 10);
      } else if (newIndex <= 0) {
        // Si on va avant la première image, reset à la dernière vraie image
        setIsTransitioning(false);
        setCurrentImageIndex(availableImages.length);
        setContainerX(-availableImages.length * 100);
        setTimeout(() => setIsTransitioning(true), 10);
      }
    }, 350); // Après la transition
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsTransitioning(false);
    
    // Force hardware acceleration
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !hasMultipleImages) return;
    
    e.preventDefault();
    touchCurrentX.current = e.touches[0].clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;
    const currentX = -currentImageIndex * 100;
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const newX = currentX + (deltaX / containerWidth) * 100;
    
    // Use requestAnimationFrame for 60fps smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      setContainerX(newX);
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !hasMultipleImages) return;
    
    const deltaX = touchCurrentX.current - touchStartX.current;
    const threshold = 20; // Very low threshold for iOS
    
    setIsTransitioning(true);
    
    // Clean up animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Remove hardware acceleration hint
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.willChange = 'auto';
        }
      }, 300);
    }
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        paginate(-1);
      } else {
        paginate(1);
      }
    } else {
      // Snap back to current position
      setContainerX(-currentImageIndex * 100);
    }
    
    isDragging.current = false;
  };

  return (
    <Link href={`/produit/${product.id}`} className={styles.productCard}>
      <div 
        className={styles.productImageContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageWrapper}>
          {hasMultipleImages ? (
            <div className={styles.carousel}>
              <div 
                ref={containerRef}
                className={styles.imageContainer}
                style={{
                  transform: `translate3d(${containerX}%, 0, 0)`,
                  transition: isTransitioning ? 'transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {infiniteImages.map((image, index) => (
                  <div key={index} className={styles.imageSlide}>
                    <Image 
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={800}
                      height={1200}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.productImage}
                      priority={product.featured && index === 0}
                      quality={95}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Image 
              src={availableImages[currentImageIndex]}
              alt={product.name}
              width={800}
              height={1200}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.productImage}
              priority={product.featured}
              quality={95}
            />
          )}
          
          {/* Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <>
              <button 
                className={`${styles.imageNavButton} ${styles.prevButton}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(-1);
                }}
                aria-label="Image précédente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={`${styles.imageNavButton} ${styles.nextButton}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(1);
                }}
                aria-label="Image suivante"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          
          {!hideInfo && (
            <>
              <button 
                className={styles.favoriteIcon}
                onClick={handleFavoriteClick}
                aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <span className={`u-w-full ${isProductFavorite ? 'u-hidden' : ''} | js-product-heart-add`}>
                  <svg className="c-icon" data-size="sm">
                    <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                  </svg>
                </span>
                <span className={`u-w-full ${!isProductFavorite ? 'u-hidden' : ''} | js-product-heart-remove`}>
                  <svg className="c-icon" data-size="sm">
                    <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                  </svg>
                </span>
              </button>
              {/* Color Swatches - appear on hover */}
              {product.colors && product.colors.length > 0 && (
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      className={styles.colorSwatches}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ 
                        type: "tween",
                        ease: "easeOut",
                        duration: 0.3,
                        staggerChildren: 0.05,
                        staggerDirection: -1
                      }}
                    >
                      {product.colors.map((color, index) => (
                        <motion.div 
                          key={index}
                          className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''}`}
                          style={{ 
                            backgroundColor: color.toLowerCase(),
                          }}
                          title={color}
                          onClick={(e) => handleColorClick(e, color)}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{ 
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.2,
                            delay: (product.colors.length - 1 - index) * 0.05
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              <div className={styles.productOverlay}>
                <div className={styles.productName}>{product.name}</div>
                <div className={styles.productPrice}>{product.price}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
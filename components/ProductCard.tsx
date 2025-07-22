import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/Products.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
              <motion.div 
                className={styles.imageContainer}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                animate={{ x: `${containerX}%` }}
                transition={isTransitioning ? { type: "tween", ease: "easeOut", duration: 0.3 } : { duration: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                  
                  if (swipe) {
                    if (offset.x > 0) {
                      paginate(-1);
                    } else {
                      paginate(1);
                    }
                  }
                }}
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
              </motion.div>
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
        </div>
      </div>
    </Link>
  );
}
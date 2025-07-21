import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const availableImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = availableImages.length > 1;

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
    setCurrentImageIndex(prev => {
      if (direction > 0) {
        return prev === availableImages.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? availableImages.length - 1 : prev - 1;
      }
    });
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
            <motion.div
              className={styles.carousel}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) > 150 || Math.abs(velocity.x) > 1000;
                
                if (swipe) {
                  if (offset.x > 0) {
                    paginate(-1);
                  } else {
                    paginate(1);
                  }
                }
              }}
            >
              <AnimatePresence mode="wait" custom={currentImageIndex}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.motionImageContainer}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                >
                  <Image 
                    src={availableImages[currentImageIndex]}
                    alt={product.name}
                    width={800}
                    height={1200}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.productImage}
                    priority={product.featured}
                    quality={95}
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
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
          {isHovered && product.colors && product.colors.length > 0 && (
            <motion.div 
              className={styles.colorSwatches}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: "tween",
                ease: "easeOut",
                duration: 0.3,
                staggerChildren: 0.05
              }}
            >
              {product.colors.map((color, index) => (
                <motion.div 
                  key={index}
                  className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                  onClick={(e) => handleColorClick(e, color)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.2,
                    delay: index * 0.05
                  }}
                />
              ))}
            </motion.div>
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
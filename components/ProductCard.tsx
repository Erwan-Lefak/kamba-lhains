import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? availableImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === availableImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Link href={`/produit/${product.id}`} className={styles.productCard}>
      <div 
        className={styles.productImageContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageWrapper}>
          <Image 
            src={availableImages[currentImageIndex]}
            alt={product.name}
            width={800}
            height={1200}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.productImage}
            priority={product.featured}
          />
          
          {/* Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <>
              <button 
                className={`${styles.imageNavButton} ${styles.prevButton}`}
                onClick={handlePrevImage}
                aria-label="Image précédente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={`${styles.imageNavButton} ${styles.nextButton}`}
                onClick={handleNextImage}
                aria-label="Image suivante"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          {isHovered && product.colors && product.colors.length > 0 && (
            <div className={styles.colorSwatches}>
              {product.colors.map((color, index) => (
                <div 
                  key={index}
                  className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                  onClick={(e) => handleColorClick(e, color)}
                />
              ))}
            </div>
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
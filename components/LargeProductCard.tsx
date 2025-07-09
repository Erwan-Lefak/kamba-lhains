import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/Products.module.css';

interface LargeProductCardProps {
  product: Product;
  className?: string;
}

export default function LargeProductCard({ product, className = "" }: LargeProductCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <Link href={`/produit/${product.id}`} className={`${styles.largeProductCard} ${className}`}>
      <div className={styles.largeProductImageContainer}>
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.largeProductImage}
          priority
        />
        <button 
          className={styles.favoriteIcon}
          onClick={handleFavoriteClick}
          aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg viewBox="0 0 24 24" fill={isProductFavorite ? "black" : "none"} stroke="black" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className={styles.largeProductOverlay}>
        <div className={styles.largeProductName}>{product.name}</div>
        <div className={styles.largeProductPrice}>{product.price}</div>
      </div>
    </Link>
  );
}
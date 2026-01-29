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
      </div>
      <div className={styles.largeProductOverlay}>
        <div className={styles.largeProductName}>{product.name}</div>
        <div className={styles.largeProductPrice}>{product.price}</div>
      </div>
    </Link>
  );
}
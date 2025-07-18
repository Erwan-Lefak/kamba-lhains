import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/Products.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <Link href={`/produit/${product.id}`} className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <Image 
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.productImage}
          priority={product.featured}
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
              <use xlinkHref="#icon-heart-kamba" x="0" y="0"></use>
            </svg>
          </span>
        </button>
        <div className={styles.productOverlay}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productPrice}>{product.price}</div>
        </div>
      </div>
    </Link>
  );
}
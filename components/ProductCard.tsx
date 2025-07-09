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
          <svg viewBox="0 0 24 24" fill={isProductFavorite ? "black" : "none"} stroke="black" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <div className={styles.productOverlay}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productPrice}>{product.price}</div>
        </div>
      </div>
    </Link>
  );
}
import Link from 'next/link';
import styles from '../styles/Products.module.css';

export default function LargeProductCard({ product, className = "" }) {
  return (
    <Link href={`/produit/${product.id}`} className={`${styles.largeProductCard} ${className}`}>
      <img 
        src={product.image} 
        alt={product.name} 
        className={styles.largeProductImage} 
      />
      <div className={styles.largeProductOverlay}>
        <div className={styles.largeProductName}>{product.name}</div>
        <div className={styles.largeProductPrice}>{product.price}</div>
      </div>
    </Link>
  );
}
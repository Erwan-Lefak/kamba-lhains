import Link from 'next/link';
import styles from '../styles/Products.module.css';

export default function ProductCard({ product }) {
  return (
    <Link href={`/produit/${product.id}`} className={styles.productCard}>
      <div className={styles.productImageContainer}>
        <img 
          src={product.image}
          alt={product.name}
          className={styles.productImage}
        />
        <div className={styles.productOverlay}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productPrice}>{product.price}</div>
        </div>
      </div>
    </Link>
  );
}
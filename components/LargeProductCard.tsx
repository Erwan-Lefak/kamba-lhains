import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import styles from '../styles/Products.module.css';

interface LargeProductCardProps {
  product: Product;
  className?: string;
}

export default function LargeProductCard({ product, className = "" }: LargeProductCardProps) {
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
      </div>
      <div className={styles.largeProductOverlay}>
        <div className={styles.largeProductName}>{product.name}</div>
        <div className={styles.largeProductPrice}>{product.price}</div>
      </div>
    </Link>
  );
}
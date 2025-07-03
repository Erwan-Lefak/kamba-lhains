import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import styles from '../styles/Products.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
        <div className={styles.productOverlay}>
          <div className={styles.productName}>{product.name}</div>
          <div className={styles.productPrice}>{product.price}</div>
        </div>
      </div>
    </Link>
  );
}
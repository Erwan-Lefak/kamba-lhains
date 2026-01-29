import ProductCard from './ProductCard';
import styles from '../styles/HomePage.module.css';
import { Product } from '../types';

interface MobileCarouselProps {
  products: Product[];
  defaultColorByProductId?: { [key: string]: string };
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({ products, defaultColorByProductId }) => {
  return (
    <div className={styles.mobileCarousel}>
      <div className={styles.mobileCarouselContainer}>
        {products.map((product, index) => (
          <div key={`mobile-${product.id}`} className={styles.mobileProductSlot}>
            <ProductCard
              product={product}
              defaultColor={defaultColorByProductId?.[product.id]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCarousel;
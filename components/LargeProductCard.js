import Link from 'next/link';

export default function LargeProductCard({ product, className = "" }) {
  return (
    <>
      <Link href={`/produit/${product.id}`} className={`large-product-card ${className}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="large-product-image" 
        />
        <div className="large-product-overlay">
          <div className="large-product-name">{product.name}</div>
          <div className="large-product-price">{product.price}</div>
        </div>
      </Link>
      
      <style jsx>{`
        .large-product-card {
          position: relative;
          display: block;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
        }
        
        .large-product-image {
          width: 100%;
          height: calc(100vh + 80px);
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }
        
        .large-product-card:hover .large-product-image {
          transform: scale(1.02);
        }
        
        .large-product-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 20px;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
          z-index: 2;
        }
        
        .large-product-name {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .large-product-price {
          font-size: 14px;
          font-weight: 500;
        }

        /* Responsive styles */
        @media (min-width: 1440px) {
          .large-product-image {
            height: calc(120vh + 80px);
          }
        }

        @media (min-width: 1920px) {
          .large-product-image {
            height: calc(140vh + 80px);
          }
        }

        @media (max-width: 1024px) {
          .large-product-image {
            height: 90vh;
          }
        }

        @media (max-width: 768px) {
          .large-product-image {
            height: 80vh;
          }
        }

        @media (max-width: 480px) {
          .large-product-image {
            height: 70vh;
          }
        }
      `}</style>
    </>
  );
}
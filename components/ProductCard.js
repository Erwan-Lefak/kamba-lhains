import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <>
      <Link href={`/produit/${product.id}`} className="product-card">
        <div className="product-image-container">
          <img 
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-overlay">
            <div className="product-name">{product.name}</div>
            <div className="product-price">{product.price}</div>
          </div>
        </div>
      </Link>
      
      <style jsx>{`
        .product-card {
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-image-container {
          position: relative;
          width: 100%;
          height: 100vh;
          display: block;
          overflow: hidden;
        }

        @media (max-width: 1024px) {
          .product-image-container {
            height: 80vh;
          }
        }

        @media (max-width: 768px) {
          .product-image-container {
            height: 70vh;
          }
        }

        @media (max-width: 480px) {
          .product-image-container {
            height: 60vh;
          }
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          background: white;
          transition: transform 0.4s ease;
        }
        
        .product-overlay {
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
        }
        
        .product-name {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .product-price {
          font-size: 14px;
          font-weight: 500;
        }
        
      `}</style>
    </>
  );
}
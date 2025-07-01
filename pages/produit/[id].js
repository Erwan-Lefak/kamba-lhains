import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { products } from '../../data/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    alert(`${quantity} ${product.name} ajouté(s) au panier !`);
  };

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <>
      <Head>
        <title>{product.name} - KAMBA LHAINS</title>
        <meta name="description" content={`Découvrez ${product.name} de KAMBA LHAINS. ${product.description[0]}`} />
      </Head>

      <Header />

      <main className="product-detail-page">
        <div className="container">
          <div className="product-layout">
            <div className="product-image-section">
              <img 
                src={`https://via.placeholder.com/600x800/FFFFFF/000000?text=${product.name}`}
                alt={product.name}
                className="main-product-image"
              />
            </div>

            <div className="product-info-section">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-description">
                {Array.isArray(product.description) ? (
                  <ul>
                    {product.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{product.description}</p>
                )}
              </div>

              <div className="product-options">
                <div className="size-selector">
                  <label>Taille:</label>
                  <div className="size-buttons">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="color-selector">
                  <label>Couleur: {selectedColor}</label>
                  <div className="color-options">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quantity-selector">
                  <label>Quantité:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-price">
                <span className="price">{product.price}</span>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                AJOUTER AU PANIER
              </button>

              <div className="product-details">
                <div className="detail-item">
                  <strong>Livraison:</strong> Gratuite à partir de 100€
                </div>
                <div className="detail-item">
                  <strong>Retours:</strong> 30 jours pour changer d'avis
                </div>
                <div className="detail-item">
                  <strong>Guide des tailles:</strong> <a href="/guide-tailles">Voir le guide</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .product-detail-page {
          padding-top: 80px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .product-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .main-product-image {
          width: 100%;
          height: auto;
          border-radius: 5px;
        }

        .product-title {
          font-size: 2rem;
          font-weight: bold;
          color: #000;
          margin-bottom: 30px;
          letter-spacing: 2px;
        }

        .product-description {
          margin-bottom: 40px;
        }

        .product-description ul {
          list-style: none;
          padding: 0;
        }

        .product-description li {
          margin-bottom: 8px;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        .product-options {
          margin-bottom: 40px;
        }

        .size-selector,
        .color-selector,
        .quantity-selector {
          margin-bottom: 30px;
        }

        .size-selector label,
        .color-selector label,
        .quantity-selector label {
          display: block;
          margin-bottom: 15px;
          font-weight: 600;
          color: #000;
          font-size: 16px;
        }

        .size-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .size-btn {
          padding: 12px 20px;
          border: 2px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
          min-width: 50px;
        }

        .size-btn:hover {
          border-color: #000;
        }

        .size-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .color-options {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .color-option {
          padding: 10px 20px;
          border: 2px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          border-radius: 20px;
        }

        .color-option:hover {
          border-color: #000;
        }

        .color-option.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          border: 2px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover {
          border-color: #000;
        }

        .quantity {
          font-size: 18px;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .product-price {
          margin-bottom: 30px;
        }

        .price {
          font-size: 2rem;
          font-weight: bold;
          color: #000;
        }

        .add-to-cart-btn {
          width: 100%;
          padding: 20px;
          background: #000;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 2px;
          cursor: pointer;
          margin-bottom: 40px;
          transition: background 0.3s;
        }

        .add-to-cart-btn:hover {
          background: #333;
        }

        .product-details {
          border-top: 1px solid #eee;
          padding-top: 30px;
        }

        .detail-item {
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .detail-item a {
          color: #000;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .product-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .product-title {
            font-size: 1.5rem;
          }

          .size-buttons {
            justify-content: center;
          }

          .color-options {
            justify-content: center;
          }

          .quantity-controls {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
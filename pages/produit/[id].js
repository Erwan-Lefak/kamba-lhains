import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { products } from '../../data/products';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('details');

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
    alert(`${product.name} ajouté au panier !`);
  };

  if (!product) {
    return (
      <>
        <Header />
        <div style={{ paddingTop: '120px', textAlign: 'center' }}>
          <p>Produit non trouvé</p>
          <Link href="/">Retour à l'accueil</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - KAMBA LHAINS</title>
        <meta name="description" content={`Découvrez ${product.name} de KAMBA LHAINS. ${product.description[0]}`} />
      </Head>

      <Header />

      <main className="product-page">
        <div className="product-container">
          {/* Image Section */}
          <div className="product-image-section">
            <div className="image-navigation">
              <button className="nav-arrow nav-prev">‹</button>
              <div className="product-image-container">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <button className="nav-arrow nav-next">›</button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info-section">
            <div className="product-info">
              <p className="product-category">{product.category.toUpperCase()}</p>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-subtitle">LA CHEMISE</p>
              
              <p className="product-description">
                Veste non doubleé en lin
              </p>

              {/* Color Selector */}
              <div className="color-section">
                <label className="option-label">Black</label>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color.toLowerCase() === 'black' ? '#000' : '#f0f0f0' }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="size-section">
                <label className="option-label">Taille</label>
                <div className="size-grid">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-option ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Link href="/guide-tailles" className="size-guide">
                  Calculer votre taille
                </Link>
              </div>

              {/* Price */}
              <div className="price-section">
                <span className="price">{product.price}</span>
              </div>

              {/* Add to Cart Button */}
              <button className="add-to-cart" onClick={handleAddToCart}>
                <span>🛍</span> AJOUTER AU PANIER
              </button>

              {/* Availability */}
              <p className="availability">Vous le donnerez en boutique</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="tabs-section">
          <div className="tabs-container">
            <div className="tabs-nav">
              <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Détails
              </button>
              <button 
                className={`tab ${activeTab === 'tracability' ? 'active' : ''}`}
                onClick={() => setActiveTab('tracability')}
              >
                Traçabilité
              </button>
              <button 
                className={`tab ${activeTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setActiveTab('delivery')}
              >
                Livraison et retours
              </button>
              <button 
                className={`tab ${activeTab === 'help' ? 'active' : ''}`}
                onClick={() => setActiveTab('help')}
              >
                Aide
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'details' && (
                <div className="details-content">
                  <ul>
                    {product.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === 'tracability' && (
                <div className="tracability-content">
                  <p>Informations sur la traçabilité du produit...</p>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="delivery-content">
                  <p>Livraison gratuite à partir de 150€</p>
                  <p>Retours gratuits sous 30 jours</p>
                </div>
              )}
              {activeTab === 'help' && (
                <div className="help-content">
                  <p>Contactez notre service client pour toute question.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .product-page {
          margin-top: 80px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #f8f8f8;
        }

        .product-container {
          display: grid;
          grid-template-columns: 1fr 500px;
          min-height: 100vh;
          background: white;
        }

        .product-image-section {
          background: #f0f0f0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-navigation {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 3rem;
          color: #666;
          cursor: pointer;
          z-index: 10;
          padding: 20px;
          transition: color 0.3s;
        }

        .nav-arrow:hover {
          color: #000;
        }

        .nav-prev {
          left: 30px;
        }

        .nav-next {
          right: 30px;
        }

        .product-image-container {
          width: 70%;
          height: 80%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0;
        }

        .product-info-section {
          padding: 60px 50px;
          background: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .product-category {
          font-size: 12px;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 2px;
          margin-bottom: 10px;
          color: #000;
        }

        .product-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 30px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .product-description {
          font-size: 16px;
          color: #333;
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .color-section,
        .size-section {
          margin-bottom: 30px;
        }

        .option-label {
          display: block;
          font-size: 14px;
          color: #000;
          margin-bottom: 15px;
          font-weight: 500;
        }

        .color-options {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .color-swatch {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid #ddd;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .color-swatch.active {
          border-color: #000;
          border-width: 3px;
        }

        .size-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-bottom: 15px;
        }

        .size-option {
          padding: 12px 8px;
          border: 1px solid #ddd;
          background: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          min-width: 50px;
        }

        .size-option:hover {
          border-color: #000;
        }

        .size-option.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .size-guide {
          font-size: 12px;
          color: #666;
          text-decoration: underline;
          cursor: pointer;
        }

        .size-guide:hover {
          color: #000;
        }

        .price-section {
          margin: 40px 0 30px 0;
        }

        .price {
          font-size: 1.8rem;
          font-weight: 400;
          color: #000;
        }

        .add-to-cart {
          width: 100%;
          padding: 18px;
          background: white;
          border: 2px solid #000;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s;
          text-transform: uppercase;
        }

        .add-to-cart:hover {
          background: #000;
          color: white;
        }

        .availability {
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        .tabs-section {
          background: white;
          border-top: 1px solid #eee;
        }

        .tabs-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .tabs-nav {
          display: flex;
          border-bottom: 1px solid #eee;
        }

        .tab {
          padding: 20px 30px;
          background: none;
          border: none;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: color 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tab:hover,
        .tab.active {
          color: #000;
          border-bottom: 2px solid #000;
        }

        .tab-content {
          padding: 40px 30px;
          min-height: 200px;
        }

        .details-content ul {
          list-style: none;
          padding: 0;
        }

        .details-content li {
          margin-bottom: 10px;
          color: #666;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .product-container {
            grid-template-columns: 1fr;
          }
          
          .product-info-section {
            padding: 40px 30px;
          }

          .size-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 2rem;
          }

          .tabs-nav {
            flex-wrap: wrap;
          }

          .tab {
            flex: 1;
            min-width: 50%;
            padding: 15px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
}
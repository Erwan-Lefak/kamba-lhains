import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { products } from '../../data/products';
import styles from '../../styles/ProductPage.module.css';

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
    alert(`${product.name} ajouté à la liste d'attente !`);
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

      <main className={styles.productPage}>
        <div className={styles.productContainer}>
          {/* Image Section */}
          <div className={styles.productImageSection}>
            <div className={styles.imageNavigation}>
              <button className={`${styles.navArrow} ${styles.navPrev}`}>‹</button>
              <div className={styles.productImageContainer}>
                <img 
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
              </div>
              <button className={`${styles.navArrow} ${styles.navNext}`}>›</button>
            </div>
            <button className={styles.heartIcon}>♡</button>
          </div>

          {/* Product Info Section */}
          <div className={styles.productInfoSection}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            <p className={styles.productDescription}>
              {product.category === 'femme' ? 'Robe boutonnée en maille' : 'Veste non doublée en lin'}
            </p>

            {/* Color Selector */}
            <div className={styles.colorSection}>
              <div className={styles.colorLabel}>
                {selectedColor === 'Blanc' || selectedColor === 'Beige' ? 'Pale Yellow' : selectedColor}
              </div>
              <div className={styles.colorOptions}>
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''} ${
                      color.toLowerCase().includes('jaune') || color.toLowerCase().includes('beige') || color.toLowerCase().includes('blanc') 
                        ? styles.colorSwatchYellow 
                        : styles.colorSwatchPink
                    }`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <div className={styles.seeAllColors}>Voir les couleurs</div>
            </div>

            {/* Size Selector */}
            <div className={styles.sizeSection}>
              <div className={styles.sizeLabel}>Taille</div>
              <div className={styles.sizeGrid}>
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className={styles.sizeGuide}>
                ⓘ Calculez votre taille
              </div>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.price}>{product.price}</div>
            </div>

            {/* Add to Cart Button */}
            <div className={styles.addToCartSection}>
              <button className={styles.addToCartButton} onClick={handleAddToCart}>
                📋 LISTE D'ATTENTE
              </button>
              <div className={styles.availabilityLink}>
                Voir la disponibilité et prendre un rendez-vous en boutique
              </div>
            </div>

            {/* Tabs Section */}
            <div className={styles.tabsSection}>
              <div className={styles.tabsContainer}>
                <div className={styles.tabsNav}>
                  <button 
                    className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Détails
                  </button>
                  <button 
                    className={`${styles.tab} ${activeTab === 'delivery' ? styles.active : ''}`}
                    onClick={() => setActiveTab('delivery')}
                  >
                    Livraison et retours
                  </button>
                  <button 
                    className={`${styles.tab} ${activeTab === 'help' ? styles.active : ''}`}
                    onClick={() => setActiveTab('help')}
                  >
                    Aide
                  </button>
                </div>
                
                <div className={styles.tabContent}>
                  {activeTab === 'details' && (
                    <div>
                      {product.description.map((item, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>{item}</div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'delivery' && (
                    <div>
                      <p>Livraison gratuite à partir de 150€</p>
                      <p>Retours gratuits sous 30 jours</p>
                      <p>Livraison express en 24h disponible</p>
                    </div>
                  )}
                  {activeTab === 'help' && (
                    <div>
                      <p>Contactez notre service client pour toute question.</p>
                      <p>Email: service@kambalahins.com</p>
                      <p>Téléphone: +33 1 23 45 67 89</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
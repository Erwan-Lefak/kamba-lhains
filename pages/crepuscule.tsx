import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import styles from '../styles/HomePage.module.css';
import productStyles from '../styles/ProductPage.module.css';

export default function Crepuscule() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState('cm');

  // Récupérer le produit voile de corps (id: "3")
  const voileProduct = products.find(product => product.id === '3');

  if (!voileProduct) {
    return <div>Produit non trouvé</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }
    addToCart(voileProduct, selectedSize, selectedColor, quantity);
    alert(`${voileProduct.name} ajouté au panier !`);
  };

  const handleHeartClick = () => {
    // Handle favorites logic here
  };

  const openModal = (type: string) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  // Fonction pour obtenir le nom de la couleur
  const getColorName = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      '#000000': 'Noir',
      '#8B4513': 'Marron',
      '#800020': 'Bordeaux',
      '#556B2F': 'Kaki',
      '#FF69B4': 'Rose',
    };
    return colorMap[color] || color;
  };

  return (
    <>
      <Head>
        <title>Crépuscule - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre collection Crépuscule - La beauté de la fin de journée." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <div className="main-content full-width">
          {/* Section Introduction Crépuscule */}
          <section className={styles.newCollectionSection}>
            <div className={styles.textSection}>
              <h1 
                style={{ 
                  fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
                  fontSize: '11px',
                  fontWeight: 400,
                  color: '#000000',
                  textShadow: 'none',
                  boxShadow: 'none',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  width: '100%'
                }}
              >
                Crépuscule
              </h1>
              <p className={styles.collectionDescription}>
                Le Crépuscule évoque ces moments suspendus entre jour et nuit, où la lumière se teinte de nuances dorées et pourpres. Cette collection capture la poésie de ces instants privilégiés, révélant des créations empreintes de mystère et d'élégance.
              </p>
            </div>
            
            <div className={styles.mediaSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/crepuscule-hero-new.jpg?v=2"
                  alt="Collection Crépuscule - Kamba Lhains"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          </section>

          {/* Section Image + Texte */}
          <section className={styles.twoProductsSection}>
            <div className={styles.twoProductsGrid}>
              <div className={styles.simpleProductSlot}>
                <Image
                  src="/images/crepuscule-section2-new.jpg?v=1"
                  alt="Collection Crépuscule"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className={styles.textZone}>
                <p className={styles.textZoneContent}>
                  Le Crépuscule capture l'essence de ces instants magiques où le jour cède doucement sa place à la nuit. Cette collection évoque la poésie des ciels teintés de pourpre et d'or, révélant des créations empreintes de mystère et d'élégance intemporelle. Chaque pièce incarne cette transition délicate, alliant sophistication moderne et inspiration naturelle.
                </p>
              </div>
            </div>
          </section>

          {/* 2ème section: Titre de la sous-catégorie */}
          <section style={{
            padding: '60px 0',
            textAlign: 'center',
            background: 'white'
          }}>
            <h2 style={{
              fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              color: '#000000',
              textShadow: 'none',
              boxShadow: 'none',
              textTransform: 'uppercase',
              marginBottom: '15px',
              textAlign: 'center',
              width: '100%',
              margin: 0
            }}>
              Tous les articles
            </h2>
          </section>

          {/* 3ème section: Page Produit Complète */}
          <div className={productStyles.productPage} style={{marginTop: 0}}>
            <div className={productStyles.productContainer}>
              {/* Image Section - 60% */}
              <div className={productStyles.productImageSection} style={{position: 'relative'}}>
                {/* Breadcrumb - Positioned absolutely */}
                <div className={productStyles.breadcrumb} style={{
                  position: 'sticky',
                  top: '20px',
                  left: '10px',
                  zIndex: 10,
                  marginTop: 0,
                  marginBottom: '-40px'
                }}>
                  <Link href="/crepuscule" className={productStyles.breadcrumbLink}>
                    <span>Crépuscule</span>
                  </Link>
                  <span> - </span>
                  <Link href="/crepuscule" className={productStyles.breadcrumbLink}>
                    <span>Voile de corps</span>
                  </Link>
                </div>

                {/* Heart Icon - Positioned absolutely */}
                <button
                  className={`${productStyles.heartIcon} ${false ? productStyles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={false ? "Retirer des favoris" : "Ajouter aux favoris"}
                  style={{
                    position: 'sticky',
                    top: '10px',
                    right: '10px',
                    zIndex: 10,
                    marginTop: 0,
                    marginBottom: '-40px',
                    marginLeft: 'auto'
                  }}
                >
                  <span className={`u-w-full ${false ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${!false ? 'u-hidden' : ''} | js-product-heart-remove`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                    </svg>
                  </span>
                </button>

                {/* Vertical Image Stack */}
                <div className={productStyles.imageStack}>
                  {(() => {
                    // Get images for selected color
                    let imagesToShow = voileProduct.images || [voileProduct.image];

                    if (voileProduct.imagesByColor && selectedColor && voileProduct.imagesByColor[selectedColor]) {
                      imagesToShow = voileProduct.imagesByColor[selectedColor];
                    }

                    return imagesToShow.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${voileProduct.name} ${index + 1}`}
                        className={productStyles.stackedImage}
                        onError={(e) => {
                          console.log('Image failed to load:', image);
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>

              {/* Product Info Section - 40% */}
              <div className={productStyles.productInfoSection}>
                {/* Main Content - Centered */}
                <div className={productStyles.productMainContent}>
                  <h1 className={productStyles.productTitle}>{voileProduct.name}</h1>
                  <span className={productStyles.productPrice}>{voileProduct.price} EUR</span>

                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        Couleur : {getColorName(selectedColor)}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {voileProduct.colors?.map((color, index) => (
                        <div
                          key={index}
                          className={`${productStyles.colorSwatch} ${selectedColor === color ? productStyles.active : ''}`}
                          style={{
                            backgroundColor: color,
                            border: color === '#FFFFFF' ? '1px solid #E5E5E5' : 'none'
                          }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className={productStyles.sizeSection}>
                    <div className={productStyles.sizeHeader}>
                      <div className={productStyles.sizeLabel}>Taille</div>
                    </div>
                    <div className={productStyles.sizeGrid}>
                      {voileProduct.sizes?.map((size, index) => (
                        <button
                          key={index}
                          className={`${productStyles.sizeOption} ${selectedSize === size ? productStyles.active : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart Button with Quantity */}
                  <div className={productStyles.addToCartSection}>
                    <div className={productStyles.addToCartButton}>
                      <div
                        className={productStyles.quantityButtonInside}
                        onClick={() => {
                          const newQuantity = Math.max(1, quantity - 1);
                          setQuantity(newQuantity);
                          if (newQuantity === 1) {
                            setHasClickedPlus(false);
                          }
                        }}
                      >
                        -
                      </div>
                      <button onClick={handleAddToCart} style={{border: 'none', background: 'transparent', flex: 1, color: 'black'}}>
                        <span>AJOUTER AU PANIER</span>
                      </button>
                      <div
                        className={productStyles.quantityButtonInside}
                        onClick={() => {
                          if (quantity === 1 && !hasClickedPlus) {
                            setHasClickedPlus(true);
                          } else {
                            setQuantity(quantity + 1);
                          }
                        }}
                      >
                        {quantity === 1 && !hasClickedPlus ? '+' : <span style={{fontSize: '14px'}}>{quantity}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Info Links */}
                  <div className={productStyles.infoLinksSection}>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('description')}
                    >
                      Description
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('sizeGuide')}
                    >
                      Guide des tailles
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('careGuide')}
                    >
                      Entretien
                    </button>
                  </div>

                  {/* Product Description */}
                  <div className={productStyles.productDescription}>
                    {(Array.isArray(crepusculeProduct.description) ? Product.description : [Product.description]).map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complete Your Look Section */}
          <section className={productStyles.completeYourLook}>
            <div className={productStyles.sectionContainer}>
              <h2 className={productStyles.sectionTitle}>DES OPTIONS À EXPLORER</h2>
            </div>

            {/* Three Products Grid Section - Using ProductPage Style */}
            <section className={productStyles.threeProductsSection}>
              {/* Desktop Grid */}
              <div className={productStyles.threeProductsGrid}>
                {products
                  .filter(p => p.subCategory === 'aube' && p.inStock)
                  .slice(0, 4)
                  .map((recommendedProduct) => (
                    <div key={recommendedProduct.id} className={productStyles.productSlot}>
                      <ProductCard product={recommendedProduct} />
                    </div>
                  ))
                }
              </div>

              {/* Mobile Carousel */}
              <div className={productStyles.mobileCarousel}>
                <MobileCarousel products={products.filter(p => p.subCategory === 'aube' && p.inStock).slice(0, 4)} />
              </div>
            </section>
          </section>
        </div>
      </main>

      <Footer isKambaversPage={true} isMenuVisible={false} />

      <style jsx>{`
        .kambavers-page {
          display: flex;
          min-height: 100vh;
          background: white;
        }

        .sidebar-menu {
          position: fixed;
          left: 0;
          top: 80px;
          width: 250px;
          height: calc(100vh - 80px);
          background: white;
          z-index: 1000;
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-menu.hidden {
          transform: translateX(-100%);
        }

        .sidebar-menu.visible {
          transform: translateX(0);
        }

        .sidebar-nav {
          padding: 40px 0;
        }

        .sidebar-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-nav li {
          margin-bottom: 0;
        }

        .sidebar-nav button {
          width: 100%;
          background: none;
          border: none;
          padding: 20px 30px;
          text-align: left;
          font-family: inherit;
          font-size: 11px;
          font-weight: 400;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .sidebar-nav button:hover {
          color: #9f0909;
        }

        .sidebar-nav button.active {
          color: #9f0909;
        }

        .sidebar-title {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 15px 0 20px 30px;
          padding: 0;
        }

        .sidebar-nav .submenu {
          list-style: none !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-left: 35px !important;
        }

        .sidebar-nav .submenu li {
          margin-bottom: 0 !important;
        }

        .sidebar-nav .submenu-item {
          width: 100% !important;
          background: none !important;
          border: none !important;
          padding: 10px 20px !important;
          text-align: left !important;
          font-family: inherit !important;
          font-size: 8px !important;
          font-weight: 400 !important;
          color: #666 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          cursor: pointer !important;
          transition: color 0.3s ease !important;
        }

        .sidebar-nav .submenu-item:hover {
          color: #9f0909 !important;
        }

        .sidebar-nav .submenu-item.active {
          color: #9f0909 !important;
        }

        .menu-toggle {
          position: fixed;
          top: 90px;
          left: 20px;
          z-index: 1001;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border: none;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .menu-toggle svg {
          color: #000000;
          transition: color 0.3s ease;
        }

        .menu-toggle:hover svg {
          color: #9f0909;
        }

        .menu-toggle:hover svg line {
          stroke: #9f0909;
        }

        .main-content {
          margin-left: 250px;
          flex: 1;
          padding-top: 40px;
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-content.full-width {
          margin-left: 0;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        @media (max-width: 1024px) {
          .sidebar-menu {
            width: 200px;
          }

          .main-content.with-sidebar {
            margin-left: 200px;
          }

          .sidebar-nav button {
            padding: 16px 20px;
            font-size: 11px;
            font-weight: 400;
          }

          .submenu-item {
            padding: 12px 20px;
            font-size: 8px;
          }
        }

        @media (max-width: 768px) {
          .sidebar-menu {
            width: 280px;
            top: 0;
            height: 100vh;
          }

          .menu-toggle {
            top: 20px;
            left: 20px;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }
        }
      `}</style>
    </>
  );
}
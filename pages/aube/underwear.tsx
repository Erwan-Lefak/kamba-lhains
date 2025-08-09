import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import MobileCarousel from '../../components/MobileCarousel';
import CollectionSidebar from '../../components/CollectionSidebar';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
// import { useFavorites } from '../../contexts/FavoritesContext';
import styles from '../../styles/HomePage.module.css';
import productStyles from '../../styles/ProductPage.module.css';

export default function AubeUnderwear() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(false);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(true);
  
  // Product page states
  const { addToCart } = useCart();
  // const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [rightModalOpen, setRightModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    setIsMenuVisible(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Product page functions
  const boxerProduct = {
    id: 'aube-boxer-001',
    name: 'Boxer',
    price: '30 EUR',
    image: '/images/products/boxer1.jpg',
    images: ['/images/products/boxer1.jpg', '/images/products/boxer2.jpg', '/images/products/boxer3.jpg', '/images/products/boxer4.jpg', '/images/products/boxer5.jpg', '/images/products/boxer6.jpg'],
    category: 'Aube',
    subcategory: 'Sous-vêtements',
    description: ['Boxer confortable et élégant pour un confort optimal au quotidien.', 'Coton biologique de qualité supérieure', 'Coupe ajustée et respirante', 'Ceinture élastique douce'],
    colors: ['Blanc', 'Noir'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  };

  const handleAddToCart = () => {
    addToCart(boxerProduct, selectedSize, selectedColor, quantity);
    alert(`${boxerProduct.name} ajouté au panier !`);
  };

  const handleHeartClick = () => {
    // Temporarily disabled favorites
    console.log('Heart clicked');
  };

  const openModal = (content: any) => {
    setModalContent(content);
    setRightModalOpen(true);
  };

  const closeModal = () => {
    setRightModalOpen(false);
  };

  const getModalTitle = () => {
    switch (modalContent) {
      case 'description': return 'Description';
      case 'sizeGuide': return 'Guide des tailles';
      case 'careGuide': return 'Guide d\'entretien';
      default: return '';
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'description':
        return (
          <div>
            <h3>Composition</h3>
            <ul>
              {boxerProduct.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'sizeGuide':
        return (
          <div>
            <h3>Guide des tailles</h3>
            <p><strong>S</strong> : Tour de taille 70-75cm</p>
            <p><strong>M</strong> : Tour de taille 76-80cm</p>
            <p><strong>L</strong> : Tour de taille 81-85cm</p>
            <p><strong>XL</strong> : Tour de taille 86-90cm</p>
          </div>
        );
      case 'careGuide':
        return (
          <div>
            <h3>Composition et entretien</h3>
            <ul>
              <li>95% coton biologique, 5% élasthanne.</li>
              <li>Lavage en machine à 30°C.</li>
              <li>Pas de blanchiment.</li>
              <li>Séchage à basse température.</li>
              <li>Repassage à basse température.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const underwearProducts = products.filter(product => {
    const isAube = product.category === 'Aube';
    const nameMatch = product.name.toLowerCase().includes('underwear') || 
                     product.name.toLowerCase().includes('sous-vêtement');
    const descriptionMatch = Array.isArray(product.description) 
      ? product.description.some(desc => 
          desc.toLowerCase().includes('underwear') || 
          desc.toLowerCase().includes('sous-vêtement')
        )
      : product.description.toLowerCase().includes('underwear') || 
        product.description.toLowerCase().includes('sous-vêtement');
    return isAube && (nameMatch || descriptionMatch);
  });

  return (
    <>
      <Head>
        <title>Sous-vêtements - Kamba Lhains</title>
        <meta name="description" content="Découvrez nos Sous-vêtements - Fraîcheur et élégance pour vos matinées lumineuses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="aube"
          currentPage="underwear"
          isMenuVisible={isMenuVisible}
          isHoveringMenu={isHoveringMenu}
          showHautSubmenu={showHautSubmenu}
          showBasSubmenu={showBasSubmenu}
          showAccessoiresSubmenu={showAccessoiresSubmenu}
          setShowHautSubmenu={setShowHautSubmenu}
          setShowBasSubmenu={setShowBasSubmenu}
          setShowAccessoiresSubmenu={setShowAccessoiresSubmenu}
          setIsHoveringMenu={setIsHoveringMenu}
        />

        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          {isMenuVisible ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <div className={`main-content ${isMenuVisible ? 'with-sidebar' : 'full-width'}`}>

          {/* Image Section */}
          <section className={styles.newCollectionSection}>
            <div className={styles.mediaSection}>
              <div className={styles.imageContainer}>
                <Image
                  src="/underwear.jpg"
                  alt="Collection Aube - Kamba Lhains"
                  width={1200}
                  height={800}
                  className={styles.collectionImage}
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
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
              Sous-vêtements
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
                  <Link href="/aube" className={productStyles.breadcrumbLink}>
                    <span>Aube</span>
                  </Link>
                  <span> - </span>
                  <Link href="/aube/underwear" className={productStyles.breadcrumbLink}>
                    <span>Sous-vêtements</span>
                  </Link>
                  <span> - </span>
                  <Link href="/aube/underwear" className={productStyles.breadcrumbLink}>
                    <span>Boxer</span>
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
                  {boxerProduct.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`${boxerProduct.name} ${index + 1}`}
                      className={productStyles.stackedImage}
                      onError={(e) => {
                        console.log('Image failed to load:', image);
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info Section - 40% */}
              <div className={productStyles.productInfoSection}>
                {/* Main Content - Centered */}
                <div className={productStyles.productMainContent}>
                  <h1 className={productStyles.productTitle}>{boxerProduct.name}</h1>
                  <span className={productStyles.productPrice}>{boxerProduct.price}</span>
                  
                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        Couleur : {selectedColor}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {boxerProduct.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`${productStyles.colorSwatch} ${selectedColor === color ? productStyles.active : ''}`}
                          style={{ 
                            backgroundColor: color === 'Blanc' ? '#FFFFFF' : color === 'Noir' ? '#000000' : color === 'Gris' ? '#808080' : color,
                            border: color === 'Blanc' ? '1px solid #E5E5E5' : 'none'
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
                      {boxerProduct.sizes.map((size, index) => (
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
                      Guide d'entretien
                    </button>
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
                  .filter(p => ['12', '13', '14', '15'].includes(p.id))
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
                <MobileCarousel products={products.filter(p => ['12', '13', '14', '15'].includes(p.id)).slice(0, 4)} />
              </div>
            </section>
          </section>

        </div>
      </main>

      {/* Modal Overlay */}
      <div 
        className={`${productStyles.modalOverlay} ${rightModalOpen ? productStyles.open : ''}`}
        onClick={closeModal}
      />

      {/* Right Modal (Description, Size Guide, Care Guide) */}
      <div className={`${productStyles.slidingModal} ${productStyles.rightModal} ${rightModalOpen ? productStyles.open : ''}`}>
        <div className={productStyles.modalHeader}>
          <h2 className={productStyles.modalTitle}>{getModalTitle()}</h2>
          <button className={productStyles.closeButton} onClick={closeModal}>
            ×
          </button>
        </div>
        <div className={productStyles.modalContent}>
          {renderModalContent()}
        </div>
      </div>

      <Footer isKambaversPage={true} isMenuVisible={isMenuVisible} />

      <style jsx>{`
        .kambavers-page {
          display: flex;
          min-height: 100vh;
          background: white;
        }

        .menu-toggle {
          position: fixed;
          top: 90px;
          left: 20px;
          z-index: 1001;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          border-radius: 50%;
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
          .main-content.with-sidebar {
            margin-left: 200px;
          }
        }

        @media (max-width: 768px) {
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
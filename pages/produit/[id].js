import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import MobileCarousel from '../../components/MobileCarousel';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { trackViewContent, trackAddToCart } from '../../components/TikTokPixel';
import { useRecommendations } from '../../components/AI/RecommendationEngine';
import { findProductBySlug } from '../../utils/slugify';
import styles from '../../styles/ProductPage.module.css';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('cm');
  const [rightModalOpen, setRightModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const imageStackRef = useRef(null);

  // Générer un sessionId unique pour le système de recommandations
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = sessionStorage.getItem('recommendation_session_id');
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('recommendation_session_id', sid);
      }
      return sid;
    }
    return `session_${Date.now()}`;
  });

  // Utiliser le système de recommandations intelligent
  const { recommendations, isLoading: loadingRecommendations } = useRecommendations(sessionId, 'similar');

  useEffect(() => {
    if (id) {
      // Chercher d'abord par slug, puis par ID (pour rétrocompatibilité)
      let foundProduct = findProductBySlug(products, id);
      if (!foundProduct) {
        foundProduct = products.find(p => p.id.toString() === id);
      }

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
        // Pas de sélection automatique de taille - l'utilisateur doit choisir

        // Track ViewContent event with value parameter
        const price = typeof foundProduct.price === 'string' ? parseFloat(foundProduct.price) : foundProduct.price;
        trackViewContent(foundProduct.id, foundProduct.name, price);
      }
    }
  }, [id]);

  // Infinite scroll pour les images sur mobile
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile || !imageStackRef.current) return;

    const container = imageStackRef.current;
    const images = container.children;
    const imageCount = images.length;

    if (imageCount === 0) return;

    const imageWidth = window.innerWidth;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Si on arrive à la fin, revenir au début
      if (scrollLeft >= maxScroll - 10) {
        isScrolling = true;
        container.scrollLeft = 0;
        setTimeout(() => { isScrolling = false; }, 50);
      }
      // Si on arrive au début (scroll vers la gauche), aller à la fin
      else if (scrollLeft <= 10) {
        isScrolling = true;
        container.scrollLeft = maxScroll;
        setTimeout(() => { isScrolling = false; }, 50);
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    alert(`${product.name} ajouté au panier !`);

    // Track AddToCart event with value parameter
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    trackAddToCart(product.id, product.name, price, quantity);
  };

  const handleHeartClick = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setRightModalOpen(true);
    // Pas de modification d'overflow pour éviter le shift de layout
  };

  const closeModal = () => {
    setRightModalOpen(false);
    // Pas de modification d'overflow pour éviter le shift de layout
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    closeModal();
  };

  const convertToInches = (cm) => {
    return Math.round((cm / 2.54) * 10) / 10;
  };

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
  };

  // Extraire les informations de breadcrumb depuis la description du produit
  const getBreadcrumbInfo = (product) => {
    if (!product || !product.description) return null;

    const descArray = Array.isArray(product.description) ? product.description : [product.description];
    const descString = descArray.join(' ');

    // Chercher le pattern: Collection / Type / Catégorie
    const match = descString.match(/(Aube|Zénith|Crépuscule|Denim) \/ (Haut|Bas) \/ ([^\/\n]+)/);

    if (match) {
      return {
        collection: match[1].trim(),
        type: match[2].trim(),
        category: match[3].trim()
      };
    }

    // Si produit denim, utiliser "Denim" comme collection
    if (product.subCategory === 'denim') {
      // Essayer de déterminer si c'est Haut ou Bas
      const productName = product.name.toLowerCase();
      const isTop = productName.includes('veste') || productName.includes('gilet') || productName.includes('chemise');
      const type = isTop ? 'Haut' : 'Bas';

      let category = 'Produit';
      if (productName.includes('gilet')) category = 'Gilet';
      else if (productName.includes('veste')) category = 'Veste';
      else if (productName.includes('pantalon') || productName.includes('jean') || productName.includes('baggy')) category = 'Pantalon';

      return {
        collection: 'Denim',
        type,
        category
      };
    }

    return null;
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
              {product.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'sizeGuide':
        return (
          <div className={styles.sizeGuideContent}>
            <div className={styles.sizeTable}>
              <table>
                <thead>
                  <tr>
                    <th>Taille (EU)</th>
                    <th>Poitrine (cm)</th>
                    <th>Taille (cm)</th>
                    <th>Hanches (cm)</th>
                    <th>Taille équivalente (US)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', bust: '84 - 88', waist: '66 - 70', hips: '88 - 92', us: '0 - 2' },
                    { size: 'S', bust: '88 - 92', waist: '70 - 75', hips: '92 - 96', us: '4 - 6' },
                    { size: 'M', bust: '92 - 96', waist: '75 - 80', hips: '96 - 100', us: '8 - 10' },
                    { size: 'L', bust: '96 - 100', waist: '80 - 85', hips: '100 - 104', us: '12 - 14' },
                    { size: 'XL', bust: '100 - 104', waist: '85 - 90', hips: '104 - 108', us: '16 - 18' },
                    { size: 'XXL', bust: '104 - 108', waist: '90 - 95', hips: '108 - 112', us: '20 - 22' }
                  ].map((sizeData, index) => {
                    const isAvailable = product.sizes.includes(sizeData.size);

                    return (
                      <tr
                        key={index}
                        className={`${styles.sizeRow} ${isAvailable ? styles.availableSize : ''}`}
                        onClick={() => isAvailable && handleSizeSelect(sizeData.size)}
                      >
                        <td>{sizeData.size}</td>
                        <td>{sizeData.bust}</td>
                        <td>{sizeData.waist}</td>
                        <td>{sizeData.hips}</td>
                        <td>{sizeData.us}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.measurementGuide}>
              <h4>Comment utiliser ce tableau de tailles :</h4>

              <h5>Prendre les bonnes mesures :</h5>
              <p><strong>Poitrine :</strong> Mesure autour de la partie la plus large de ta poitrine.</p>
              <p><strong>Taille :</strong> Mesure autour de la partie la plus fine de ta taille, juste au-dessus du nombril.</p>
              <p><strong>Hanches :</strong> Mesure autour de la partie la plus large des hanches.</p>

              <h5>Choisir la taille :</h5>
              <p>Compare tes mesures avec celles du tableau ci-dessus.</p>
              <p>Si tu te retrouves entre deux tailles, choisis la taille supérieure pour plus de confort ou la taille inférieure pour un ajustement plus ajusté.</p>

              <h5>Exemples d'application :</h5>

              <div className={styles.example}>
                <p><strong>Exemple 1 :</strong></p>
                <p>Poitrine : 90 cm<br/>
                Taille : 72 cm<br/>
                Hanches : 94 cm<br/>
                → Tu corresponds à une taille <strong>S</strong> (environ taille 4-6 US).</p>
              </div>

              <div className={styles.example}>
                <p><strong>Exemple 2 :</strong></p>
                <p>Poitrine : 98 cm<br/>
                Taille : 77 cm<br/>
                Hanches : 100 cm<br/>
                → Tu corresponds à une taille <strong>M</strong> (environ taille 8-10 US).</p>
              </div>

              <div className={styles.example}>
                <p><strong>Exemple 3 :</strong></p>
                <p>Poitrine : 105 cm<br/>
                Taille : 89 cm<br/>
                Hanches : 108 cm<br/>
                → Tu corresponds à une taille <strong>XL</strong> (environ taille 16-18 US).</p>
              </div>

              <h5>Conseils supplémentaires :</h5>
              <p>Si tu préfères une coupe plus ajustée, choisis la taille correspondant exactement à tes mesures.</p>
              <p>Si tu cherches un look plus ample ou oversized, tu peux opter pour une taille plus grande pour un confort maximal.</p>
            </div>

            <div className={styles.customerService}>
              <h4>BESOIN DE CONSEIL ?</h4>
              <p>Le service client est ouvert du lundi au samedi, de 10h à 18h, heure de Paris.</p>
              <p>Notre équipe de conseillers est joignable au numéro suivant pour vous assister : <strong>+33 1 23 45 67 89</strong></p>
            </div>
          </div>
        );
      case 'careGuide':
        return (
          <div>
            <h3>Composition et entretien</h3>
            <ul>
              <li>100% coton recyclé.</li>
              <li>Lavage délicat à 30°C.</li>
              <li>Pas de blanchiment.</li>
              <li>Repassage à basse température sans vapeur.</li>
              <li>Nettoyage à sec possible.</li>
              <li>Ne pas sécher en machine.</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
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
        <title>{product.name} - Kamba Lhains</title>
        <meta name="description" content={`Découvrez ${product.name} de Kamba Lhains. ${product.description[0]}`} />
      </Head>

      <Header />

      <main className={styles.productPage}>
        <div className={styles.productContainer}>
          {/* Image Section - 60% */}
          <div className={styles.productImageSection}>
            {/* Breadcrumb et Heart Icon - overlay sur les images */}
            {product && (
              <>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                  {(() => {
                    const breadcrumbInfo = getBreadcrumbInfo(product);

                    if (breadcrumbInfo) {
                      const { collection, type, category } = breadcrumbInfo;

                      // Déterminer le lien de la collection
                      let collectionLink = '/';
                      if (collection === 'Denim') collectionLink = '/denim';
                      else if (collection === 'Aube') collectionLink = '/aube';
                      else if (collection === 'Zénith') collectionLink = '/zenith';
                      else if (collection === 'Crépuscule') collectionLink = '/crepuscule';

                      return (
                        <>
                          <Link href={collectionLink} className={styles.breadcrumbLink}>
                            <span>{collection}</span>
                          </Link>
                          <span> - </span>
                          <span>{type}</span>
                          <span> - </span>
                          <span>{category}</span>
                        </>
                      );
                    }

                    // Fallback si pas d'info trouvée
                    return <span>{product.name}</span>;
                  })()}
                </div>

                {/* Heart Icon */}
                <button
                  className={`${styles.heartIcon} ${product && isFavorite(product.id) ? styles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={product && isFavorite(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <span className={`u-w-full ${product && isFavorite(product.id) ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${product && !isFavorite(product.id) ? 'u-hidden' : ''} | js-product-heart-remove`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                    </svg>
                  </span>
                </button>
              </>
            )}
            {/* Vertical Image Stack */}
            <div className={styles.imageStack} ref={imageStackRef}>
              {(() => {
                // Determine which images to show based on selected color
                let imagesToShow = product.images || [product.image];

                // If product has imagesByColor and a color is selected, use those images
                if (product.imagesByColor && selectedColor && product.imagesByColor[selectedColor]) {
                  imagesToShow = product.imagesByColor[selectedColor];
                }

                // If product has imagesByColorAndSize and both color and size are selected, use those images
                if (product.imagesByColorAndSize && selectedColor && selectedSize &&
                    product.imagesByColorAndSize[selectedColor] &&
                    product.imagesByColorAndSize[selectedColor][selectedSize]) {
                  imagesToShow = product.imagesByColorAndSize[selectedColor][selectedSize];
                }

                // Pour le scroll infini sur mobile, dupliquer les images
                const isMobile = typeof window !== 'undefined' && (window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
                const displayImages = isMobile ? [...imagesToShow, ...imagesToShow] : imagesToShow;

                return displayImages.length > 0 ? (
                  displayImages.map((image, index) => (
                    <img
                      key={`${selectedColor}-${selectedSize}-${index}`}
                      src={image}
                      alt={`${product.name} ${(index % imagesToShow.length) + 1}`}
                      className={styles.stackedImage}
                      onError={(e) => {
                        console.log('Image failed to load:', image);
                        e.target.src = '/logo.png';
                      }}
                    />
                  ))
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles.stackedImage}
                    onError={(e) => {
                      console.log('Image failed to load:', product.image);
                      e.target.src = '/logo.png';
                    }}
                  />
                );
              })()}
            </div>
          </div>

          {/* Product Info Section - 40% */}
          <div className={styles.productInfoSection}>
            {/* Main Content - Centered */}
            <div className={styles.productMainContent}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <span className={styles.productPrice}>{product.price} EUR</span>
              

              {/* Color Selector */}
              <div className={styles.colorSection}>
                <div className={styles.colorHeader}>
                  <div className={styles.colorLabel}>
                    Couleur : {selectedColor === '#000000' ? 'Noir' :
                               selectedColor === '#FFFFFF' || selectedColor === '#ffffff' ? 'Blanc' :
                               selectedColor === '#A0826D' ? 'Café' :
                               selectedColor === '#8B7355' ? 'Beige' :
                               selectedColor === '#F5E6A3' ? 'Jaune' :
                               selectedColor === '#F4C2C2' ? 'Rose' :
                               selectedColor === '#1E3A8A' ? 'Bleu indigo' :
                               selectedColor === '#F5F5DC' ? 'Blanc cassé' :
                               selectedColor === '#808080' ? 'Gris' :
                               selectedColor === '#800020' ? 'Bordeaux' :
                               selectedColor === '#556B2F' ? 'Kaki' :
                               selectedColor === '#8B4513' ? 'Marron' :
                               selectedColor === '#FF69B4' ? 'Rose' :
                               selectedColor === '#36454F' ? 'Anthracite' :
                               selectedColor === '#0EA5E9' ? 'Bleu ciel' :
                               selectedColor === '#191970' ? 'Bleu nuit' :
                               selectedColor}
                  </div>
                </div>
                <div className={styles.colorOptions}>
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''}`}
                      style={{ 
                        backgroundColor: color
                      }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className={styles.sizeSection}>
                <div className={styles.sizeHeader}>
                  <div className={styles.sizeLabel}>Taille</div>
                </div>
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
              </div>

              {/* Add to Cart Button with Quantity */}
              <div className={styles.addToCartSection}>
                <button className={styles.addToCartButton} onClick={handleAddToCart}>
                  <button 
                    className={styles.quantityButtonInside}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newQuantity = Math.max(1, quantity - 1);
                      setQuantity(newQuantity);
                      if (newQuantity === 1) {
                        setHasClickedPlus(false);
                      }
                    }}
                  >
                    -
                  </button>
                  <span style={{color: 'black'}}>AJOUTER AU PANIER</span>
                  <button 
                    className={styles.quantityButtonInside}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quantity === 1 && !hasClickedPlus) {
                        setHasClickedPlus(true);
                      } else {
                        setQuantity(quantity + 1);
                      }
                    }}
                  >
                    {quantity === 1 && !hasClickedPlus ? '+' : <span style={{fontSize: '14px'}}>{quantity}</span>}
                  </button>
                </button>
              </div>

              {/* Info Links */}
              <div className={styles.infoLinksSection}>
                <button 
                  className={styles.infoLink}
                  onClick={() => openModal('description')}
                >
                  Description
                </button>
                <button 
                  className={styles.infoLink}
                  onClick={() => openModal('sizeGuide')}
                >
                  Guide des tailles
                </button>
                <button 
                  className={styles.infoLink}
                  onClick={() => openModal('careGuide')}
                >
                  Guide d'entretien
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Your Look Section */}
        <section className={styles.completeYourLook}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>DES OPTIONS À EXPLORER</h2>
          </div>
          
          {/* Three Products Grid Section - Using Homepage Style */}
          <section className={styles.threeProductsSection}>
            {/* Desktop Grid */}
            <div className={styles.threeProductsGrid}>
              {(recommendations.length > 0
                ? recommendations.slice(0, 4)
                : products.filter(p => p.id !== product.id).slice(0, 4)
              ).map((recommendedProduct) => (
                  <div key={recommendedProduct.id} className={styles.productSlot}>
                    <ProductCard product={recommendedProduct} />
                  </div>
                ))
              }
            </div>

            {/* Mobile Carousel */}
            <div className={styles.mobileCarousel}>
              <MobileCarousel products={
                recommendations.length > 0
                  ? recommendations.slice(0, 4)
                  : products.filter(p => p.id !== product.id).slice(0, 4)
              } />
            </div>
          </section>
        </section>

        {/* Modal Overlay */}
        <div 
          className={`${styles.modalOverlay} ${rightModalOpen ? styles.open : ''}`}
          onClick={closeModal}
        />

        {/* Right Modal (Description, Size Guide, Care Guide) */}
        <div className={`${styles.slidingModal} ${styles.rightModal} ${rightModalOpen ? styles.open : ''}`}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{getModalTitle()}</h2>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
          </div>
          <div className={styles.modalContent}>
            {renderModalContent()}
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id.toString() === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
        // Pas de sélection automatique de taille - l'utilisateur doit choisir
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    alert(`${product.name} ajouté au panier !`);
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

  const getCategoryName = (subCategory) => {
    switch(subCategory) {
      case 'aube': return 'Aube';
      case 'zenith': return 'Zénith';
      case 'crepuscule': return 'Crépuscule';
      default: return subCategory;
    }
  };

  const getSubCategoryName = (productName) => {
    if (productName.toLowerCase().includes('veste')) return 'Veste';
    if (productName.toLowerCase().includes('jean')) return 'Jean';
    if (productName.toLowerCase().includes('chemise')) return 'Chemise';
    return 'Produit';
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
            <div className={styles.unitToggle}>
              <button 
                className={`${styles.unitOption} ${selectedUnit === 'cm' ? styles.activeUnit : ''}`}
                onClick={() => handleUnitChange('cm')}
              >
                CM
              </button>
              <button 
                className={`${styles.unitOption} ${selectedUnit === 'in' ? styles.activeUnit : ''}`}
                onClick={() => handleUnitChange('in')}
              >
                IN
              </button>
            </div>

            <div className={styles.sizeTable}>
              <table>
                <thead>
                  <tr>
                    <th>TAILLES</th>
                    <th>FR/EU</th>
                    <th>POITRINE</th>
                    <th>TAILLE</th>
                    <th>HANCHES</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', frEu: '44', bust: '88', waist: '72', hips: '88' },
                    { size: 'S', frEu: '46', bust: '92', waist: '76', hips: '92' },
                    { size: 'M', frEu: '48-50', bust: '96', waist: '80', hips: '96' },
                    { size: 'L', frEu: '52', bust: '100', waist: '84', hips: '100' },
                    { size: 'XL', frEu: '54', bust: '104', waist: '88', hips: '104' },
                    { size: 'XXL', frEu: '56', bust: '108', waist: '92', hips: '108' }
                  ].map((sizeData, index) => {
                    const isAvailable = product.sizes.includes(sizeData.size);
                    const displayBust = selectedUnit === 'in' ? convertToInches(parseInt(sizeData.bust)) : sizeData.bust;
                    const displayWaist = selectedUnit === 'in' ? convertToInches(parseInt(sizeData.waist)) : sizeData.waist;
                    const displayHips = selectedUnit === 'in' ? convertToInches(parseInt(sizeData.hips)) : sizeData.hips;
                    
                    return (
                      <tr 
                        key={index}
                        className={`${styles.sizeRow} ${isAvailable ? styles.availableSize : ''}`}
                        onClick={() => isAvailable && handleSizeSelect(sizeData.size)}
                      >
                        <td>{sizeData.size}</td>
                        <td>{sizeData.frEu}</td>
                        <td>{displayBust}</td>
                        <td>{displayWaist}</td>
                        <td>{displayHips}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.measurementGuide}>
              <h4>COMMENT PRENDRE LES MESURES ?</h4>
              <p><strong>Poitrine :</strong> Passer le ruban dans le dos, sous les bras et sur la partie la plus large de la poitrine.</p>
              <p><strong>Taille :</strong> Mesurer autour de la partie la plus étroite de la taille, le ruban doit être ajusté sans être trop serré.</p>
              <p><strong>Hanches :</strong> Mesurer autour de la partie la plus forte des hanches.</p>
              
              <p className={styles.measurementNote}>
                Selon les coupes, de légères différences de mesures pourraient se vérifier.
              </p>
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
        {/* Fixed overlay elements */}
        {product && (
          <>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <Link href="/aube" className={styles.breadcrumbLink}>
                <span>Aube</span>
              </Link>
              <span> - </span>
              <Link href="/denim" className={styles.breadcrumbLink}>
                <span>Denim</span>
              </Link>
              <span> - </span>
              <Link href="/veste" className={styles.breadcrumbLink}>
                <span>Veste</span>
              </Link>
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

        <div className={styles.productContainer}>
          {/* Image Section - 60% */}
          <div className={styles.productImageSection}>
            {/* Vertical Image Stack */}
            <div className={styles.imageStack}>
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
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
              )}
            </div>
          </div>

          {/* Product Info Section - 40% */}
          <div className={styles.productInfoSection}>
            {/* Main Content - Centered */}
            <div className={styles.productMainContent}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <span className={styles.productPrice}>{product.price}</span>
              

              {/* Color Selector */}
              <div className={styles.colorSection}>
                <div className={styles.colorHeader}>
                  <div className={styles.colorLabel}>
                    Couleur : {selectedColor === '#000000' ? 'Noir' : 
                               selectedColor === '#FFFFFF' || selectedColor === '#ffffff' ? 'Blanc' : 
                               selectedColor === '#8B7355' ? 'Beige' :
                               selectedColor === '#F5E6A3' ? 'Jaune' :
                               selectedColor === '#F4C2C2' ? 'Rose' :
                               selectedColor === '#1E3A8A' ? 'Bleu' :
                               selectedColor === '#F5F5DC' ? 'Crème' :
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
              {[
                ...products.filter(p => p.id !== product.id).slice(0, 3),
                products.filter(p => ['12', '13', '14', '15'].includes(p.id))[Math.floor(Math.random() * 4)]
              ].filter(Boolean)
                .map((recommendedProduct) => (
                  <div key={recommendedProduct.id} className={styles.productSlot}>
                    <ProductCard product={recommendedProduct} />
                  </div>
                ))
              }
            </div>
            
            {/* Mobile Carousel */}
            <div className={styles.mobileCarousel}>
              <MobileCarousel products={[
                ...products.filter(p => p.id !== product.id).slice(0, 3),
                products.filter(p => ['12', '13', '14', '15'].includes(p.id))[Math.floor(Math.random() * 4)]
              ].filter(Boolean)} />
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
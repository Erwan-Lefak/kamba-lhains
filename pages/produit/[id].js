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
  const [selectedUnit, setSelectedUnit] = useState('cm');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

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
    setModalOpen(true);
    // Pas de modification d'overflow pour éviter le shift de layout
  };

  const closeModal = () => {
    setModalOpen(false);
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
            <h3>Composition et entretien</h3>
            <ul>
              {product.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Modèle</h3>
            <p>Le modèle mesure 1m75 et porte une taille {product.sizes[1] || product.sizes[0]}</p>
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
              <p><strong>POITRINE :</strong> PASSER LE RUBAN DANS LE DOS, SOUS LES BRAS ET SUR LA PARTIE LA PLUS LARGE DE LA POITRINE.</p>
              <p><strong>TAILLE :</strong> MESURER AUTOUR DE LA PARTIE LA PLUS ÉTROITE DE LA TAILLE, LE RUBAN DOIT ÊTRE AJUSTÉ SANS ÊTRE TROP SERRÉ.</p>
              <p><strong>HANCHES :</strong> MESURER AUTOUR DE LA PARTIE LA PLUS FORTE DES HANCHES.</p>
              
              <p className={styles.measurementNote}>
                SELON LES COUPES, DE LÉGÈRES DIFFÉRENCES DE MESURES POURRAIENT SE VÉRIFIER.
              </p>
            </div>

            <div className={styles.customerService}>
              <h4>BESOIN DE CONSEIL ?</h4>
              <p>LE SERVICE CLIENT EST OUVERT DU LUNDI AU SAMEDI, DE 10H À 18H, HEURE DE PARIS.</p>
              <p>NOTRE ÉQUIPE DE CONSEILLERS EST JOIGNABLE AU NUMÉRO SUIVANT POUR VOUS ASSISTER : <strong>+33 1 23 45 67 89</strong></p>
            </div>
          </div>
        );
      case 'careGuide':
        return (
          <div>
            <h3>Conseils d'entretien</h3>
            <p>Lavage à la main recommandé</p>
            <p>Séchage à plat, à l'abri de la lumière directe</p>
            <p>Repassage à température moyenne</p>
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
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                  >
                    -
                  </button>
                  <span>AJOUTER AU PANIER</span>
                  <button 
                    className={styles.quantityButtonInside}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(quantity + 1);
                    }}
                  >
                    {quantity === 1 ? '+' : <span style={{fontSize: '14px'}}>{quantity}</span>}
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
            <h2 className={styles.sectionTitle}>Complétez votre look</h2>
          </div>
          
          {/* Three Products Grid Section - Using Homepage Style */}
          <section className={styles.threeProductsSection}>
            {/* Desktop Grid */}
            <div className={styles.threeProductsGrid}>
              {products
                .filter(p => p.id !== product.id)
                .slice(0, 3)
                .map((recommendedProduct) => (
                  <div key={recommendedProduct.id} className={styles.productSlot}>
                    <ProductCard product={recommendedProduct} />
                  </div>
                ))
              }
            </div>
            
            {/* Mobile Carousel */}
            <div className={styles.mobileCarousel}>
              <MobileCarousel products={products.filter(p => p.id !== product.id).slice(0, 3)} />
            </div>
          </section>
        </section>

        {/* Modal Overlay */}
        <div 
          className={`${styles.modalOverlay} ${modalOpen ? styles.open : ''}`}
          onClick={closeModal}
        />

        {/* Sliding Modal */}
        <div className={`${styles.slidingModal} ${modalOpen ? styles.open : ''}`}>
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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    
    addToCart(product, selectedSize, selectedColor, 1);
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const getModalTitle = () => {
    switch (modalContent) {
      case 'details': return 'Détails du produit';
      case 'delivery': return 'Livraison et retours';
      case 'help': return 'Aide';
      default: return '';
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'details':
        return (
          <div>
            <h3>Composition et entretien</h3>
            <ul>
              {product.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Conseils d'entretien</h3>
            <p>Lavage à la main recommandé</p>
            <p>Séchage à plat, à l'abri de la lumière directe</p>
            <p>Repassage à température moyenne</p>
            <h3>Modèle</h3>
            <p>Le modèle mesure 1m75 et porte une taille {product.sizes[1] || product.sizes[0]}</p>
          </div>
        );
      case 'delivery':
        return (
          <div>
            <h3>Livraison</h3>
            <p><strong>Livraison standard (3-5 jours ouvrés) :</strong> Gratuite à partir de 150€, sinon 9,90€</p>
            <p><strong>Livraison express (24-48h) :</strong> 19,90€</p>
            <p><strong>Livraison même jour (Paris) :</strong> 29,90€</p>
            
            <h3>Retours</h3>
            <p>Retours gratuits sous 30 jours</p>
            <p>Les articles doivent être dans leur état d'origine avec toutes les étiquettes</p>
            <p>Remboursement sous 5-7 jours ouvrés après réception</p>
            
            <h3>Échanges</h3>
            <p>Échanges gratuits en boutique ou par correspondance</p>
            <p>Service client disponible pour vous accompagner</p>
          </div>
        );
      case 'help':
        return (
          <div>
            <h3>Service client</h3>
            <p><strong>Email :</strong> service@kambalahins.com</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Horaires :</strong> Lundi au vendredi, 9h-18h</p>
            
            <h3>FAQ</h3>
            <p><strong>Comment connaître ma taille ?</strong><br/>
            Utilisez notre guide des tailles disponible sur chaque fiche produit.</p>
            
            <p><strong>Puis-je modifier ma commande ?</strong><br/>
            Contactez-nous dans les 2h suivant votre commande.</p>
            
            <p><strong>Les produits sont-ils authentiques ?</strong><br/>
            Tous nos produits sont 100% authentiques et proviennent directement du créateur.</p>
            
            <h3>Boutiques</h3>
            <p>Retrouvez nos boutiques à Paris, Lyon, et Marseille</p>
            <p>Prendre rendez-vous en boutique pour un essayage personnalisé</p>
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
            {/* Main Image */}
            <div className={styles.mainImageContainer}>
              <img 
                src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : product.image}
                alt={product.name}
                className={styles.productImage}
                onError={(e) => {
                  console.log('Image failed to load:', product.image);
                  e.target.src = '/logo.png';
                }}
              />
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
            </div>

            {/* Image Gallery */}
            {product.images && product.images.length > 1 && (
              <div className={styles.imageGallery}>
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`${styles.thumbnailContainer} ${currentImageIndex === index ? styles.active : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className={styles.thumbnailImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section - 40% */}
          <div className={styles.productInfoSection}>
            {/* Main Content - Centered */}
            <div className={styles.productMainContent}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <span className={styles.productPrice}>{product.price}</span>
              
              <p className={styles.productDescription}>
                {product.category === 'femme' ? 'Robe boutonnée en maille' : 'Veste non doublée en lin'}
              </p>

              {/* Color Selector */}
              <div className={styles.colorSection}>
                <div className={styles.colorHeader}>
                  <div className={styles.colorLabel}>
                    {selectedColor === 'Blanc' || selectedColor === 'Beige' ? 'Print Stripes White/Yellow/Black' : selectedColor}
                  </div>
                  <div className={styles.seeAllColors}>Voir les couleurs</div>
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
              </div>

              {/* Size Selector */}
              <div className={styles.sizeSection}>
                <div className={styles.sizeHeader}>
                  <div className={styles.sizeLabel}>Taille</div>
                  <div className={styles.sizeGuide}>Guide des tailles</div>
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

              {/* Add to Cart Button */}
              <div className={styles.addToCartSection}>
                <button className={styles.addToCartButton} onClick={handleAddToCart}>
                  <span>AJOUTER AU PANIER</span>
                </button>
              </div>
            </div>

            {/* Tabs Section - Fixed at Bottom */}
            <div className={styles.tabsSection}>
              <div className={styles.tabsContainer}>
                <div className={styles.tabsNav}>
                  <button 
                    className={styles.tab}
                    onClick={() => openModal('details')}
                  >
                    Détails
                  </button>
                  <button 
                    className={styles.tab}
                    onClick={() => openModal('delivery')}
                  >
                    Livraison et retours
                  </button>
                  <button 
                    className={styles.tab}
                    onClick={() => openModal('help')}
                  >
                    Aide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Your Look Section */}
        <section className={styles.completeYourLook}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>Complétez votre look</h2>
            <div className={styles.recommendedProducts}>
              {/* Get other products excluding current one */}
              {products
                .filter(p => p.id !== product.id)
                .slice(0, 3)
                .map((recommendedProduct) => (
                  <Link 
                    key={recommendedProduct.id} 
                    href={`/produit/${recommendedProduct.id}`} 
                    className={styles.recommendedProduct}
                  >
                    <div className={styles.productImageWrapper}>
                      <img 
                        src={recommendedProduct.image} 
                        alt={recommendedProduct.name} 
                        className={styles.recommendedProductImage}
                      />
                      <div className={styles.productOverlay}>
                        <div className={styles.productName}>{recommendedProduct.name}</div>
                        <div className={styles.productPrice}>{recommendedProduct.price}</div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
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
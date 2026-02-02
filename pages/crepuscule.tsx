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
import { useLanguage } from '../contexts/LanguageContext';
import { getColorTranslation } from '../utils/translations';
import styles from '../styles/HomePage.module.css';
import productStyles from '../styles/ProductPage.module.css';

export default function Crepuscule() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState('cm');
  const [randomProducts, setRandomProducts] = useState<any[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  // Récupérer le produit voile de corps (id: "3")
  const voileProduct = products.find(product => product.id === '3');

  // Fonction pour mélanger un tableau de manière aléatoire
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize random products and default color on client side only
  useEffect(() => {
    const shuffled = shuffleArray(products.filter(p => p.inStock && p.id !== '3')).slice(0, 4);
    setRandomProducts(shuffled);
    // Set default color to first available color
    if (voileProduct && voileProduct.colors && voileProduct.colors.length > 0) {
      setSelectedColor(voileProduct.colors[0]);
    }
  }, [voileProduct]);

  if (!voileProduct) {
    return <div>Produit non trouvé</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setShowAlert(true);
      return;
    }
    addToCart(voileProduct, selectedSize, selectedColor, quantity);
  };

  const handleHeartClick = () => {
    if (!voileProduct) return;

    if (isFavorite(voileProduct.id, selectedColor)) {
      removeFromFavorites(voileProduct.id, selectedColor);
    } else {
      addToFavorites(voileProduct, selectedColor, selectedSize || undefined);
    }
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
      '#9f0909': 'Bordeaux',
      '#556B2F': 'Kaki',
      '#FF69B4': 'Rose',
    };
    return colorMap[color] || color;
  };

  // Fonction pour convertir le nom de couleur en code hex
  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Noir': '#000000',
      'Marron': '#8B4513',
      'Rouge': '#9f0909',
      'Bordeaux': '#800020',
      'Kaki': '#556B2F',
      'Rose': '#FF69B4',
    };
    return colorMap[colorName] || colorName;
  };

  return (
    <>
      <Head>
        <title>Crépuscule - Kamba Lhains</title>
        <meta name="description" content={t('meta.crepuscule')} />
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
                {t('products.breadcrumb.crepuscule')}
              </h1>
              <p className={styles.collectionDescription}>
                {t('collections.crepuscule')}
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
                  {t('collections.crepusculeSection2')}
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
              {t('products.page.allProducts')}
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
                    <span>{t('products.breadcrumb.crepuscule')}</span>
                  </Link>
                  <span> - </span>
                  <Link href="/crepuscule" className={productStyles.breadcrumbLink}>
                    <span>{t('products.breadcrumb.voileDeCorps')}</span>
                  </Link>
                </div>

                {/* Heart Icon - Positioned absolutely */}
                <button
                  className={`${productStyles.heartIcon} ${voileProduct && isFavorite(voileProduct.id, selectedColor) ? productStyles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={voileProduct && isFavorite(voileProduct.id, selectedColor) ? t('products.removeFromFavorites') : t('products.addToFavorites')}
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
                  <span className={`u-w-full ${voileProduct && isFavorite(voileProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${!voileProduct || !isFavorite(voileProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-remove`}>
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

                    return imagesToShow.map((image, index) => {
                      const imageUrl = typeof image === 'string' ? image : image.url;
                      return (
                      <Image width={600} height={750} key={index}
                        src={imageUrl}
                        alt={`${voileProduct.name} ${index + 1}`}
                        className={productStyles.stackedImage}
                        onError={(e) => {
                          console.log('Image failed to load:', imageUrl);
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
                    );
                    });
                  })()}
                </div>
              </div>

              {/* Product Info Section - 40% */}
              <div className={productStyles.productInfoSection}>
                {/* Main Content - Centered */}
                <div className={productStyles.productMainContent}>
                  <h1 className={productStyles.productTitle}>{currentLanguage === 'en' && voileProduct.nameEn ? voileProduct.nameEn : voileProduct.name}</h1>
                  <span className={productStyles.productPrice}>{voileProduct.price} EUR</span>

                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        {t('products.page.colorLabel')} {getColorTranslation(selectedColor, currentLanguage)}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {voileProduct.colors?.map((color, index) => {
                        const colorHex = getColorHex(color);
                        return (
                          <div
                            key={index}
                            className={`${productStyles.colorSwatch} ${selectedColor === color ? productStyles.active : ''}`}
                            style={{
                              backgroundColor: colorHex,
                              border: colorHex === '#FFFFFF' ? '1px solid #E5E5E5' : 'none'
                            }}
                            onClick={() => setSelectedColor(color)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className={productStyles.sizeSection}>
                    <div className={productStyles.sizeHeader}>
                      <div className={productStyles.sizeLabel}>{t('products.page.sizeLabel')}</div>
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
                    <button className={productStyles.addToCartButton} onClick={handleAddToCart}>
                      <div
                        className={productStyles.quantityButtonInside}
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
                      </div>
                      <div style={{flex: 1, color: 'black'}}>
                        <span>{t('products.page.addToCartButton')}</span>
                      </div>
                      <div
                        className={productStyles.quantityButtonInside}
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
                      </div>
                    </button>
                  </div>

                  {/* Info Links */}
                  <div className={productStyles.infoLinksSection}>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('description')}
                    >
                      {t('products.page.descriptionBtn')}
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('sizeGuide')}
                    >
                      {t('products.page.sizeGuideBtn')}
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('careGuide')}
                    >
                      {t('products.page.careGuideBtn')}
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('deliveryTime')}
                    >
                      {t('products.page.deliveryTimeBtn')}
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('returnPolicy')}
                    >
                      {t('products.page.returnPolicyBtn')}
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('klarna')}
                    >
                      Paiement en plusieurs fois
                    </button>
                  </div>

                  {/* Product Description */}
                  <div className={productStyles.productDescription}>
                    {(Array.isArray(voileProduct.description) ? voileProduct.description : [voileProduct.description]).map((line, index) => (
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
              <h2 className={productStyles.sectionTitle}>{t('products.page.recommendedOptions')}</h2>
            </div>

            {/* Three Products Grid Section - Using ProductPage Style */}
            <section className={productStyles.threeProductsSection}>
              {/* Desktop Grid */}
              <div className={productStyles.threeProductsGrid}>
                {randomProducts.map((recommendedProduct) => (
                  <div key={recommendedProduct.id} className={productStyles.productSlot}>
                    <ProductCard product={recommendedProduct} />
                  </div>
                ))}
              </div>

              {/* Mobile Carousel */}
              <div className={productStyles.mobileCarousel}>
                <MobileCarousel products={randomProducts} />
              </div>
            </section>
          </section>
        </div>
      </main>

      {/* Modal Overlay */}
      <div
        className={`${productStyles.modalOverlay} ${modalType ? productStyles.open : ''}`}
        onClick={closeModal}
      />

      {/* Right Modal */}
      <div className={`${productStyles.slidingModal} ${productStyles.rightModal} ${modalType ? productStyles.open : ''}`}>
        <div className={productStyles.modalHeader}>
          <h2 className={productStyles.modalTitle}>
            {modalType === 'description' && t('products.page.descriptionBtn')}
            {modalType === 'sizeGuide' && t('products.page.sizeGuideBtn')}
            {modalType === 'careGuide' && t('products.page.careGuideBtn')}
            {modalType === 'deliveryTime' && t('products.page.deliveryTimeBtn')}
            {modalType === 'returnPolicy' && t('products.page.returnPolicyBtn')}
            {modalType === 'klarna' && 'Paiement en plusieurs fois'}
          </h2>
          <button className={productStyles.closeButton} onClick={closeModal}>
            ×
          </button>
        </div>
        <div className={productStyles.modalContent}>
          {modalType === 'description' && voileProduct && (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Aérien et métamorphique, ce voile modulable épouse le corps comme une seconde peau en perpétuelle transformation. Sa maille fine, presque diaphane, se plisse, se superpose ou se déroule pour redessiner la silhouette selon l'humeur : long drapé solennel, version raccourcie plus incisive, ou simple haut fluide, porté avec une désinvolture étudiée.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Le col, pensé comme une architecture mobile, s'élève en capuche et confère à l'ensemble une élégance profondément parisienne — celle des silhouettes nocturnes glissant entre les ruelles de Montmartre, mi-fugue mi-mystère.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Ici, la matière devient souffle : un espace de liberté totale, où l'on choisit d'exposer ou de suggérer, de s'effacer ou de rayonner. La maille, mouvante et respirante, instaure un rapport intime avec la peau, dans un jeu subtil entre transparence, rythme et retenue.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : modulable, ajustable par plis et drapés
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Volume : variable — du long étiré au court réinterprété
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Col : structure mobile pouvant se porter relevé ou en capuche
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Matière : maille légère, respirante, transparente
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Usage : pièce libre, personnalisable, pensée pour réinventer la silhouette
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : allures nocturnes parisiennes, liberté sculpturale, sensualité maîtrisée
                </li>
              </ul>
            </div>
          )}
          {modalType === 'sizeGuide' && voileProduct && (
            <div className={productStyles.sizeGuideContent}>
              <div className={productStyles.sizeTable}>
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
                      const isAvailable = voileProduct.sizes?.includes(sizeData.size);

                      return (
                        <tr
                          key={index}
                          className={`${productStyles.sizeRow} ${isAvailable ? productStyles.availableSize : ''}`}
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

              <div className={productStyles.measurementGuide}>
                <h4>Comment utiliser ce tableau de tailles :</h4>

                <h5>Prendre les bonnes mesures :</h5>
                <p><strong>Poitrine :</strong> Mesure autour de la partie la plus large de ta poitrine.</p>
                <p><strong>Taille :</strong> Mesure autour de la partie la plus fine de ta taille, juste au-dessus du nombril.</p>
                <p><strong>Hanches :</strong> Mesure autour de la partie la plus large des hanches.</p>

                <h5>Choisir la taille :</h5>
                <p>Compare tes mesures avec celles du tableau ci-dessus.</p>
                <p>Si tu te retrouves entre deux tailles, choisis la taille supérieure pour plus de confort ou la taille inférieure pour un ajustement plus ajusté.</p>

                <h5>Exemples d'application :</h5>

                <div className={productStyles.example}>
                  <p><strong>Exemple 1 :</strong></p>
                  <p>Poitrine : 90 cm<br/>
                  Taille : 72 cm<br/>
                  Hanches : 94 cm<br/>
                  → Tu corresponds à une taille <strong>S</strong> (environ taille 4-6 US).</p>
                </div>

                <div className={productStyles.example}>
                  <p><strong>Exemple 2 :</strong></p>
                  <p>Poitrine : 98 cm<br/>
                  Taille : 77 cm<br/>
                  Hanches : 100 cm<br/>
                  → Tu corresponds à une taille <strong>M</strong> (environ taille 8-10 US).</p>
                </div>

                <div className={productStyles.example}>
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
            </div>
          )}
          {modalType === 'careGuide' && (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 97% Polyamide ; 3% Elastane
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Lavage à 30 °C – cycle délicat
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Ne pas blanchir
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Ne pas utiliser le sèche-linge
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Repassage à température faible, idéalement steamer
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginBottom: '20px', marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          )}

          {modalType === 'deliveryTime' && (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Chaque pièce Kamba Lhains est confectionnée sur commande dans nos ateliers parisiens. Ce processus artisanal garantit une qualité exceptionnelle et une attention minutieuse aux détails.
              </p>
              <p style={{ marginBottom: '20px' }}>
                <strong>Délai de fabrication :</strong> 15 jours à compter de la validation de votre commande.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Une fois votre pièce terminée, elle sera expédiée sous 24 à 48 heures. Vous recevrez un email de confirmation avec le numéro de suivi de votre colis.
              </p>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Ce délai nous permet de créer votre vêtement avec le soin et l'expertise qu'il mérite, tout en réduisant notre impact environnemental grâce à une production à la demande.
              </p>
            </div>
          )}

          {modalType === 'returnPolicy' && (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Vous disposez de <strong>30 jours</strong> pour retourner ou échanger tout article qui ne vous conviendrait pas.
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>CONDITIONS DE RETOUR</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Les articles doivent être dans leur état d'origine, non portés et non lavés
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Toutes les étiquettes doivent être présentes et attachées
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Retours gratuits pour la France métropolitaine
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Remboursement sous 5 à 7 jours ouvrés après réception du retour
                </li>
              </ul>

              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>COMMENT RETOURNER</h3>
              <p style={{ marginBottom: '15px' }}>
                1. Connectez-vous à votre compte et accédez à "Mes commandes"<br />
                2. Sélectionnez la commande et cliquez sur "Demander un retour"<br />
                3. Vous recevrez une étiquette de retour par email<br />
                4. Déposez votre colis dans un point relais
              </p>

              <p style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                <strong>Articles non retournables :</strong> Pour des raisons d'hygiène, les sous-vêtements ne peuvent être ni repris ni échangés, sauf en cas de défaut de fabrication.
              </p>

              <p style={{ marginTop: '20px', color: '#666' }}>
                Pour toute question, contactez notre service client via votre compte ou consultez notre <a href="/retours" style={{ textDecoration: 'underline', color: '#000' }}>page retours complète</a>.
              </p>
            </div>
          )}

          {modalType === 'klarna' && (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Klarna est un service de paiement flexible qui vous permet de payer en plusieurs fois. Sélectionnez simplement Klarna au moment du paiement lorsque cette option est disponible et nous vérifierons rapidement vos informations pour terminer la commande.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Vous pouvez suivre et gérer tous vos paiements dans l'app Klarna, avec des rappels pour vous aider à respecter vos échéances.
              </p>

              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>CONDITIONS D'UTILISATION</h3>
              <p style={{ marginBottom: '15px' }}>Pour utiliser Klarna, vous devez :</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Habiter en France
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Avoir minimum 18 ans
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Posséder un compte bancaire valide
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Avoir un historique de crédit positif
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Être en mesure de recevoir des codes de vérification par SMS
                </li>
              </ul>

              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>SÉCURITÉ</h3>
              <p style={{ marginBottom: '15px' }}>Les normes de sécurité les plus strictes sont utilisées pour protéger vos données et vos informations personnelles.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Toutes les informations de paiement sont traitées de manière sécurisée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Le magasin ne transfère et ne conserve aucune information
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Toutes les transactions s'effectuent via des connexions sécurisées conformes à des protocoles de sécurité stricts
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Vous pouvez à tout moment supprimer le compte bancaire ou la carte bancaire associée
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

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

        @media (max-width: 768px) {
          .sidebar-menu {
            transition: none;
          }
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
          left: 136px;
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
            top: 80px;
            height: calc(100vh - 80px);
            z-index: 999;
          }

          .menu-toggle {
            top: 90px;
            left: 15px;
            z-index: 1101;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
          }
        }

        .alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
        }
        .alert-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 30px;
          z-index: 10001;
          min-width: 300px;
          max-width: 90%;
          text-align: center;
          font-family: 'Manrope', sans-serif;
        }
        .alert-modal p {
          margin: 0 0 20px 0;
          font-size: 11px;
          font-weight: 400;
          text-transform: uppercase;
          color: black;
        }
        .alert-modal button {
          width: 100%;
          padding: 8px 16px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 9px;
          font-weight: 400;
          text-transform: uppercase;
          font-family: 'Manrope', sans-serif;
          transition: background-color 0.3s;
        }
        .alert-modal button:hover {
          background: #333;
        }
      `}</style>

      {/* Alert Modal */}
      {showAlert && (
        <>
          <div className="alert-overlay" onClick={() => setShowAlert(false)} />
          <div className="alert-modal">
            <p>{t('products.page.selectSizeColorAlert')}</p>
            <button onClick={() => setShowAlert(false)}>OK</button>
          </div>
        </>
      )}
    </>
  );
}
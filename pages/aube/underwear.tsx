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
import { useFavorites } from '../../contexts/FavoritesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getColorTranslation } from '../../utils/translations';
import styles from '../../styles/HomePage.module.css';
import productStyles from '../../styles/ProductPage.module.css';

export default function AubeUnderwear() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(false);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(true);
  
  // Product page states
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [rightModalOpen, setRightModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [randomProducts, setRandomProducts] = useState<any[]>([]);

  // Fonction pour mélanger un tableau de manière aléatoire
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setIsMenuVisible(false);
    // Initialize random products on client side only
    const shuffled = shuffleArray(
      products.filter(p => p.inStock && p.id !== 'calecon-champion')
    ).slice(0, 4);
    setRandomProducts(shuffled);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Product page functions - utiliser le produit depuis products.ts
  const caleconProduct = products.find(p => p.id === 'calecon-champion') || {
    id: 'calecon-champion',
    name: 'CALEÇON CHAMPION',
    nameEn: 'CHAMPION UNDERPANTS',
    price: 90,
    image: '/images/calecon-blanc-face.jpg',
    images: ['/images/calecon-blanc-face.jpg'],
    category: 'homme',
    subCategory: 'aube',
    description: ['Caleçon en percale'],
    colors: ['#FFFFFF'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  };

  const handleAddToCart = () => {
    addToCart(caleconProduct, selectedSize, selectedColor, quantity);
  };

  const handleHeartClick = () => {
    if (!caleconProduct) return;

    if (isFavorite(caleconProduct.id, selectedColor)) {
      removeFromFavorites(caleconProduct.id, selectedColor);
    } else {
      addToFavorites(caleconProduct, selectedColor, selectedSize || undefined);
    }
  };

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Beige': '#8B7355',
      'Marron': '#8B4513',
      'Rouge': '#9f0909',
      'Bordeaux': '#800020',
      'Kaki': '#556B2F',
      'Rose': '#FF69B4',
    };
    return colorMap[colorName] || colorName;
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
      case 'deliveryTime': return 'Délai de livraison';
      case 'returnPolicy': return 'Retour et remboursement';
      case 'klarna': return 'Paiement en plusieurs fois';
      default: return '';
    }
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'description':
        return (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '20px' }}>
              Découvrez ce caleçon boxer non genré conçu pour offrir un confort optimal au quotidien. Réalisé dans une matière légère et douce, il présente une coupe ample qui assure une grande liberté de mouvement et un porté aérien. Sa taille haute élastiquée, ornée d'un patch logo contrasté à l'avant, lui confère une allure moderne et minimaliste.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Ce modèle revisite l'esthétique du boxer classique avec une approche plus contemporaine et polyvalente. Sa silhouette fluide en fait une pièce idéale aussi bien pour la détente que pour compléter un look épuré ou casual premium. Confortable, facile à porter et pensé pour toutes les identités, ce boxer devient un essentiel du vestiaire non genré.
            </p>
            <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Coupe : ample et aérienne
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Taille : haute, élastiquée
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Logo : patch contrasté sur la ceinture
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Couleur disponible : blanc
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Style : minimaliste, casual, quotidien, détente
              </li>
            </ul>
          </div>
        );
      case 'sizeGuide':
        return (
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
                    const isAvailable = caleconProduct.sizes?.includes(sizeData.size);

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
        );
      case 'careGuide':
        return (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>{t('products.careGuide.title')}</h3>
            <p style={{ marginBottom: '20px' }}>
              {t('products.careGuide.cottonJersey')}<br />
              {t('products.careGuide.waistband')}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.careGuide.washTemp')}
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.careGuide.nobleach')}
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.careGuide.noDryer')}
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.careGuide.ironLow')}
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.careGuide.noDryCleaning')}
              </li>
            </ul>
            <p style={{ marginBottom: '20px', marginTop: '-15px' }}>
              {t('products.careGuide.materialsIntro')}
            </p>
            <p style={{ marginBottom: '20px' }}>
              {t('products.careGuide.sustainabilityText')}
            </p>
          </div>
        );
      case 'deliveryTime':
        return (
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
        );
      case 'returnPolicy':
        return (
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
        );
      case 'klarna':
        return (
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
            <div className={styles.mediaSection} style={{ width: '100%' }}>
              <div className="underwear-images-container">
                <div className="underwear-image-wrapper">
                  <Image
                    src="/images/underwear-hero-new.jpg?v=5"
                    alt="Collection Aube - Kamba Lhains"
                    width={1200}
                    height={800}
                    className={styles.collectionImage}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
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
                    <span>Caleçon</span>
                  </Link>
                </div>
                
                {/* Heart Icon - Positioned absolutely */}
                <button
                  className={`${productStyles.heartIcon} ${caleconProduct && isFavorite(caleconProduct.id, selectedColor) ? productStyles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={caleconProduct && isFavorite(caleconProduct.id, selectedColor) ? "Retirer des favoris" : "Ajouter aux favoris"}
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
                  <span className={`u-w-full ${caleconProduct && isFavorite(caleconProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${!caleconProduct || !isFavorite(caleconProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-remove`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                    </svg>
                  </span>
                </button>
                
                {/* Vertical Image Stack */}
                <div className={productStyles.imageStack}>
                  {caleconProduct.images?.map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    return (
                    <Image width={600} height={750} key={index}
                      src={imageUrl}
                      alt={`${caleconProduct.name} ${index + 1}`}
                      className={productStyles.stackedImage}
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  );
                  })}
                </div>
              </div>

              {/* Product Info Section - 40% */}
              <div className={productStyles.productInfoSection}>
                {/* Main Content - Centered */}
                <div className={productStyles.productMainContent}>
                  <h1 className={productStyles.productTitle}>{currentLanguage === 'en' && caleconProduct.nameEn ? caleconProduct.nameEn : caleconProduct.name}</h1>
                  <span className={productStyles.productPrice}>{caleconProduct.price} EUR</span>
                  
                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        {t('products.page.colorLabel')} {getColorTranslation(selectedColor, currentLanguage)}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {caleconProduct.colors?.map((color, index) => {
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
                      {caleconProduct.sizes?.map((size, index) => (
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

                  {/* Klarna Payment Image */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '-25px', marginBottom: '0' }}>
                    <img
                      src="/images/paiement-klarna.jpg"
                      alt="Paiement en plusieurs fois avec Klarna"
                      style={{ maxWidth: '200px', height: 'auto' }}
                    />
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
                        <span>{t('products.page.addToCartButton')}</span>
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
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('deliveryTime')}
                    >
                      Délai de livraison
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('returnPolicy')}
                    >
                      Retour et remboursement
                    </button>
                    <button
                      className={productStyles.infoLink}
                      onClick={() => openModal('klarna')}
                    >
                      Paiement en plusieurs fois
                    </button>
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
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
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
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .main-content.full-width {
          margin-left: 0;
        }

        .main-content.with-sidebar {
          margin-left: 250px;
        }

        .underwear-images-container {
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;
          max-width: 100%;
        }

        .underwear-image-wrapper {
          flex: 1;
          height: 100%;
          overflow: hidden;
          max-width: 100%;
        }

        .underwear-image-wrapper img {
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
          object-fit: cover;
          object-position: center;
        }

        @media (max-width: 1024px) {
          .main-content.with-sidebar {
            margin-left: 200px;
          }
        }

        @media (max-width: 768px) {
          .kambavers-page {
            overflow-x: hidden;
            max-width: 100vw;
          }

          .menu-toggle {
            top: 90px;
            left: 15px;
          }

          .main-content {
            margin-left: 0 !important;
            padding-top: 80px;
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 0;
            padding-right: 0;
            overflow-x: hidden;
          }

          .main-content > * {
            max-width: 100vw;
            overflow-x: hidden;
          }

          .underwear-images-container {
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 100vw;
          }

          .underwear-image-wrapper {
            width: 100%;
            max-width: 100%;
            height: auto;
          }

          .underwear-image-wrapper img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            object-fit: contain;
            object-position: center top;
          }
        }
      `}</style>
    </>
  );
}
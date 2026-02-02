import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

export default function Pantalon() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(true);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(false);

  // Fonction pour mélanger un tableau de manière aléatoire
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Get sweatpants product (must be before useEffect)
  const sweatpantsProduct = products.find(p => p.id === 'asabili-sweatpants') || {
    id: 'asabili-sweatpants',
    name: 'BAS DE SURVÊTEMENT ASABILI',
    nameEn: 'ASABILI SWEATPANTS',
    price: 180,
    image: '/images/sweatpant-bordeaux-2.jpg',
    images: ['/images/sweatpant-bordeaux-2.jpg'],
    category: 'femme',
    subCategory: 'aube',
    description: ['Sweatpants en coton premium'],
    colors: ['#800020', '#F5F5DC', '#808080', '#556B2F'],
    sizes: ['S', 'M'],
    inStock: true,
    featured: false
  };

  // Product page states
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [hasClickedPlus, setHasClickedPlus] = useState(false);
  const [rightModalOpen, setRightModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const [randomProducts, setRandomProducts] = useState<any[]>([]);

  // Cacher le menu immédiatement quand on arrive sur la page
  useEffect(() => {
    setIsMenuVisible(false);
    // Initialize with default images
    if (sweatpantsProduct.images) {
      const imageUrls = Array.isArray(sweatpantsProduct.images)
        ? sweatpantsProduct.images.map(img => typeof img === 'string' ? img : img.url)
        : [];
      setDisplayedImages(imageUrls);
    }
    // Initialize random products on client side only
    const shuffled = shuffleArray(products.filter(p => p.subCategory === 'aube' && p.id !== 'asabili-sweatpants' && p.inStock)).slice(0, 4);
    setRandomProducts(shuffled);
  }, []);

  // Update displayed images when color changes
  useEffect(() => {
    if (sweatpantsProduct.imagesByColor && selectedColor) {
      const colorImages = sweatpantsProduct.imagesByColor[selectedColor];
      if (colorImages && colorImages.length > 0) {
        setDisplayedImages(colorImages);
      }
    }
  }, [selectedColor]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleAddToCart = () => {
    addToCart(sweatpantsProduct, selectedSize, selectedColor, quantity);
  };

  const handleHeartClick = () => {
    if (!sweatpantsProduct) return;

    if (isFavorite(sweatpantsProduct.id, selectedColor)) {
      removeFromFavorites(sweatpantsProduct.id, selectedColor);
    } else {
      addToFavorites(sweatpantsProduct, selectedColor, selectedSize || undefined);
    }
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
      case 'description': return t('products.page.descriptionBtn');
      case 'sizeGuide': return t('products.page.sizeGuideBtn');
      case 'careGuide': return t('products.page.careGuideBtn');
      case 'deliveryTime': return t('products.page.deliveryTimeBtn');
      case 'returnPolicy': return t('products.page.returnPolicyBtn');
      case 'klarna': return 'Paiement en plusieurs fois';
      default: return '';
    }
  };

  const getColorHex = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'Rouge': '#9f0909',
      'Bordeaux': '#800020',
      'Beige': '#F5F5DC',
      'Gris': '#808080',
      'Kaki': '#556B2F'
    };
    return colorMap[colorName] || colorName;
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case 'description':
        return (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '20px' }}>
              Adoptez un style moderne et confortable avec ce sweatpants non-genré décliné en bordeaux, gris, kaki et beige. Confectionné dans une matière épaisse et douce, il offre une coupe ample pour une aisance maximale au quotidien. Sa taille haute élastiquée, dotée d'un large bandeau froncé et d'un patch logo contrasté à l'avant, lui apporte une identité visuelle forte et contemporaine.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Les grandes poches plaquées aux ouvertures latérales ajoutent fonctionnalité et praticité, tandis que la jambe courbé et fluide crée une silhouette à la fois décontractée et soignée. Idéal pour un look streetwear, lifestyle ou casual premium.
            </p>
            <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Coupe : ample et confortable
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Taille : haute, élastiquée et froncée
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Poches : deux poches latérales
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Logo : patch contrasté sur la ceinture
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Couleurs disponibles : bordeaux, gris, kaki, beige
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Style : streetwear, casual, quotidien
              </li>
            </ul>
          </div>
        );
      case 'sizeGuide':
        return (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '20px', fontSize: '11px', textTransform: 'uppercase' }}>{t('products.sizeGuide.title')}</h3>

            <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '11px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{t('products.sizeGuide.sizeEU')}</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{t('products.sizeGuide.sizeUS')}</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{t('products.sizeGuide.chest')}</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{t('products.sizeGuide.waist')}</th>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>{t('products.sizeGuide.hips')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>XS</td>
                    <td style={{ padding: '12px 8px' }}>XS</td>
                    <td style={{ padding: '12px 8px' }}>84-88</td>
                    <td style={{ padding: '12px 8px' }}>64-68</td>
                    <td style={{ padding: '12px 8px' }}>88-92</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>S</td>
                    <td style={{ padding: '12px 8px' }}>S</td>
                    <td style={{ padding: '12px 8px' }}>88-92</td>
                    <td style={{ padding: '12px 8px' }}>68-72</td>
                    <td style={{ padding: '12px 8px' }}>92-96</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>M</td>
                    <td style={{ padding: '12px 8px' }}>M</td>
                    <td style={{ padding: '12px 8px' }}>92-96</td>
                    <td style={{ padding: '12px 8px' }}>72-76</td>
                    <td style={{ padding: '12px 8px' }}>96-100</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>L</td>
                    <td style={{ padding: '12px 8px' }}>L</td>
                    <td style={{ padding: '12px 8px' }}>96-100</td>
                    <td style={{ padding: '12px 8px' }}>76-80</td>
                    <td style={{ padding: '12px 8px' }}>100-104</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>XL</td>
                    <td style={{ padding: '12px 8px' }}>XL</td>
                    <td style={{ padding: '12px 8px' }}>100-104</td>
                    <td style={{ padding: '12px 8px' }}>80-84</td>
                    <td style={{ padding: '12px 8px' }}>104-108</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 8px' }}>XXL</td>
                    <td style={{ padding: '12px 8px' }}>XXL</td>
                    <td style={{ padding: '12px 8px' }}>104-108</td>
                    <td style={{ padding: '12px 8px' }}>84-88</td>
                    <td style={{ padding: '12px 8px' }}>108-112</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px' }}>{t('products.sizeGuide.measurementsTitle')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px' }}>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.chestMeasure')}
              </li>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.waistMeasure')}
              </li>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.hipsMeasure')}
              </li>
            </ul>

            <h4 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px' }}>{t('products.sizeGuide.chooseSizeTitle')}</h4>
            <p style={{ marginBottom: '25px' }}>
              {t('products.sizeGuide.chooseSizeText')}
            </p>

            <h4 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px' }}>{t('products.sizeGuide.examplesTitle')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '25px' }}>
              <li style={{ marginBottom: '15px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: 0 }}>1.</span>
                {t('products.sizeGuide.example1')}
              </li>
              <li style={{ marginBottom: '15px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: 0 }}>2.</span>
                {t('products.sizeGuide.example2')}
              </li>
              <li style={{ marginBottom: '15px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, top: 0 }}>3.</span>
                {t('products.sizeGuide.example3')}
              </li>
            </ul>

            <h4 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px' }}>{t('products.sizeGuide.tipsTitle')}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.tip1')}
              </li>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.tip2')}
              </li>
              <li style={{ marginBottom: '10px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {t('products.sizeGuide.tip3')}
              </li>
            </ul>
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
            <p style={{ marginBottom: '20px', marginTop: '20px' }}>
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

  return (
    <>
      <Head>
        <title>Bas de Survêtement - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre bas de survêtement Asabili - Des pièces uniques de la collection Aube." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="aube"
          currentPage="pantalon"
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

        {/* Bouton toggle pour le menu */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          onMouseEnter={() => setIsHoveringButton(true)}
          onMouseLeave={() => setIsHoveringButton(false)}
        >
          {isMenuVisible ? (
            // Croix quand le menu est visible
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // 3 traits quand le menu n'est pas visible
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Contenu principal */}
        <div className={`main-content ${isMenuVisible ? 'with-sidebar' : 'full-width'}`}>
          {/* Section Introduction Sweatpants */}
          <section className={styles.newCollectionSection}>
            <div className={styles.mediaSection} style={{ width: '100%' }}>
              <div className="sweatpants-images-container">
                <div className="sweatpants-image-wrapper">
                  <Image
                    src="/images/sweatpants-hero.jpg"
                    alt="Sweatpants - Kamba Lhains"
                    width={600}
                    height={800}
                    className={styles.collectionImage}
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 100vw"
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
              Pantalon
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
                    <span>{t('products.breadcrumb.aube')}</span>
                  </Link>
                  <span> - </span>
                  <Link href="/aube/sweatpants" className={productStyles.breadcrumbLink}>
                    <span>{t('products.breadcrumb.bas')}</span>
                  </Link>
                  <span> - </span>
                  <Link href="/aube/sweatpants" className={productStyles.breadcrumbLink}>
                    <span>Bas de Survêtement</span>
                  </Link>
                </div>

                {/* Heart Icon - Positioned absolutely */}
                <button
                  className={`${productStyles.heartIcon} ${sweatpantsProduct && isFavorite(sweatpantsProduct.id, selectedColor) ? productStyles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={sweatpantsProduct && isFavorite(sweatpantsProduct.id, selectedColor) ? t('product.removeFromFavorites') : t('product.addToFavorites')}
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
                  <span className={`u-w-full ${sweatpantsProduct && isFavorite(sweatpantsProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${!sweatpantsProduct || !isFavorite(sweatpantsProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-remove`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                    </svg>
                  </span>
                </button>

                {/* Vertical Image Stack */}
                <div className={productStyles.imageStack}>
                  {displayedImages.map((image, index) => (
                    <Image width={600} height={750} key={index}
                      src={image}
                      alt={`${sweatpantsProduct.name} ${index + 1}`}
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
                  <h1 className={productStyles.productTitle}>{currentLanguage === 'en' && sweatpantsProduct.nameEn ? sweatpantsProduct.nameEn : sweatpantsProduct.name}</h1>
                  <span className={productStyles.productPrice}>{sweatpantsProduct.price} EUR</span>

                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        {t('products.page.colorLabel')} {selectedColor ? getColorTranslation(selectedColor, currentLanguage) : ''}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {sweatpantsProduct.colors?.map((color, index) => (
                        <div
                          key={index}
                          className={`${productStyles.colorSwatch} ${selectedColor === color ? productStyles.active : ''}`}
                          style={{
                            backgroundColor: getColorHex(color),
                            border: color === 'Beige' ? '1px solid #E5E5E5' : 'none'
                          }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className={productStyles.sizeSection}>
                    <div className={productStyles.sizeHeader}>
                      <div className={productStyles.sizeLabel}>{t('products.page.sizeLabel')}</div>
                    </div>
                    <div className={productStyles.sizeGrid}>
                      {sweatpantsProduct.sizes?.map((size, index) => {
                        const isAvailable = true;
                        return (
                          <button
                            key={index}
                            className={`${productStyles.sizeOption} ${selectedSize === size ? productStyles.active : ''} ${!isAvailable ? productStyles.unavailable : ''}`}
                            onClick={() => isAvailable && setSelectedSize(size)}
                            disabled={!isAvailable}
                          >
                            {size}
                          </button>
                        );
                      })}
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
                  ))
                }
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

        .sweatpants-images-container {
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;
          max-width: 100%;
        }

        .sweatpants-image-wrapper {
          flex: 1;
          height: 100%;
          overflow: hidden;
          max-width: 100%;
        }

        .sweatpants-image-wrapper img {
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

          .sweatpants-images-container {
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 100vw;
          }

          .sweatpants-image-wrapper {
            width: 100%;
            max-width: 100%;
            height: auto;
          }

          .sweatpants-image-wrapper img {
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

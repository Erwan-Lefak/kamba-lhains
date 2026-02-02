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

export default function ZenithJupe() {
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [showHautSubmenu, setShowHautSubmenu] = useState(false);
  const [showBasSubmenu, setShowBasSubmenu] = useState(true);
  const [showAccessoiresSubmenu, setShowAccessoiresSubmenu] = useState(false);

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
    const shuffled = shuffleArray(products.filter(p => p.subCategory === 'zenith' && p.id !== '11')).slice(0, 4);
    setRandomProducts(shuffled);
  }, []);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Product page functions - utiliser le produit jupe depuis products.ts
  const jupeProduct = products.find(p => p.id === '11') || {
    id: '11',
    name: 'JUPE BINE',
    nameEn: 'BINE SKIRT',
    price: 420,
    image: '/images/jupe-2.jpg',
    images: ['/images/jupe-2.jpg'],
    category: 'femme',
    subCategory: 'zenith',
    description: ['Jupe midi en crêpe fluide'],
    colors: ['#000000'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    featured: false
  };

  const handleAddToCart = () => {
    addToCart(jupeProduct, selectedSize, selectedColor, quantity);
  };

  const handleHeartClick = () => {
    if (!jupeProduct) return;

    if (isFavorite(jupeProduct.id, selectedColor)) {
      removeFromFavorites(jupeProduct.id, selectedColor);
    } else {
      addToFavorites(jupeProduct, selectedColor, selectedSize || undefined);
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
      case 'description': return t('products.page.descriptionBtn');
      case 'sizeGuide': return t('products.page.sizeGuideBtn');
      case 'careGuide': return t('products.page.careGuideBtn');
      case 'deliveryTime': return t('products.page.deliveryTimeBtn');
      case 'returnPolicy': return t('products.page.returnPolicyBtn');
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
              Laissez-vous séduire par l'allure fluide et structurée de cette jupe coupe soleil, pensée pour offrir mouvement, précision et présence. Son volume ample se déploie avec élégance à chaque pas, tandis que la ceinture à passants définit la taille sans rigidité.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Les poches plaquées, dotées d'une ouverture latérale sur le devant, apportent une fonctionnalité subtilement intégrée à la ligne. Le dos plissé révèle un tombé aérien, marquant la silhouette d'un rythme maîtrisé. Le motif Itoua, signature visuelle forte, habille la pièce d'un esprit rustique réinterprété avec raffinement. La longueur sous le genou parachève l'esthétique, entre modernité, ampleur et allure intemporelle.
            </p>
            <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Coupe : soleil, ample et structurée
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Ceinture : avec passants
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Fermeture zip devant
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Poches : plaquées à l'avant avec ouverture latérale
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Dos : plissé, volume déployé
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Motif : Itoua, caractère rustique et identitaire
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Longueur : sous le genou
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Style : fluide, expressif, contemporain, élégant
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

  const jupeProducts = products.filter(product => {
    const isZenith = product.subCategory === 'zenith';
    const nameMatch = product.name.toLowerCase().includes('jupe');
    const descriptionMatch = Array.isArray(product.description)
      ? product.description.some(desc =>
          desc.toLowerCase().includes('jupe')
        )
      : product.description.toLowerCase().includes('jupe');
    return isZenith && (nameMatch || descriptionMatch);
  });

  return (
    <>
      <Head>
        <title>Jupe - Kamba Lhains</title>
        <meta name="description" content={t('meta.jupe')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="kambavers-page">
        <CollectionSidebar
          collection="zenith"
          currentPage="jupe"
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
              <div className="zenith-images-container">
                <div className="zenith-image-wrapper">
                  <Image
                    src="/images/zenith-jupe-hero.jpg?v=2"
                    alt="Collection Zénith - Kamba Lhains"
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
              Jupe
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
                  <Link href="/zenith" className={productStyles.breadcrumbLink}>
                    <span>{t('products.breadcrumb.zenith')}</span>
                  </Link>
                  <span> - </span>
                  <Link href="/zenith/jupe" className={productStyles.breadcrumbLink}>
                    <span>{t('products.breadcrumb.bas')}</span>
                  </Link>
                  <span> - </span>
                  <Link href="/zenith/jupe" className={productStyles.breadcrumbLink}>
                    <span>{t('products.breadcrumb.jupe')}</span>
                  </Link>
                </div>

                {/* Heart Icon - Positioned absolutely */}
                <button
                  className={`${productStyles.heartIcon} ${jupeProduct && isFavorite(jupeProduct.id, selectedColor) ? productStyles.liked : ''}`}
                  onClick={handleHeartClick}
                  aria-label={jupeProduct && isFavorite(jupeProduct.id, selectedColor) ? t('products.removeFromFavorites') : t('products.addToFavorites')}
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
                  <span className={`u-w-full ${jupeProduct && isFavorite(jupeProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-add`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                    </svg>
                  </span>
                  <span className={`u-w-full ${!jupeProduct || !isFavorite(jupeProduct.id, selectedColor) ? 'u-hidden' : ''} | js-product-heart-remove`}>
                    <svg className="c-icon" data-size="sm">
                      <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                    </svg>
                  </span>
                </button>

                {/* Vertical Image Stack */}
                <div className={productStyles.imageStack}>
                  {jupeProduct.images?.map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    return (
                    <Image
                      key={index}
                      src={imageUrl}
                      alt={`${jupeProduct.name} ${index + 1}`}
                      width={600}
                      height={750}
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
                  <h1 className={productStyles.productTitle}>{currentLanguage === 'en' && jupeProduct.nameEn ? jupeProduct.nameEn : jupeProduct.name}</h1>
                  <span className={productStyles.productPrice}>{jupeProduct.price} EUR</span>

                  {/* Color Selector */}
                  <div className={productStyles.colorSection}>
                    <div className={productStyles.colorHeader}>
                      <div className={productStyles.colorLabel}>
                        {t('products.page.colorLabel')} {getColorTranslation(selectedColor, currentLanguage)}
                      </div>
                    </div>
                    <div className={productStyles.colorOptions}>
                      {jupeProduct.colors?.map((color, index) => {
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
                      {jupeProduct.sizes?.map((size, index) => (
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

        .zenith-images-container {
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;
          max-width: 100%;
        }

        .zenith-image-wrapper {
          flex: 1;
          height: 100%;
          overflow: hidden;
          max-width: 100%;
        }

        .zenith-image-wrapper img {
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

          .zenith-images-container {
            flex-direction: column;
            gap: 10px;
            width: 100%;
            max-width: 100vw;
          }

          .zenith-image-wrapper {
            width: 100%;
            max-width: 100%;
            height: auto;
          }

          .zenith-image-wrapper img {
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

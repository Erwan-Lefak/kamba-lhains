import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductCard from '../../components/ProductCard';
import MobileCarousel from '../../components/MobileCarousel';
import { products } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { trackViewContent, trackAddToCart } from '../../components/TikTokPixel';
import { trackMetaViewContent, trackMetaAddToCart } from '../../components/MetaPixel';
import { sendCAPIAddToCart, sendCAPIViewContent } from '../../lib/meta/capiHelper';
import { useRecommendations } from '../../components/AI/RecommendationEngine';
import { findProductBySlug } from '../../utils/slugify';
import { getColorTranslation } from '../../utils/translations';
import styles from '../../styles/ProductPage.module.css';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { t, currentLanguage } = useLanguage();
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
  const [fallbackProducts, setFallbackProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // Function to convert color names to hex codes
  const getColorHex = (colorName) => {
    const colorMap = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Café': '#A0826D',
      'Beige': '#F5F5DC',
      'Jaune': '#F5E6A3',
      'Rose': '#FF69B4',
      'Bleu indigo': '#1E3A8A',
      'Blanc cassé': '#F5F5DC',
      'Gris': '#808080',
      'Bordeaux': '#800020',
      'Rouge': '#9f0909',
      'Kaki': '#556B2F',
      'Marron': '#8B4513',
      'Anthracite': '#36454F',
      'Bleu ciel': '#0EA5E9',
      'Bleu nuit': '#191970'
    };
    return colorMap[colorName] || colorName;
  };

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

  // Fonction pour mélanger un tableau de manière aléatoire
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (id) {
      // Chercher d'abord par slug, puis par ID (pour rétrocompatibilité)
      let foundProduct = findProductBySlug(products, id);
      if (!foundProduct) {
        foundProduct = products.find(p => p.id.toString() === id);
      }

      if (foundProduct) {
        setProduct(foundProduct);

        // Utiliser la couleur de l'URL si elle existe et est valide, sinon la première couleur
        const urlColor = router.query.color;
        const initialColor = urlColor && foundProduct.colors.includes(urlColor)
          ? urlColor
          : foundProduct.colors[0];
        setSelectedColor(initialColor);

        // Pas de sélection automatique de taille - l'utilisateur doit choisir

        // Track ViewContent event with value parameter
        const price = typeof foundProduct.price === 'string' ? parseFloat(foundProduct.price) : foundProduct.price;
        trackViewContent(foundProduct.id, foundProduct.name, price);

        // Meta Pixel ViewContent + CAPI avec déduplication eventId
        const eventId = trackMetaViewContent(foundProduct.id, foundProduct.name, price, 'EUR', foundProduct.metaContentId);

        // Envoyer au CAPI avec le même eventId pour déduplication
        sendCAPIViewContent({
          productId: foundProduct.id,
          productName: foundProduct.name,
          price: price,
          currency: 'EUR',
          eventId: eventId, // CRITIQUE: même eventId pour déduplication
        }).catch(err => console.error('Error sending CAPI ViewContent:', err));

        // Track product view in our analytics
        fetch('/api/track-product-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: foundProduct.id
          })
        }).catch(err => console.error('Error tracking product view:', err));

        // Initialize fallback products on client side only
        const shuffled = shuffleArray(products.filter(p => p.id !== foundProduct.id)).slice(0, 4);
        setFallbackProducts(shuffled);
      }
    }
  }, [id, router.query.color]);

  // Mettre à jour l'URL quand la couleur change
  useEffect(() => {
    if (product && selectedColor && id) {
      const currentColor = router.query.color;
      // Ne mettre à jour que si la couleur a changé
      if (currentColor !== selectedColor) {
        router.push(
          `/produit/${id}?color=${selectedColor}`,
          undefined,
          { shallow: true }
        );
      }
    }
  }, [selectedColor, product, id]);

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
      setShowAlert(true);
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);

    // Track AddToCart event with value parameter
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    trackAddToCart(product.id, product.name, price, quantity);

    // Meta Pixel AddToCart + CAPI avec déduplication eventId
    const eventId = trackMetaAddToCart(product.id, product.name, price, quantity, 'EUR', product.metaContentId);

    // Envoyer au CAPI avec le même eventId pour déduplication
    sendCAPIAddToCart({
      productId: product.id,
      productName: product.name,
      price: price,
      quantity: quantity,
      currency: 'EUR',
      eventId: eventId, // CRITIQUE: même eventId pour déduplication
    }).catch(err => console.error('Error sending CAPI AddToCart:', err));
  };

  const handleHeartClick = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product, selectedColor, selectedSize);
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
      if (productName.includes('gilet') || productName.includes('veste')) category = 'Veste';
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
        // Description personnalisée pour le Bombers Itoua
        if (product.id === 'bombers-itoua-zenith' || product.id === 'bombers-itoua') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Affirmez une allure audacieuse et contemporaine avec ce blouson bomber extra-oversized, véritable pièce statement de la saison. Conçu dans une construction structurée et ample, il se distingue par son dos plissé mis en valeur par un empiècement brodé et un logo iconique affiché en grand, affirmant la signature de la maison avec force et finesse. Son volume généreux offre une silhouette enveloppante et moderne, tout en garantissant un confort optimal.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Équipé de huit poches fonctionnelles — quatre à soufflets avec rabats pressionnés sur l'avant, deux latérales discrètes et deux intérieures — il allie identité visuelle marquée et praticité quotidienne. Le col structuré, la fermeture zippée frontale et les finitions élastiquées aux poignets et à l'ourlet soulignent son tempérament utilitaire premium, tandis que le motif Itoua apporte une touche rustique et authentique.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : extra-oversized, structurée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Signature : dos plissé + logo brodé, emblème de la marque
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches : 8 au total (4 à soufflets avec rabats pressionnés, 2 latérales, 2 intérieures)
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Fermeture : zip frontal
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Finitions : poignets et ourlet élastiqués, col structuré
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Motif : Itoua, esprit rustique et iconique
                </li>
              </ul>
            </div>
          );
        }

        // Description personnalisée pour le Gilet 1957
        if (product.id === 'gilet-1957') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Élégant et fonctionnel, ce gilet en denim incarne un équilibre parfait entre praticité et raffinement. Avec ses quatre poches plaquées à rabat, délicatement pliées, il propose une fonctionnalité sans compromis. Les deux empiècements avant, subtilement placés, apportent une structure élégante à la silhouette, tandis que le dos, avec son empiècement et ses plis, confère une dimension dynamique et structurée.
              </p>
              <p style={{ marginBottom: '20px' }}>
                À l'intérieur, deux poches passepoilées ajoutent une touche de raffinement discret, tandis que l'absence de boutons, que ce soit pour la fermeture ou les poches, renforce la praticité et le confort, parfait pour un usage quotidien et professionnel.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : Ajustée, avec des empiècements structurants
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Tombé : Décontracté, avec une touche de modernité
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches : Quatre poches plaquées à rabat, pliées pour plus de style
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : Empiècement avec plis, pour une silhouette structurée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Intérieur : Deux poches passepoilées discrètes
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : Fonctionnalité moderne et élégance intemporelle
                </li>
              </ul>
            </div>
          );
        }

        // Description personnalisée pour la Veste Jane
        if (product.id === 'veste-jane') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Réinventant le classique, cette veste en denim se démarque par ses détails uniques. Dotée de manches longues avec fentes élégantes aux poignets et d'un pli subtil pour un ajustement parfait, elle est également doublée avec un pli creux intérieur, offrant ainsi une aisance supplémentaire. Les deux poches passepoilées intérieures ajoutent une touche de raffinement. À l'avant, les quatre poches plaquées, avec leurs rabats et boutons pression, complètent le tout avec élégance et fonctionnalité.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : Ajustée avec des empiècements structurants
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Manches : Longues, avec fentes et plis pour un ajustement optimal
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Doublure : Complète avec un pli creux intérieur pour plus d'aisance
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches : Quatre poches plaquées et plissées à rabat avec boutons pression
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Boutons : Boutons clou sur la boutonnière et boutons pression sur les poches
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : Empiècement et plis pour une élégance structurée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : Un mélange de tradition et de modernité
                </li>
              </ul>
            </div>
          );
        }

        // Description personnalisée pour le Pantalon Jane
        if (product.id === 'pantalon-jane') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Allure vintage, silhouette généreuse. Ce pantalon taille haute oversize puise dans l'esthétique rétro. À l'avant, des poches plaquées avec ouverture latérale pour un twist moderne. À l'arrière, deux poches plaquées et plissées affirment le volume, rehaussées d'un empiècement dos structurant. Passants à la ceinture et fermeture bouton clou + zip pour une finition soignée.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : Taille haute oversize, inspiration rétro
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches avant : Plaquées avec ouverture latérale
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches arrière : Plaquées et plissées
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : Empiècement structurant
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Ceinture : Passants
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Fermeture : Bouton clou et zip
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : Allure vintage, volumes assumés
                </li>
              </ul>
            </div>
          );
        }

        // Description personnalisée pour le Baggy 1957
        if (product.id === 'jean-1957') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Volumes XXL, attitude affirmée. Ce pantalon oversize adopte une coupe ballon audacieuse. À l'avant, des poches de jean classiques rehaussées de deux poches tickets à rivets, avec braguette à boutons clou. À l'arrière, deux poches plaquées et plissées structurent la silhouette, rehaussées d'un empiècement dos. Passants à la ceinture et patch logo brodé pour signer le style.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : Oversize ballon
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches avant : Style jean avec 2 poches tickets à rivets
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches arrière : Plaquées et plissées
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : Empiècement structurant
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Ceinture : Passants avec patch logo brodé
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Fermeture : Boutons clou
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : Volumes affirmés, esprit streetwear
                </li>
              </ul>
            </div>
          );
        }

        // Description personnalisée pour asabili-sweatpants
        if (product.id === 'asabili-sweatpants') {
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
        }

        // Description pour le Voile de Corps
        if (product.id === 'voile-de-corps' || product.id === '3') {
          return (
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
          );
        }

        // Description pour la Surchemise Grand Boubou
        if (product.id === 'surchemise-grand-boubou') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Majestueuse et enveloppante, cette surchemise façon grand boubou affirme une présence souveraine. Son ampleur vaporeuse s'étend autour du corps avec une fluidité cérémonielle, tandis que le col chemise structuré ancre la silhouette dans une ligne plus Tailoring, presque protocolaire. Le tissu, intégralement couvert du motif Neo-Fractale, rend hommage aux systèmes mathématiques et géométriques africains — une science brillante, trop peu reconnue, bien qu'elle constitue l'un des berceaux fondamentaux de la pensée analytique, de l'astronomie, du calcul et de l'architecture symbolique.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Ici, la trame textile devient langage : un code visuel rythmique qui oscille entre fractale et mémoire numérique, réactivant un héritage savant sous une forme contemporaine. Les volumes généreux, portés par une matière ample et souple, confèrent à cette pièce une posture quasi liturgique, où se rencontrent majesté et douceur.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : extra-ample, silhouette grand boubou
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Tombé : fluide, vaporeux, cadence cérémonielle
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Col : chemise classique structuré, contrepoint Tailoring
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Motif : Neo-Fractale (science visuelle, entre fractalité et codification)
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Emmanchures : larges, ouvertes et respirantes pour une amplitude mouvante
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : prolongé par une traîne discrète, soulignant l'allure royale
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : rituel contemporain, majesté textile, héritage savant réinterprété
                </li>
              </ul>
            </div>
          );
        }

        // Description pour la Chemise Uriel Manche Longue
        if (product.id === 'chemise-uriel-manche-longue' || product.id === '7') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Plongez dans le confort et le style de cette chemise à coupe large, conçue pour allier modernité et décontraction. Ses manches longues, avec poignets à fente, offrent une grande liberté de mouvement. Les boutons noirs sur le devant apportent une touche de contraste, et la poche plaquée à rabat sur le côté gauche ajoute une note à la fois pratique et subtile. Le col chemise classique complète l'ensemble, tandis que le dos, sans empiècement, garantit une coupe épurée et moderne.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Cette chemise arbore également le motif Itoua, disponible en trois couleurs distinctes : kaki, gris et rouge, apportant une touche d'originalité et de caractère à la pièce.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : large et décontractée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Manches : longues avec poignets à fente
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Col : col chemise classique
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Boutons : noirs sur le devant
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poche : plaquée à rabat sur le côté gauche, au niveau de la poitrine
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Dos : sans empiècement, coupe épurée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Motif : Itoua en kaki, gris et rouge
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : moderne, décontracté, pratique et élégant
                </li>
              </ul>
            </div>
          );
        }

        // Description pour la Jupe Bine
        if (product.id === 'jupe-bine' || product.id === '11') {
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
        }

        // Description pour la Chemise Uriel Manches Courtes
        if (product.id === 'chemise-uriel-manches-courtes' || product.id === '7-ml') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Plongez dans l'élégance de cette chemise ajustée, alliant style et praticité. Elle se caractérise par ses manches courtes, arrivant au niveau de la saignée du bras, un col chemise classique, et des boutons noirs sur le devant. Le motif Itoua, présent sur l'ensemble du tissu, apporte une touche d'originalité.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Les détails incluent deux poches plaquées à rabat, placées juste en dessous de la poitrine, ainsi qu'un empiècement dos qui structure la chemise. Un vêtement idéal pour un look à la fois raffiné et décontracté.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : ajustée
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Manches : courtes, arrivant à la saignée du bras
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Col : col chemise classique
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Boutons : noirs sur le devant
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Motif : Itoua, en intégralité
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches : deux poches plaquées à rabat sous la poitrine
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Empiècement dos : pour une structure optimale
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : sophistiqué et décontracté
                </li>
              </ul>
            </div>
          );
        }

        // Description pour le Short Uriel
        if (product.id === 'short-uriel' || product.id === '17') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '20px' }}>
                Optez pour une touche de modernité et de confort avec ce short taille haute, confectionné en Leenane. Sa coupe taille haute sans passants met en valeur la silhouette, tandis que les poches plaquées latérales et les poches arrière, à la fois plaquées et plissées, incarnent le style signature de la marque. La longueur mi-cuisse, légèrement au-dessus de la cuisse, apporte une touche estivale et contemporaine. Enrichi du motif Itoua en rouge, ce short allie authenticité et qualité, pour une pièce incontournable de votre garde-robe.
              </p>
              <h3 style={{ fontWeight: '600', marginTop: '25px', marginBottom: '15px', fontSize: '11px' }}>Détails :</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Coupe : taille haute, sans passants
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Fermeture : Zip devant
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Poches : plaquées latérales, poches arrière plaquées et plissées
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Longueur : mi-cuisse, légèrement au-dessus de la cuisse
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Motif : Itoua en rouge, esprit rustique
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Style : contemporain, estival, raffiné
                </li>
              </ul>
            </div>
          );
        }

        // Description pour le Caleçon Champion
        if (product.id === 'calecon-champion') {
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
        }

        // Description par défaut pour les autres produits
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

          </div>
        );
      case 'careGuide':
        // Contenu spécifique pour le Caleçon Champion
        if (product.id === 'calecon-champion') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100% Coton – Percale<br />
                Ceinture: 97% Coton, 3% Élasthanne
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour le Bas de Survêtement Asabili
        if (product.id === 'asabili-sweatpants') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière 100% Coton - Jersey<br />
                Ceinture: 97% Coton, 3% Élasthanne
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour le Voile de Corps
        if (product.id === 'voile-de-corps' || product.id === '3') {
          return (
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
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour la Surchemise Grand Boubou
        if (product.id === 'surchemise-grand-boubou') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100% Coton - Popeline
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour la Chemise Uriel Manche Longue
        if (product.id === 'chemise-uriel-manche-longue' || product.id === '7') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100% Coton - Popeline
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour la Jupe Bine
        if (product.id === 'jupe-bine' || product.id === '11') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 94% Coton ; 6% Lin
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour la Chemise Uriel Manches Courtes
        if (product.id === 'chemise-uriel-manches-courtes' || product.id === '7-ml') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 94% Coton ; 6% Lin
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour le Short Uriel
        if (product.id === 'short-uriel' || product.id === '17') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 94% Coton ; 6% Lin
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
                  Repassage à température faible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de nettoyage à sec chimique
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour le Bombers Itoua
        if (product.id === 'bombers-itoua-zenith' || product.id === 'bombers-itoua') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100% coton Panama Brut
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Lavage délicat à 30°C
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Pas de blanchiment
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Repassage à basse température sans vapeur
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Nettoyage à sec possible
                </li>
                <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Ne pas sécher en machine
                </li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour le Gilet 1957
        if (product.id === 'gilet-1957') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100 % Coton<br />
                Doublure: 100 % Coton
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
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu spécifique pour la Veste Jane
        if (product.id === 'veste-jane') {
          return (
            <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
              <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
              <p style={{ marginBottom: '20px' }}>
                Matière: 100 % Coton<br />
                Doublure: 100 % Coton
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
              <p style={{ marginTop: '20px' }}>
                Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
              </p>
              <p style={{ marginTop: '10px' }}>
                Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
              </p>
            </div>
          );
        }
        // Contenu par défaut pour les autres produits
        return (
          <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', lineHeight: '1.8' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '15px', fontSize: '11px', textTransform: 'uppercase' }}>MATIÈRE & INSTRUCTIONS D'ENTRETIEN</h3>
            <p style={{ marginBottom: '20px' }}>
              Matière: 100% coton recyclé
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Lavage délicat à 30°C
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Pas de blanchiment
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Repassage à basse température sans vapeur
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Nettoyage à sec possible
              </li>
              <li style={{ marginBottom: '8px', paddingLeft: '15px', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Ne pas sécher en machine
              </li>
            </ul>
            <p style={{ marginTop: '20px' }}>
              Nous sélectionnons avec soin nos matières, en privilégiant principalement des tissus 100% naturels, ainsi que des textiles issus de stocks dormants et de fins de séries. Cette démarche peut entraîner de légères variations d'une pièce à l'autre, mais nous veillons toujours à préserver une harmonie visuelle et une esthétique fidèle aux modèles présentés et proposés à la vente.
            </p>
            <p style={{ marginTop: '10px' }}>
              Il nous arrive également d'utiliser des matières synthétiques, mais uniquement lorsqu'elles sont issues de filières de recyclage, afin de limiter notre impact et de valoriser l'existant. Notre approche repose ainsi sur une création responsable et engagée, où chaque pièce porte en elle l'histoire du textile auquel nous offrons une seconde vie.
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

        {/* Meta/Facebook Catalog Microdata - JSON-LD for automatic product detection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "description": Array.isArray(product.description) ? product.description.join(' ') : product.description,
              "image": product.image,
              "offers": {
                "@type": "Offer",
                "price": typeof product.price === 'string' ? parseFloat(product.price.replace(',', '.')) : product.price,
                "priceCurrency": "EUR",
                "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": `https://kamba-lhains.com/produit/${product.id}`
              },
              "productID": product.metaContentId || product.id
            })
          }}
        />
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
                    <Image
                      key={`${selectedColor}-${selectedSize}-${index}`}
                      src={image}
                      alt={`${product.name} ${(index % imagesToShow.length) + 1}`}
                      width={600}
                      height={750}
                      className={styles.stackedImage}
                      onError={(e) => {
                        console.log('Image failed to load:', image);
                        e.target.src = '/logo.png';
                      }}
                    />
                  ))
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={750}
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
              <h1 className={styles.productTitle}>{currentLanguage === 'en' && product.nameEn ? product.nameEn : product.name}</h1>
              <span className={styles.productPrice}>{product.price} EUR</span>


              {/* Color Selector */}
              <div className={styles.colorSection}>
                <div className={styles.colorHeader}>
                  <div className={styles.colorLabel}>
                    {t('products.page.colorLabel')} {selectedColor ? getColorTranslation(selectedColor, currentLanguage) : ''}
                  </div>
                </div>
                <div className={styles.colorOptions}>
                  {product.colors.map((color, index) => {
                    const colorHex = getColorHex(color);
                    return (
                      <div
                        key={index}
                        className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''}`}
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
              <div className={styles.sizeSection}>
                <div className={styles.sizeHeader}>
                  <div className={styles.sizeLabel}>{t('products.page.sizeLabel')}</div>
                </div>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((size, index) => {
                    const isAvailable = product.availableSizes ? product.availableSizes.includes(size) : true;
                    return (
                      <button
                        key={index}
                        className={`${styles.sizeOption} ${selectedSize === size ? styles.active : ''} ${!isAvailable ? styles.unavailable : ''}`}
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
              <div className={styles.addToCartSection}>
                <button className={styles.addToCartButton} onClick={handleAddToCart}>
                  <div
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
                  </div>
                  <div style={{flex: 1, color: 'black'}}>
                    <span>{t('products.page.addToCartButton')}</span>
                  </div>
                  <div
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
                  </div>
                </button>
              </div>

              {/* Info Links */}
              <div className={styles.infoLinksSection}>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('description')}
                >
                  {t('products.page.descriptionBtn')}
                </button>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('sizeGuide')}
                >
                  {t('products.page.sizeGuideBtn')}
                </button>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('careGuide')}
                >
                  {t('products.page.careGuideBtn')}
                </button>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('deliveryTime')}
                >
                  {t('products.page.deliveryTimeBtn')}
                </button>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('returnPolicy')}
                >
                  {t('products.page.returnPolicyBtn')}
                </button>
                <button
                  className={styles.infoLink}
                  onClick={() => openModal('klarna')}
                >
                  Paiement en plusieurs fois
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
                : fallbackProducts
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
                  : fallbackProducts
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

      {/* Alert Modal */}
      {showAlert && (
        <>
          <div className="alert-overlay" onClick={() => setShowAlert(false)} />
          <div className="alert-modal">
            <p>Veuillez sélectionner une taille et une couleur</p>
            <button onClick={() => setShowAlert(false)}>OK</button>
          </div>
        </>
      )}

      <style jsx>{`
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
    </>
  );
}
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslatedProductName } from '../utils/productTranslations';
import { generateSlug } from '../utils/slugify';
import styles from '../styles/Products.module.css';

interface ProductCardProps {
  product: Product;
  hideInfo?: boolean;
  noLink?: boolean;
  defaultColor?: string;
}

export default function ProductCard({ product, hideInfo = false, noLink = false, defaultColor }: ProductCardProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const isAubePage = router.pathname === '/aube';
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { currentLanguage } = useLanguage();
  const isProductFavorite = isFavorite(product.id);
  const [isHovered, setIsHovered] = useState(false);

  // Obtenir le nom traduit du produit
  const translatedName = getTranslatedProductName(product.name, currentLanguage);

  // Use selectedColor from favorite item if it exists, otherwise use defaultColor or first color
  const favoriteColor = (product as any).selectedColor;
  const variantImage = (product as any).variantImage;

  const initialColor = favoriteColor || defaultColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);

  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);

  // Synchronize selectedColor with favoriteColor when it changes (for favorites page)
  useEffect(() => {
    if (favoriteColor && favoriteColor !== selectedColor) {
      setSelectedColor(favoriteColor);
    }
  }, [favoriteColor]);

  // Fonction pour obtenir le nom de la couleur
  const getColorName = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      '#000000': 'Noir',
      '#FFFFFF': 'Blanc',
      '#ffffff': 'Blanc',
      '#A0826D': 'Café',
      '#8B7355': 'Beige',
      '#F5E6A3': 'Jaune',
      '#F4C2C2': 'Rose',
      '#1E3A8A': 'Bleu indigo',
      '#F5F5DC': 'Blanc cassé',
      '#808080': 'Gris',
      '#800020': 'Bordeaux',
      '#556B2F': 'Kaki',
      '#8B4513': 'Marron',
      '#FF69B4': 'Rose',
      '#36454F': 'Anthracite',
      '#0EA5E9': 'Bleu ciel',
      '#191970': 'Bleu nuit',
      '#22C55E': 'Vert',
      '#9f0909': 'Rouge',
    };
    return colorMap[color] || color;
  };

  // Fonction inverse : convertir nom français -> code hex
  const getColorHex = (colorName: string): string => {
    const nameToHexMap: { [key: string]: string } = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Café': '#A0826D',
      'Beige': '#8B7355',
      'Jaune': '#F5E6A3',
      'Rose': '#F4C2C2',
      'Bleu indigo': '#1E3A8A',
      'Blanc cassé': '#F5F5DC',
      'Gris': '#808080',
      'Bordeaux': '#800020',
      'Kaki': '#556B2F',
      'Marron': '#8B4513',
      'Anthracite': '#36454F',
      'Bleu ciel': '#0EA5E9',
      'Bleu nuit': '#191970',
      'Vert': '#22C55E',
      'Rouge': '#9f0909',
    };
    return nameToHexMap[colorName] || colorName;
  };

  // Obtenir les images en fonction de la couleur sélectionnée
  const getImagesForColor = () => {
    let images = [];

    // Si le produit a une variantImage (depuis les favoris), l'utiliser en priorité
    if ((product as any).variantImage) {
      images = [(product as any).variantImage];
    }
    // Sinon, si une couleur est sélectionnée et qu'il y a des images par couleur, les utiliser
    else if (selectedColor && product.imagesByColor && product.imagesByColor[selectedColor]) {
      images = product.imagesByColor[selectedColor];
    }
    // Sinon, utiliser les images par défaut
    else {
      images = product.images && product.images.length > 0 ? product.images : [product.image];
    }

    // Pour le bombers sur la page d'accueil, mettre l'image côté droit en premier
    if (isHomePage && product.id === 'bombers-itoua-zenith' && images.length >= 2) {
      // Réorganiser pour mettre l'image index 1 (côté droit) en premier
      const reordered = [images[1], images[0], ...images.slice(2)];
      return reordered;
    }

    // Pour le sweatpants sur la page d'accueil, mettre l'image de dos (index 3) en premier
    if (isHomePage && product.id === 'asabili-sweatpants' && images.length >= 4) {
      // Réorganiser pour mettre l'image index 3 (dos) en premier
      const reordered = [images[3], images[0], images[1], images[2], ...images.slice(4)];
      return reordered;
    }

    // Pour la surchemise boubou sur la page d'accueil, mettre l'image de profil gauche (index 2) en premier
    if (isHomePage && product.id === 'surchemise-grand-boubou' && images.length >= 3) {
      // Réorganiser pour mettre l'image index 2 (profil gauche) en premier
      const reordered = [images[2], images[0], images[1], ...images.slice(3)];
      return reordered;
    }

    // Pour toutes les autres pages (pas l'accueil), le sweatpants affiche l'image de face (index 0) par défaut
    // Pas besoin de réorganisation car l'image de face est déjà à l'index 0

    return images;
  };

  // Pour la page d'accueil, certains produits commencent avec une image différente
  const getInitialImageIndex = () => {
    // Comme nous réorganisons les images dans getImagesForColor(),
    // l'image voulue est déjà en position 0
    return 0;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(getInitialImageIndex());
  const [containerX, setContainerX] = useState(0);

  const availableImages = getImagesForColor();
  const hasMultipleImages = availableImages.length > 1;
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const isDragging = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  
  
  // Créer un tableau infini : [dernière, ...images, première]
  const infiniteImages = hasMultipleImages 
    ? [availableImages[availableImages.length - 1], ...availableImages, availableImages[0]]
    : availableImages;

  // Initialiser la position correcte pour l'infini
  useEffect(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex(1); // Commencer sur la vraie première image
      setContainerX(-100); // Position -100% pour la vraie première image
    }
  }, [hasMultipleImages]);

  // Réinitialiser le carousel quand la couleur change
  useEffect(() => {
    if (hasMultipleImages) {
      setCurrentImageIndex(1);
      setContainerX(-100);
    } else {
      setCurrentImageIndex(0);
      setContainerX(0);
    }
  }, [selectedColor]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product, selectedColor ?? undefined, undefined);
    }
  };

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
    // Réinitialiser le carousel à la première image
    setCurrentImageIndex(1);
    setContainerX(-100);
  };

  const paginate = (direction: number) => {
    if (!hasMultipleImages) return; // Ne fait rien si une seule image
    
    const newIndex = currentImageIndex + direction;
    const newX = -newIndex * 100;
    
    setCurrentImageIndex(newIndex);
    setContainerX(newX);
    
    // Logique de reset invisible pour l'infini
    setTimeout(() => {
      if (newIndex >= availableImages.length + 1) {
        // Si on dépasse la dernière image, reset à la première vraie image
        setIsTransitioning(false);
        setCurrentImageIndex(1);
        setContainerX(-100);
        setTimeout(() => setIsTransitioning(true), 10);
      } else if (newIndex <= 0) {
        // Si on va avant la première image, reset à la dernière vraie image
        setIsTransitioning(false);
        setCurrentImageIndex(availableImages.length);
        setContainerX(-availableImages.length * 100);
        setTimeout(() => setIsTransitioning(true), 10);
      }
    }, 350); // Après la transition
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
    isDragging.current = true;
    setIsTransitioning(false);
    
    // Force hardware acceleration
    if (containerRef.current) {
      containerRef.current.style.willChange = 'transform';
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !hasMultipleImages) return;
    
    e.preventDefault();
    touchCurrentX.current = e.touches[0].clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;
    const currentX = -currentImageIndex * 100;
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const newX = currentX + (deltaX / containerWidth) * 100;
    
    // Use requestAnimationFrame for 60fps smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      setContainerX(newX);
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging.current || !hasMultipleImages) return;
    
    const deltaX = touchCurrentX.current - touchStartX.current;
    const threshold = 20; // Very low threshold for iOS
    
    setIsTransitioning(true);
    
    // Clean up animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Remove hardware acceleration hint
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.willChange = 'auto';
        }
      }, 300);
    }
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        paginate(-1);
      } else {
        paginate(1);
      }
    } else {
      // Snap back to current position
      setContainerX(-currentImageIndex * 100);
    }
    
    isDragging.current = false;
  };

  const cardContent = (
    <>
      <div
        className={styles.productImageContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.imageWrapper}>
          {hasMultipleImages ? (
            <div className={styles.carousel}>
              <div
                ref={containerRef}
                className={styles.imageContainer}
                style={{
                  transform: `translate3d(${containerX}%, 0, 0)`,
                  transition: isTransitioning ? 'transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {infiniteImages.map((image, index) => (
                  <div key={index} className={styles.imageSlide}>
                    {variantImage ? (
                      <Image width={600} height={750} src={typeof image === 'string' ? image : image.url}
                        alt={`${product.name} ${index + 1}`}
                        className={styles.productImage}
                        draggable={false}
                      />
                    ) : (
                      <Image
                        src={typeof image === 'string' ? image : image.url}
                        alt={`${product.name} ${index + 1}`}
                        width={800}
                        height={1200}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.productImage}
                        priority={product.featured && index === 0}
                        quality={95}
                        draggable={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            variantImage ? (
              <Image width={600} height={750} src={typeof availableImages[0] === 'string' ? availableImages[0] : availableImages[0]?.url || product.image}
                alt={product.name}
                className={styles.productImage}
              />
            ) : (
              <Image
                src={typeof availableImages[0] === 'string' ? availableImages[0] : availableImages[0]?.url || product.image}
                alt={product.name}
                width={800}
                height={1200}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.productImage}
                priority={product.featured}
                quality={95}
              />
            )
          )}
          
          {/* Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <>
              <button 
                className={`${styles.imageNavButton} ${styles.prevButton}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(-1);
                }}
                aria-label="Image précédente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className={`${styles.imageNavButton} ${styles.nextButton}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  paginate(1);
                }}
                aria-label="Image suivante"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          
          {!hideInfo && (
            <>
              <button 
                className={styles.favoriteIcon}
                onClick={handleFavoriteClick}
                aria-label={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <span className={`u-w-full ${isProductFavorite ? 'u-hidden' : ''} | js-product-heart-add`}>
                  <svg className="c-icon" data-size="sm">
                    <use xlinkHref="#icon-heart-kamba-plain" x="0" y="0"></use>
                  </svg>
                </span>
                <span className={`u-w-full ${!isProductFavorite ? 'u-hidden' : ''} | js-product-heart-remove`}>
                  <svg className="c-icon" data-size="sm">
                    <use xlinkHref="#icon-heart-kamba-red" x="0" y="0"></use>
                  </svg>
                </span>
              </button>
              {/* Color Swatches - appear on hover (desktop) or always visible (mobile) */}
              {product.colors && product.colors.length > 0 && (
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={`${styles.colorSwatches} ${styles.desktopSwatches}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{
                        type: "tween",
                        ease: "easeOut",
                        duration: 0.3,
                        staggerChildren: 0.05,
                        staggerDirection: -1
                      }}
                    >
                      {product.colors?.map((color, index) => (
                        <motion.div
                          key={index}
                          className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''}`}
                          style={{
                            backgroundColor: getColorHex(color),
                          }}
                          title={color}
                          onClick={(e) => handleColorClick(e, color)}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -20, opacity: 0 }}
                          transition={{
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.2,
                            delay: ((product.colors?.length || 0) - 1 - index) * 0.05
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              {/* Desktop Overlay - inside image container */}
              <div className={`${styles.productOverlay} ${styles.desktopOverlay}`}>
                <div className={styles.productName}>{translatedName}</div>
                <div className={styles.productPrice}>{product.price} EUR</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Product Info - outside image container, below image */}
      {!hideInfo && (
        <div className={styles.mobileProductInfo}>
          <div className={styles.productName}>{translatedName}</div>
          <div className={styles.productPrice}>{product.price} EUR</div>
          {/* Mobile Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className={styles.mobileColorSwatches}>
              {product.colors?.map((color, index) => (
                <div
                  key={index}
                  className={`${styles.colorSwatch} ${selectedColor === color ? styles.active : ''}`}
                  style={{
                    backgroundColor: getColorHex(color),
                  }}
                  title={color}
                  onClick={(e) => handleColorClick(e, color)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const productSlug = generateSlug(product.name);

  // Build URL with color parameter if a color is selected
  let productUrl = `/produit/${productSlug}`;
  if (selectedColor) {
    productUrl += `?color=${encodeURIComponent(selectedColor)}`;
  }

  return noLink ? (
    <div className={styles.productCard}>{cardContent}</div>
  ) : (
    <Link href={productUrl} className={styles.productCard}>
      {cardContent}
    </Link>
  );
}
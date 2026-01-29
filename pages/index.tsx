import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { featuredProducts, products } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/HomePage.module.css';

export default function Home() {
  const { t } = useLanguage();

  // Pour mobile uniquement: remplacer la 4ème chemise par la surchemise boubou
  const surchemiseBoubou = products.find(p => p.id === 'surchemise-grand-boubou');
  const mobileHomeProducts = surchemiseBoubou
    ? [...featuredProducts.slice(0, 3), surchemiseBoubou]
    : featuredProducts;

  useEffect(() => {
    const handleScroll = () => {
      // Elements for collection section
      const stickyTexts = document.querySelectorAll(`.${styles.stickyText}:not([id])`) as NodeListOf<HTMLElement>; // Textes originaux sans id
      const stickyTextsPhase1 = document.querySelectorAll(`.${styles.stickyText}[id]`) as NodeListOf<HTMLElement>; // Textes avec id pour phase1
      const stickyContainers = document.querySelectorAll(`.${styles.stickyTextContainer}`) as NodeListOf<HTMLElement>;
      const section = document.querySelector(`.${styles.newCollectionSection}`);
      
      // Elements for hero section
      const heroSection = document.querySelector(`.${styles.heroSection}`);
      const heroStickyTexts = document.querySelectorAll('[class*="Hero_stickyText"]:not([id])') as NodeListOf<HTMLElement>;
      const heroStickyTextsPhase1 = document.querySelectorAll('[class*="Hero_stickyText"][id]') as NodeListOf<HTMLElement>;
      const heroStickyContainers = document.querySelectorAll('[class*="Hero_stickyTextContainer"]') as NodeListOf<HTMLElement>;
      const images = document.querySelectorAll(`.${styles.collectionImageSlot}`);
      
      // Hero section scroll logic
      if (heroSection) {
        const heroSectionRect = heroSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        heroStickyTexts.forEach((text, index) => {
          const container = heroStickyContainers[index];
          if (!container) return;

          // Calculate key positions
          const sectionTop = heroSectionRect.top;
          const sectionBottom = heroSectionRect.bottom;
          const viewportCenter = viewportHeight / 2;
          const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          if (isMobile) {
            // MOBILE : État fixe simple - texte en haut à gauche
            container.style.position = 'absolute';
            container.style.left = '10px';
            container.style.right = 'unset';
            container.style.top = '20px';
            container.style.bottom = 'unset';
            text.style.opacity = '1';
            text.style.fontWeight = '500';
          } else {
            // Desktop: Full phase behavior
            if (sectionTop > viewportHeight) {
              // Before section: text invisible
              text.style.opacity = '0';
            } else if (sectionTop <= viewportCenter - 50 && sectionBottom >= viewportCenter + 150) {
              // Phase 2: FIXED - text fixed in middle of viewport with scroll fade
              const phase2Start = viewportCenter - 50;
              const phase2End = viewportCenter + 150;

              const phase2Distance = phase2Start - (phase2End - sectionBottom);
              const phase2Progress = (phase2Start - sectionTop) / (phase2Distance * 2); // 2x plus longtemps transparent
              const phase2Opacity = Math.max(0, Math.min(1, phase2Progress));
              container.style.position = 'fixed';
              container.style.top = `${viewportCenter}px`;
              container.style.bottom = 'unset';
              container.style.left = '40px';
              text.style.opacity = '1';
            } else {
              // Phase 3: FINAL SCROLL - text at bottom of video
              container.style.position = 'absolute';
              container.style.left = '40px';
              container.style.right = 'unset';
              container.style.top = 'unset';
              container.style.bottom = '60px';
              text.style.opacity = '1';
            }

            // Hide if section not visible
            if (heroSectionRect.bottom < 0 || heroSectionRect.top > viewportHeight) {
              text.style.opacity = '0';
            }
          }
        });
        
        // Phase 1 text management for hero section
        heroStickyTextsPhase1.forEach((text, index) => {
          const sectionTop = heroSectionRect.top;
          const viewportCenter = viewportHeight / 2;
          const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const container = text.parentElement as HTMLElement;

          if (!isMobile && sectionTop > viewportCenter - 50) {
            // Phase 1: Duplicate text visible (desktop only)
            container.style.setProperty('position', 'absolute', 'important');
            container.style.setProperty('left', '40px', 'important');
            container.style.setProperty('top', '20px', 'important');
            container.style.setProperty('bottom', 'unset', 'important');
            text.style.setProperty('color', 'white', 'important');
            text.style.opacity = '1';
          } else {
            // Hide duplicate texts in other phases or on mobile
            text.style.opacity = '0';
          }
        });
      }
      
      if (section) {
        const sectionRect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        stickyTexts.forEach((text, index) => {
          const container = stickyContainers[index];
          const imageRect = images[index]?.getBoundingClientRect();
          if (!imageRect || !container) return;

          // Calculer les positions clés
          const sectionTop = sectionRect.top;
          const sectionBottom = sectionRect.bottom;
          const viewportCenter = viewportHeight / 2;
          const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          if (isMobile) {
            // MOBILE : État fixe simple - texte en bas à gauche de l'image
            container.className = styles.stickyTextContainer;
            text.style.position = 'absolute';
            text.style.left = '10px';
            text.style.top = 'unset';
            text.style.bottom = '-20px';
            text.style.opacity = '1';
            text.style.color = 'white';
            text.style.fontSize = '16px';
          } else {
            // DESKTOP : Animations complexes conservées
            // Position du texte pour les phases 0 et 1
            const textPositionPhase0 = imageRect.top + 30;
            const textPositionPhase1 = imageRect.top + 150;

            // Définir les seuils pour desktop
            const phase1EndThreshold = viewportCenter - 50;
            const phase2EndThreshold = viewportCenter + 14;

            if (sectionTop > viewportHeight) {
              // Avant la section : texte invisible
              text.style.opacity = '0';
            } else if (sectionTop > phase1EndThreshold) {
              // Phase 1 : cacher le texte principal (le texte dupliqué avec id est affiché)
              text.style.opacity = '0';
            } else if (sectionBottom >= phase2EndThreshold) {
              // Phase 2: FIXE - texte fixé au milieu de l'écran avec fade selon scroll
              const baseDivisor = 800;
              const screenHeightFactor = Math.max(0.3, Math.min(1.0, viewportHeight / 800));
              const adaptiveDivisor = baseDivisor * screenHeightFactor;
              const phase2Progress = ((sectionBottom - viewportCenter - 14) / adaptiveDivisor);
              const linearProgress = Math.max(0, Math.min(1, phase2Progress));
              const phase2Opacity = linearProgress * linearProgress * linearProgress;

              text.style.transition = '';
              text.dataset.justEnteredPhase3 = '';

              container.className = styles.stickyTextContainer;
              text.style.position = 'fixed';
              text.style.top = `${viewportCenter - 30}px`;
              text.style.bottom = 'unset';
              text.style.left = `${imageRect.left + 20}px`;

              // Couleur noire pour le deuxième texte (Accessoires)
              if (index === 1) {
                text.style.color = '#000000';
              }

              text.style.opacity = phase2Opacity.toString();
            } else {
              // Phase 3: SCROLL FINAL - texte en bas de l'image
              container.className = styles.stickyTextContainer;
              text.style.position = 'absolute';
              text.style.left = '0px';
              text.style.top = 'unset';
              text.style.bottom = '-60px';

              // Couleur noire pour le deuxième texte (Accessoires)
              if (index === 1) {
                text.style.color = '#000000';
              }

              // Vérifier si on vient juste d'entrer en phase 3
              if (!text.dataset.justEnteredPhase3) {
                text.dataset.justEnteredPhase3 = 'true';
                text.style.opacity = '0';
                text.style.transition = 'opacity 1s ease-out';

                requestAnimationFrame(() => {
                  text.style.opacity = '1';
                });
              } else {
                text.style.opacity = '1';
              }
            }

            // Masquer si section pas visible (sauf en phase 3)
            if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
              if (!(sectionBottom < viewportCenter + 14)) {
                text.style.opacity = '0';
              }
            }

            // Contraindre le texte dans les limites de la section
            if (sectionRect.top > 0 && sectionRect.bottom < viewportHeight) {
              // Section entièrement visible - pas de contrainte
            } else if (sectionRect.top < 0) {
              // Section partiellement sortie par le haut - contraindre le texte
              if (text.style.position === 'fixed') {
                const maxTop = Math.max(0, sectionRect.bottom - 50);
                const currentBottom = parseInt(text.style.bottom) || 0;
                const calculatedTop = viewportHeight - currentBottom;
                if (calculatedTop < 0) {
                  text.style.bottom = `${viewportHeight}px`;
                }
              }
            }
          }
        });

        // Gestion spécifique des textes Phase 1 (dupliqués) - Uniquement Desktop
        const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        stickyTextsPhase1.forEach((text, index) => {
          if (isMobile) {
            // Sur mobile : toujours masquer le texte dupliqué
            text.style.opacity = '0';
            text.style.display = 'none';
          } else {
            // Sur desktop : logique normale
            text.style.display = 'block';
            const sectionTop = sectionRect.top;
            const sectionBottom = sectionRect.bottom;
            const viewportCenter = viewportHeight / 2;
            const container = text.parentElement as HTMLElement;

            // Phase 1 : visible uniquement quand sectionTop est encore au-dessus du seuil
            const phase1EndThreshold = viewportCenter - 50;

            if (sectionTop > viewportHeight) {
              // Avant la section : texte invisible
              text.style.opacity = '0';
            } else if (sectionTop > phase1EndThreshold) {
              // Phase 1: Texte dupliqué visible en haut à gauche
              container.style.setProperty('position', 'absolute', 'important');
              container.style.setProperty('left', '20px', 'important');
              container.style.setProperty('top', '20px', 'important');
              container.style.setProperty('bottom', 'unset', 'important');
              // Couleur noire pour le deuxième texte (Accessoires), blanc pour les autres
              text.style.setProperty('color', index === 1 ? '#000000' : 'white', 'important');
              text.style.opacity = '1';
            } else {
              // Phase 2 et 3 : masquer le texte dupliqué
              text.style.opacity = '0';
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Delay initial call to avoid hydration mismatch
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Kamba Lhains</title>
        <meta name="description" content="Créé pour des générations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kamba-lhains.com/" />
        <meta property="og:title" content="Kamba Lhains" />
        <meta property="og:description" content="Créé pour des générations" />
        <meta property="og:image" content="https://kamba-lhains.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://kamba-lhains.com/" />
        <meta property="twitter:title" content="Kamba Lhains" />
        <meta property="twitter:description" content="Créé pour des générations" />
        <meta property="twitter:image" content="https://kamba-lhains.com/og-image.jpg" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Content Structure */}
      <main className={styles.homepage}>
        {/* Hero Video Section */}
        <section className={styles.heroSection}>
          <Hero />
        </section>

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid - 3 products */}
          <div className={styles.threeProductsGrid}>
            {featuredProducts.slice(0, 3).map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Mobile Grid - 4 products */}
          <div className={styles.mobileProductsGrid}>
            {mobileHomeProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} hideInfo={true} />
              </div>
            ))}
          </div>
        </section>

        {/* New Collection Section */}
        <section className={styles.newCollectionSection}>
          <div className={styles.collectionGrid}>
            <Link href="/denim">
              <div className={styles.collectionImageSlot}>
                {/* Desktop image */}
                <Image
                  src="/images/denim-hero-v2.jpg?v=5"
                  alt="Denim"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`${styles.collectionImage} ${styles.desktopOnly}`}
                  priority
                  unoptimized
                />
                {/* Mobile image */}
                <Image
                  src="/images/denim-mobile-new.jpg"
                  alt="Denim"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`${styles.collectionImage} ${styles.mobileOnly}`}
                  priority
                  unoptimized
                />
                <div className={styles.stickyTextContainer}>
                  <div className={styles.stickyText}>DENIM</div>
                </div>
                <div className={styles.stickyTextContainer}>
                  <div className={styles.stickyText} id="denim-phase1">DENIM</div>
                </div>
              </div>
            </Link>
            {/* <Link href="/aube/bonnet" className={styles.collectionImageSlot}>
              <Image
                src="/accessoires2.jpg"
                alt="Accessoires"
                fill
                sizes="50vw"
                className={styles.collectionImage}
                priority
              />
              <div className={styles.stickyTextContainer}>
                <div className={styles.stickyText}>ACCESSOIRES</div>
              </div>
              <div className={styles.stickyTextContainer}>
                <div className={styles.stickyText} id="accessoires-phase1">ACCESSOIRES</div>
              </div>
            </Link> */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer isHomePage={true} />
    </>
  );
}
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { featuredProducts } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../styles/HomePage.module.css';

export default function Home() {
  const { t } = useLanguage();

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
            // Mobile: Phase 2 and 3 behavior
            if (sectionTop <= viewportCenter - 50 && sectionBottom >= viewportCenter + 150) {
              // Phase 2: FIXED - text fixed in middle of viewport with scroll fade
              const phase2Start = viewportCenter - 50;
              const phase2End = viewportCenter + 150;
              
              const phase2Distance = phase2Start - (phase2End - sectionBottom);
              const phase2Progress = (phase2Start - sectionTop) / (phase2Distance * 2); // 2x plus longtemps transparent
              const phase2Opacity = Math.max(0, Math.min(1, phase2Progress));
              text.style.position = 'fixed';
              text.style.top = `${viewportCenter}px`;
              text.style.bottom = 'unset';
              text.style.left = '20px';
              text.style.opacity = '1';
            } else {
              // Phase 3: FINAL SCROLL - text at bottom of video
              text.style.position = 'absolute';
              text.style.left = '10px';
              text.style.right = 'unset';
              text.style.top = 'unset';
              text.style.bottom = '43px';
              text.style.opacity = '1';
            }
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
              text.style.position = 'fixed';
              text.style.top = `${viewportCenter}px`;
              text.style.bottom = 'unset';
              text.style.left = '20px';
              text.style.opacity = '1';
            } else {
              // Phase 3: FINAL SCROLL - text at bottom of video
              text.style.position = 'absolute';
              text.style.left = '14px';
              text.style.right = 'unset';
              text.style.top = 'unset';
              text.style.bottom = '60px';
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
            container.style.setProperty('left', '20px', 'important');
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
          
          // Position du texte pour les phases 0 et 1
          const textPositionPhase0 = imageRect.top + 30;
          const textPositionPhase1 = imageRect.top + 150;
          
          if (sectionTop > viewportHeight) {
            // Avant la section : texte invisible
            text.style.opacity = '0';
          } else if (sectionTop <= viewportCenter - 50 && sectionBottom >= viewportCenter + 14) {
            // Phase 2: FIXE - texte fixé au milieu de l'écran avec fade selon scroll
            // Ajuster le diviseur selon la hauteur de l'écran pour que ça fonctionne sur tous les écrans
            const baseDivisor = 800;
            const screenHeightFactor = Math.max(0.3, Math.min(1.0, viewportHeight / 800)); // Factor entre 0.3 et 1.0 pour atteindre 1 plus tôt sur petit écran
            const adaptiveDivisor = baseDivisor * screenHeightFactor;
            const phase2Progress = ((sectionBottom - viewportCenter - 14) / adaptiveDivisor);
            const linearProgress = Math.max(0, Math.min(1, phase2Progress));
            // Effet exponentiel : lent au début, moins brutal à la fin
            const phase2Opacity = linearProgress * linearProgress * linearProgress; // Puissance 3 pour effet moins brutal
            
            // Reset transition et marquer qu'on n'est pas en phase 3
            text.style.transition = '';
            text.dataset.justEnteredPhase3 = '';
            
            container.className = styles.stickyTextContainer;
            text.style.position = 'fixed';
            text.style.top = `${viewportCenter - 30}px`;
            text.style.bottom = 'unset';
            text.style.left = `${imageRect.left + 20}px`;
            
            text.style.opacity = phase2Opacity.toString();
          } else {
            // Phase 3: SCROLL FINAL - texte en bas de l'image
            container.className = styles.stickyTextContainer;
            text.style.position = 'absolute';
            text.style.left = isMobile ? '10px' : '0px';
            text.style.top = 'unset';
            text.style.bottom = isMobile ? '-35px' : '-60px';
            
            // Vérifier si on vient juste d'entrer en phase 3
            if (!text.dataset.justEnteredPhase3) {
              // Première fois qu'on arrive en phase 3 dans cette session de scroll
              text.dataset.justEnteredPhase3 = 'true';
              text.style.opacity = '0';
              text.style.transition = 'opacity 1s ease-out';
              
              // Forcer l'animation
              requestAnimationFrame(() => {
                text.style.opacity = '1';
              });
            } else {
              // Déjà en phase 3, garder visible
              text.style.opacity = '1';
            }
          }
          
          // Masquer si section pas visible (sauf en phase 3)
          if (sectionRect.bottom < 0 || sectionRect.top > viewportHeight) {
            // Ne pas masquer en phase 3, laisser le texte visible
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
              const maxTop = Math.max(0, sectionRect.bottom - 50); // 50px pour la hauteur du texte
              const currentBottom = parseInt(text.style.bottom) || 0;
              const calculatedTop = viewportHeight - currentBottom;
              if (calculatedTop < 0) {
                text.style.bottom = `${viewportHeight}px`;
              }
            }
          }
        });
        
        // Gestion spécifique des textes Phase 1 (dupliqués) - Phase 0
        stickyTextsPhase1.forEach((text, index) => {
          const sectionTop = sectionRect.top;
          const viewportCenter = viewportHeight / 2;
          const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const container = text.parentElement as HTMLElement; // Le conteneur parent
          
          if (sectionTop > viewportCenter - 50) {
            // Phase 1: Texte dupliqué visible (se termine un peu après)
            container.style.setProperty('position', 'absolute', 'important');
            container.style.setProperty('left', '20px', 'important');
            container.style.setProperty('top', isMobile ? '25px' : '20px', 'important');
            container.style.setProperty('bottom', 'unset', 'important');
            text.style.setProperty('color', 'white', 'important'); // Blanc
            text.style.opacity = '1';
          } else {
            // Masquer les textes dupliqués dans les autres phases
            text.style.opacity = '0';
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
        <meta name="description" content="Kamba Lhains - Marque de mode alliant élégance et modernité. Découvrez nos collections femme et homme." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
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
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {featuredProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Mobile Carousel */}
          <MobileCarousel products={featuredProducts} />
        </section>

        {/* New Collection Section */}
        <section className={styles.newCollectionSection}>
          <div className={styles.collectionGrid}>
            <Link href="/exclusivites">
              <div className={styles.collectionImageSlot}>
                <Image 
                  src="/exclu.jpg"
                  alt="Exclusivités"
                  fill
                  sizes="50vw"
                  className={styles.collectionImage}
                  priority
                />
                <div className={styles.stickyTextContainer}>
                  <div className={styles.stickyText}>EXCLUSIVITÉS</div>
                </div>
                <div className={styles.stickyTextContainer}>
                  <div className={styles.stickyText} id="exclusivite-phase1">EXCLUSIVITÉS</div>
                </div>
              </div>
            </Link>
            <div className={styles.collectionImageSlot}>
              <Image 
                src="/images/collection/IMG_3475.jpg"
                alt="Nouvelle Collection 2"
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
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
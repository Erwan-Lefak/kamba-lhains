import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
            <div className={styles.collectionImageSlot}>
              <Image 
                src="/IMG_2758.jpg"
                alt="Nouvelle Collection 1"
                fill
                sizes="50vw"
                className={styles.collectionImage}
                priority
              />
            </div>
            <div className={styles.collectionImageSlot}>
              <Image 
                src="/IMG_3475.jpg"
                alt="Nouvelle Collection 2"
                fill
                sizes="50vw"
                className={styles.collectionImage}
                priority
              />
            </div>
          </div>
          <div className={styles.collectionOverlay}>
            <div className={styles.collectionContent}>
              <h2 className={styles.collectionTitle}>{t('sections.newCollection')}</h2>
              <Link href="/boutique" className={styles.boutiqueButton}>
                {t('sections.shop')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
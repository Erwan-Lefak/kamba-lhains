import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import styles from '../styles/HomePage.module.css';

export default function TousLesProduits() {
  return (
    <>
      <Head>
        <title>Tous les Produits - Kamba Lhains</title>
        <meta name="description" content="Découvrez tous nos produits - Collection complète alliant élégance et modernité." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.homepage}>
        {/* Page Title */}
        <section className={styles.collectionTitleSection}>
          <h1 className={styles.collectionPageTitle}>TOUS LES PRODUITS</h1>
        </section>

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {products.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Mobile Carousel */}
          <MobileCarousel products={products} />
        </section>
      </main>

      <Footer />
    </>
  );
}
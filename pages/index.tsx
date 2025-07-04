import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import LargeProductCard from '../components/LargeProductCard';
import { featuredProducts, products } from '../data/products';
import { Product } from '../types';
import styles from '../styles/HomePage.module.css';

export default function Home() {
  // Get specific products by ID for the large display
  const largeProduct1: Product | undefined = products.find(p => p.id === 7); // CHEMISE URIEL
  const largeProduct2: Product | undefined = products.find(p => p.id === 8); // VESTE KMOBOU

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
          <div className={styles.threeProductsGrid}>
            {featuredProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Two Products Grid Section */}
        <section className={styles.twoProductsSection}>
          <div className={styles.twoProductsGrid}>
            {largeProduct1 && (
              <div className={styles.largeProductSlot}>
                <LargeProductCard product={largeProduct1} />
              </div>
            )}
            {largeProduct2 && (
              <div className={styles.largeProductSlot}>
                <LargeProductCard product={largeProduct2} />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
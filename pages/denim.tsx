import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import styles from '../styles/HomePage.module.css';

export default function Denim() {
  // Filtrer les produits contenant "denim" ou "jean" dans le nom ou la description
  const denimProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes('jean') || 
                     product.name.toLowerCase().includes('denim');
    const descriptionMatch = product.description.some(desc => 
      desc.toLowerCase().includes('jean') || 
      desc.toLowerCase().includes('denim')
    );
    return nameMatch || descriptionMatch;
  });

  return (
    <>
      <Head>
        <title>Denim - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre collection denim - Jeans et pièces en denim premium." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.homepage}>
        {/* Page Title */}
        <section className={styles.collectionTitleSection}>
          <h1 className={styles.collectionPageTitle}>DENIM</h1>
        </section>

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {denimProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Mobile Carousel */}
          <MobileCarousel products={denimProducts} />
        </section>
      </main>

      <Footer />
    </>
  );
}
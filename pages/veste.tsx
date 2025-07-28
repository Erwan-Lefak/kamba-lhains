import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import styles from '../styles/HomePage.module.css';

export default function Veste() {
  // Filtrer les produits contenant "veste" dans le nom ou la description
  const vesteProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes('veste');
    const descriptionMatch = Array.isArray(product.description) 
      ? product.description.some(desc => desc.toLowerCase().includes('veste'))
      : product.description.toLowerCase().includes('veste');
    return nameMatch || descriptionMatch;
  });

  return (
    <>
      <Head>
        <title>Vestes - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre collection de vestes - Élégance et modernité." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.homepage}>
        {/* Page Title */}
        <section className={styles.collectionTitleSection}>
          <h1 className={styles.collectionPageTitle}>VESTES</h1>
        </section>

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {vesteProducts.map(product => (
              <div key={product.id} className={styles.productSlot}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {/* Mobile Carousel */}
          <MobileCarousel products={vesteProducts} />
        </section>
      </main>

      <Footer />
    </>
  );
}
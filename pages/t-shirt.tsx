import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import MobileCarousel from '../components/MobileCarousel';
import { products } from '../data/products';
import styles from '../styles/HomePage.module.css';

export default function TShirt() {
  // Filtrer les produits contenant "t-shirt" ou "shirt" dans le nom ou la description
  const tshirtProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes('t-shirt') || 
                     product.name.toLowerCase().includes('shirt');
    const descriptionMatch = Array.isArray(product.description) 
      ? product.description.some(desc => 
          desc.toLowerCase().includes('t-shirt') || 
          desc.toLowerCase().includes('shirt')
        )
      : product.description.toLowerCase().includes('t-shirt') || 
        product.description.toLowerCase().includes('shirt');
    return nameMatch || descriptionMatch;
  });

  return (
    <>
      <Head>
        <title>T-Shirts - Kamba Lhains</title>
        <meta name="description" content="Découvrez notre collection de t-shirts - Confort et style au quotidien." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.homepage}>
        {/* Page Title */}
        <section className={styles.collectionTitleSection}>
          <h1 className={styles.collectionPageTitle}>T-SHIRTS</h1>
        </section>

        {/* Three Products Grid Section */}
        <section className={styles.threeProductsSection}>
          {/* Desktop Grid */}
          <div className={styles.threeProductsGrid}>
            {tshirtProducts.length > 0 ? (
              tshirtProducts.map(product => (
                <div key={product.id} className={styles.productSlot}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>Aucun t-shirt disponible pour le moment.</p>
              </div>
            )}
          </div>
          
          {/* Mobile Carousel */}
          {tshirtProducts.length > 0 && <MobileCarousel products={tshirtProducts} />}
        </section>
      </main>

      <Footer />
    </>
  );
}
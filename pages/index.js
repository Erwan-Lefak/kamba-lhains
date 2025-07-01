import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import LargeProductCard from '../components/LargeProductCard';
import { featuredProducts, products } from '../data/products';

export default function Home() {
  // Get specific products by ID for the large display
  const largeProduct1 = products.find(p => p.id === 7); // CHEMISE URIEL
  const largeProduct2 = products.find(p => p.id === 8); // VESTE KMOBOU

  return (
    <>
      <Head>
        <title>KAMBA LHAINS - Mode Contemporaine</title>
        <meta name="description" content="KAMBA LHAINS - Marque de mode contemporaine alliant élégance et modernité. Découvrez nos collections femme et homme." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Content Structure */}
      <main className="homepage">
        {/* Hero Video Section */}
        <section className="hero-section">
          <Hero />
        </section>

        {/* Three Products Grid Section */}
        <section className="three-products-section">
          <div className="three-products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="product-slot">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* Two Products Grid Section */}
        <section className="two-products-section">
          <div className="two-products-grid">
            <div className="large-product-slot">
              <LargeProductCard product={largeProduct1} />
            </div>
            <div className="large-product-slot">
              <LargeProductCard product={largeProduct2} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        .homepage {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin: 0;
          padding: 0;
          font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
        }

        /* Hero Section */
        .hero-section {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* Three Products Section */
        .three-products-section {
          width: 100%;
          background: white;
          margin: 0;
          padding: 0;
        }

        .three-products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          gap: 0;
        }

        .product-slot {
          width: 100%;
          height: 100vh;
          position: relative;
        }

        /* Two Products Section */
        .two-products-section {
          width: 100%;
          background: white;
          margin: 0;
          padding: 0;
        }

        .two-products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          gap: 0;
        }

        .large-product-slot {
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .three-products-grid {
            grid-template-columns: 1fr;
          }

          .two-products-grid {
            grid-template-columns: 1fr;
          }

          .product-slot {
            height: 80vh;
          }
        }

        @media (max-width: 1024px) {
          .product-slot {
            height: 90vh;
          }
        }

        /* Ensure no spacing between sections */
        .hero-section,
        .three-products-section,
        .two-products-section {
          margin: 0;
          padding: 0;
          border: none;
        }
      `}</style>
    </>
  );
}
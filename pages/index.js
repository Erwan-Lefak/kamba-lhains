import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { featuredProducts, products } from '../data/products';

export default function Home() {
  const femmeProducts = products.filter(p => p.category === 'femme');
  const hommeProducts = products.filter(p => p.category === 'homme');

  return (
    <>
      <Head>
        <title>KAMBA LHAINS - Mode Contemporaine</title>
        <meta name="description" content="KAMBA LHAINS - Marque de mode contemporaine alliant élégance et modernité. Découvrez nos collections femme et homme." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="main-content">
        <Hero />

        {/* Featured Products Grid */}
        <section className="featured-products">
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Additional Products Section */}
        <section className="additional-products">
          <div className="products-container">
            <Link href="/produit/7" className="product-item">
              <img src="/chemise-uriel.png" alt="CHEMISE URIEL" className="product-image-large" />
              <div className="product-overlay-large">
                <div className="product-name-large">CHEMISE URIEL</div>
                <div className="product-price-large">390,00 €</div>
              </div>
            </Link>
            <Link href="/produit/8" className="product-item">
              <img src="/veste-kmobou.png" alt="VESTE KMOBOU" className="product-image-large" />
              <div className="product-overlay-large">
                <div className="product-name-large">VESTE KMOBOU</div>
                <div className="product-price-large">590,00 €</div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        .main-content {
          font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
          margin-top: 0px;
          padding: 0;
          margin: 0;
        }

        .featured-products {
          background: white;
          position: relative;
          z-index: 1;
          margin-top: 0;
          padding-top: 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
        }

        .additional-products {
          width: 100%;
          background: white;
        }

        .products-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
        }

        .product-item {
          position: relative;
          overflow: hidden;
        }

        .product-image-large {
          width: 100%;
          height: calc(100vh + 80px);
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        @media (min-width: 1440px) {
          .product-image-large {
            height: calc(120vh + 80px);
          }
        }

        @media (min-width: 1920px) {
          .product-image-large {
            height: calc(140vh + 80px);
          }
        }

        @media (max-width: 1024px) {
          .product-image-large {
            height: 90vh;
          }
        }

        @media (max-width: 768px) {
          .product-image-large {
            height: 80vh;
          }
        }

        @media (max-width: 480px) {
          .product-image-large {
            height: 70vh;
          }
        }

        .product-item:hover .product-image-large {
          transform: scale(1.02);
        }

        .product-overlay-large {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 20px;
          color: white;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }

        .product-name-large {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-price-large {
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .hero-video {
            height: 60vh;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .products-container {
            grid-template-columns: 1fr;
          }

          .product-image-large {
            height: 80vh;
          }
        }
      `}</style>
    </>
  );
}
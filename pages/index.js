import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import LargeProductCard from '../components/LargeProductCard';
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
            <LargeProductCard 
              product={products.find(p => p.id === 7)} 
            />
            <LargeProductCard 
              product={products.find(p => p.id === 8)} 
            />
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
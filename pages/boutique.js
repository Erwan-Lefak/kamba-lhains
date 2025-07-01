import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

export default function Boutique() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace(/[^0-9,]/g, '').replace(',', '.')) - 
               parseFloat(b.price.replace(/[^0-9,]/g, '').replace(',', '.'));
      case 'price-high':
        return parseFloat(b.price.replace(/[^0-9,]/g, '').replace(',', '.')) - 
               parseFloat(a.price.replace(/[^0-9,]/g, '').replace(',', '.'));
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <>
      <Head>
        <title>Boutique - KAMBA LHAINS</title>
        <meta name="description" content="Découvrez toute la collection KAMBA LHAINS : vêtements contemporains pour femme et homme." />
      </Head>

      <Header />

      <main className="boutique-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>BOUTIQUE</h1>
            <p>Découvrez notre collection complète</p>
          </div>
        </div>

        <div className="container">
          <div className="filters-section">
            <div className="category-filters">
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="sort-section">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Trier par nom</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="products-count">
            <p>{sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}</p>
          </div>

          <div className="products-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .boutique-page {
          padding-top: 80px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .hero-section {
          background: #f5f5f5;
          padding: 60px 0;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #000;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .filter-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 12px 24px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          transition: all 0.3s;
          color: #666;
        }

        .filter-btn:hover {
          border-color: #000;
          color: #000;
        }

        .filter-btn.active {
          background: #000;
          color: white;
          border-color: #000;
        }

        .sort-select {
          padding: 12px 16px;
          border: 1px solid #ddd;
          font-size: 14px;
          cursor: pointer;
          background: white;
          color: #666;
        }

        .sort-select:focus {
          outline: none;
          border-color: #000;
        }

        .products-count {
          margin-bottom: 30px;
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 40px;
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .filter-buttons {
            justify-content: center;
            gap: 15px;
          }

          .filter-btn {
            padding: 10px 20px;
            font-size: 12px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
          }

          .hero-content h1 {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
          }

          .filter-buttons {
            flex-direction: column;
            gap: 10px;
          }

          .filter-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
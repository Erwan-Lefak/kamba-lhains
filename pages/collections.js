import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';

export default function Collections() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price) - parseInt(b.price);
      case 'price-high':
        return parseInt(b.price) - parseInt(a.price);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <>
      <Head>
        <title>Collections - Kamba Lhains</title>
        <meta name="description" content="Découvrez toutes les collections Kamba Lhains : Traditionnelle, Contemporaine, Denim et Accessoires." />
      </Head>

      <Header />

      <main className="collections-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Nos Collections</h1>
            <p>Découvrez l'art du tissage traditionnel sublimé par le design contemporain</p>
          </div>
        </div>

        <div className="container">
          <div className="filters-section">
            <div className="category-filters">
              <h3>Catégories</h3>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="sort-section">
              <label htmlFor="sort">Trier par:</label>
              <select 
                id="sort"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Nom</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className="products-count">
            <p>{sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}</p>
          </div>

          <div className="product-grid">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .collections-page {
          padding-top: 80px;
        }

        .hero-section {
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                      url('https://via.placeholder.com/1920x400/8B4513/FFFFFF?text=Collections');
          background-size: cover;
          background-position: center;
          padding: 6rem 0;
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .hero-content p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 20px;
        }

        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .category-filters h3 {
          margin-bottom: 1rem;
          color: #333;
          font-size: 1.2rem;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .filter-btn {
          padding: 0.8rem 1.5rem;
          border: 2px solid #ddd;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
          color: #666;
        }

        .filter-btn:hover {
          border-color: #8B4513;
          color: #8B4513;
        }

        .filter-btn.active {
          background: #8B4513;
          color: white;
          border-color: #8B4513;
        }

        .sort-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sort-section label {
          font-weight: 500;
          color: #333;
        }

        .sort-select {
          padding: 0.8rem 1rem;
          border: 2px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          background: white;
        }

        .sort-select:focus {
          outline: none;
          border-color: #8B4513;
        }

        .products-count {
          margin-bottom: 2rem;
          color: #666;
          font-size: 1.1rem;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-buttons {
            justify-content: center;
          }

          .sort-section {
            justify-content: center;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .hero-content h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

export default function Boutique() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  const filteredProducts: Product[] = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'masculin' && product.category === 'homme') {
      if (selectedSubCategory === 'all') return true;
      return product.subCategory === selectedSubCategory;
    }
    if (selectedCategory === 'feminin' && product.category === 'femme') {
      if (selectedSubCategory === 'all') return true;
      return product.subCategory === selectedSubCategory;
    }
    return false;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory('all');
  };

  const subCategories = ['all', 'aube', 'zenith', 'crepuscule'];

  return (
    <>
      <Head>
        <title>Boutique - Kamba Lhains</title>
        <meta name="description" content="Découvrez toute la collection Kamba Lhains : vêtements contemporains pour femme et homme." />
      </Head>

      <Header />

      <main className="boutique-page">
        <div className="container">
          <h1 className="page-title">BOUTIQUE</h1>
          
          <div className="categories-navigation">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              TOUS
            </button>
            <button
              className={`category-btn ${selectedCategory === 'masculin' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('masculin')}
            >
              MASCULIN
            </button>
            <button
              className={`category-btn ${selectedCategory === 'feminin' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('feminin')}
            >
              FÉMININ
            </button>
          </div>

          {(selectedCategory === 'masculin' || selectedCategory === 'feminin') && (
            <div className="subcategories-navigation">
              {subCategories.map(subCat => (
                <button
                  key={subCat}
                  className={`subcategory-btn ${selectedSubCategory === subCat ? 'active' : ''}`}
                  onClick={() => setSelectedSubCategory(subCat)}
                >
                  {subCat === 'all' ? 'TOUS' : subCat.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .boutique-page {
          padding-top: 80px;
          min-height: 100vh;
          font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif;
          background: white;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .page-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 3px;
          margin-bottom: 60px;
          color: #000;
        }

        .categories-navigation {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .category-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 12px 0;
          cursor: pointer;
          color: #999;
          transition: color 0.3s ease;
          text-transform: uppercase;
        }

        .category-btn:hover {
          color: #000;
        }

        .category-btn.active {
          color: #000;
          border-bottom: 2px solid #000;
        }

        .subcategories-navigation {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 50px;
        }

        .subcategory-btn {
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 1px;
          padding: 8px 16px;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
          text-transform: uppercase;
          border: 1px solid transparent;
        }

        .subcategory-btn:hover {
          color: #000;
          border-color: #ddd;
        }

        .subcategory-btn.active {
          color: #000;
          border-color: #000;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .product-item {
          aspect-ratio: 3/4;
          width: 100%;
          position: relative;
          overflow: hidden;
          background: #fff;
        }

        .no-products {
          text-align: center;
          padding: 80px 20px;
          color: #999;
        }

        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 40px 15px;
          }

          .page-title {
            font-size: 2rem;
            margin-bottom: 40px;
          }

          .categories-navigation {
            gap: 20px;
            flex-wrap: wrap;
          }

          .subcategories-navigation {
            gap: 15px;
            flex-wrap: wrap;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
          }

          .product-item {
            aspect-ratio: 3/4;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }

          .product-item {
            aspect-ratio: 3/4;
          }

          .categories-navigation {
            flex-direction: column;
            align-items: center;
            gap: 15px;
          }

          .subcategories-navigation {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
        }

        @media (max-width: 320px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
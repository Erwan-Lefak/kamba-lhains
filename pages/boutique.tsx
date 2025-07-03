import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { products, categories } from '../data/products';
import { Product } from '../types';
import Image from 'next/image';

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
        <title>Boutique - KAMBA LHAINS</title>
        <meta name="description" content="Découvrez toute la collection KAMBA LHAINS : vêtements contemporains pour femme et homme." />
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
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={500}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
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
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #fafafa;
        }

        .container {
          max-width: 1200px;
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
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 60px;
          margin-top: 60px;
        }

        .product-card {
          background: white;
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image {
          position: relative;
          width: 100%;
          height: 450px;
          overflow: hidden;
          background: #f5f5f5;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          padding: 20px 0;
          text-align: center;
        }

        .product-name {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: 8px;
          color: #000;
          text-transform: uppercase;
        }

        .product-price {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .no-products {
          text-align: center;
          padding: 80px 20px;
          color: #999;
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
            gap: 40px;
          }

          .product-image {
            height: 350px;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: 1fr;
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
      `}</style>
    </>
  );
}
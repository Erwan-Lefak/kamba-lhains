import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../../components/Admin/AdminLayout';
import ProductsTable from '../../../components/Admin/ProductsTable';
import ProductFilters from '../../../components/Admin/ProductFilters';
import BulkActions from '../../../components/Admin/BulkActions';
import { GetServerSideProps } from 'next';
import styles from '../../../styles/AdminProducts.module.css';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock';
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  sales: number;
  views: number;
}

interface ProductsPageProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
}

interface ProductFilters {
  search: string;
  category: string;
  status: string;
  priceRange: [number, number];
  stockStatus: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function AdminProductsPage({ user }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    status: '',
    priceRange: [0, 1000],
    stockStatus: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);

  const productsPerPage = 20;

  useEffect(() => {
    loadProducts();
  }, [filters, currentPage]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: productsPerPage.toString(),
        search: filters.search,
        category: filters.category,
        status: filters.status,
        stockStatus: filters.stockStatus,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString()
      });

      const response = await fetch(`/api/admin/products?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
        setTotalProducts(data.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleBulkAction = async (action: string, productIds: string[]) => {
    try {
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productIds })
      });

      const data = await response.json();
      
      if (data.success) {
        loadProducts(); // Reload products
        setSelectedProducts([]); // Clear selection
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleProductUpdate = async (productId: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, ...updates } : p
        ));
      }
    } catch (error) {
      console.error('Product update failed:', error);
    }
  };

  const stats = {
    total: totalProducts,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length
  };

  return (
    <AdminLayout user={user}>
      <Head>
        <title>Gestion des Produits - Admin Kamba Lhains</title>
      </Head>

      <div className={styles.productsPage}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Produits</h1>
            <p className={styles.pageSubtitle}>
              Gérez votre catalogue de {totalProducts} produits
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
            >
              🔍 Filtres
            </button>
            
            <div className={styles.viewToggle}>
              <button
                onClick={() => setViewMode('table')}
                className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
              >
                📋
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              >
                ⊞
              </button>
            </div>

            <Link href="/admin/products/add" className={styles.addButton}>
              ➕ Ajouter un produit
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: '#3b82f6' }}>
              🛍️
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.total}</span>
              <span className={styles.statLabel}>Total Produits</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: '#10b981' }}>
              ✅
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.active}</span>
              <span className={styles.statLabel}>Actifs</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: '#ef4444' }}>
              ❌
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.outOfStock}</span>
              <span className={styles.statLabel}>Rupture</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className={styles.statIcon} style={{ backgroundColor: '#f59e0b' }}>
              ⚠️
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{stats.lowStock}</span>
              <span className={styles.statLabel}>Stock faible</span>
            </div>
          </motion.div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className={styles.filtersPanel}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                onReset={() => setFilters({
                  search: '',
                  category: '',
                  status: '',
                  priceRange: [0, 1000],
                  stockStatus: '',
                  sortBy: 'updatedAt',
                  sortOrder: 'desc'
                })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              className={styles.bulkActionsPanel}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BulkActions
                selectedCount={selectedProducts.length}
                onAction={(action) => handleBulkAction(action, selectedProducts)}
                onClearSelection={() => setSelectedProducts([])}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Content */}
        <div className={styles.productsContent}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <p>Chargement des produits...</p>
            </div>
          ) : (
            <ProductsTable
              products={products}
              viewMode={viewMode}
              selectedProducts={selectedProducts}
              onSelectionChange={setSelectedProducts}
              onProductUpdate={handleProductUpdate}
              loading={loading}
            />
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            className={styles.pagination}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              ← Précédent
            </button>

            <div className={styles.paginationInfo}>
              Page {currentPage} sur {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Suivant →
            </button>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .${styles.productsPage} {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .${styles.pageHeader} {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .${styles.headerLeft} {
          flex: 1;
        }

        .${styles.pageTitle} {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .${styles.pageSubtitle} {
          color: #6b7280;
          margin: 0;
        }

        .${styles.headerActions} {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .${styles.filterToggle} {
          padding: 8px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s;
        }

        .${styles.filterToggle}:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .${styles.filterToggle}.${styles.active} {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1d4ed8;
        }

        .${styles.viewToggle} {
          display: flex;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
        }

        .${styles.viewButton} {
          padding: 8px 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .${styles.viewButton}.${styles.active} {
          background: #3b82f6;
          color: white;
        }

        .${styles.addButton} {
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }

        .${styles.addButton}:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .${styles.statsGrid} {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .${styles.statCard} {
          background: white;
          border-radius: 8px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .${styles.statIcon} {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }

        .${styles.statContent} {
          display: flex;
          flex-direction: column;
        }

        .${styles.statValue} {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .${styles.statLabel} {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .${styles.filtersPanel} {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .${styles.bulkActionsPanel} {
          margin-bottom: 16px;
        }

        .${styles.productsContent} {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .${styles.loadingContainer} {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: #6b7280;
        }

        .${styles.spinner} {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .${styles.pagination} {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .${styles.paginationButton} {
          padding: 8px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s;
        }

        .${styles.paginationButton}:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .${styles.paginationButton}:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .${styles.paginationInfo} {
          font-size: 14px;
          color: #6b7280;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .${styles.pageHeader} {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .${styles.headerActions} {
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 640px) {
          .${styles.productsPage} {
            padding: 16px;
          }

          .${styles.statsGrid} {
            grid-template-columns: repeat(2, 1fr);
          }

          .${styles.headerActions} {
            gap: 8px;
          }

          .${styles.addButton} {
            padding: 8px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Vérification d'authentification
  const { req } = context;
  const authToken = req.cookies.admin_token;
  
  if (!authToken || authToken !== 'admin_authenticated') {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false
      }
    };
  }

  const user = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: '/images/admin-avatar.jpg'
  };

  return {
    props: { user }
  };
};
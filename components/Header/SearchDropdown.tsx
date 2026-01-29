import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { products } from '../../data/products';
import { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import styles from './SearchDropdown.module.css';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  // Suggestions configuration - now using translations
  const suggestions = [
    t('searchSuggestions.voileDeCorps'),
    t('searchSuggestions.veste'),
    t('searchSuggestions.denim'),
    t('searchSuggestions.chemise'),
    t('searchSuggestions.pantalon'),
  ];
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get random products from specific categories
  const getRandomProductsByCategories = () => {
    const categories = ['aube', 'zenith', 'crepuscule', 'denim'];
    const selectedProducts: Product[] = [];
    const selectedIds = new Set<string>();

    // Get one random product from each of the 4 main categories
    categories.forEach(category => {
      const categoryProducts = products.filter(p => p.subCategory === category);
      if (categoryProducts.length > 0) {
        const randomIndex = Math.floor(Math.random() * categoryProducts.length);
        const product = categoryProducts[randomIndex];
        selectedProducts.push(product);
        selectedIds.add(product.id);
      }
    });

    // Get one more random product from zenith (5th product), different from the first one
    const zenithProducts = products.filter(p => p.subCategory === 'zenith' && !selectedIds.has(p.id));
    if (zenithProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * zenithProducts.length);
      selectedProducts.push(zenithProducts[randomIndex]);
    }

    return selectedProducts;
  };

  // Mount component
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Initialize random products when modal opens
  useEffect(() => {
    if (isOpen) {
      const randomProducts = getRandomProductsByCategories();
      setDisplayProducts(randomProducts);
      setFilteredProducts(randomProducts);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter products by search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(displayProducts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category?.toLowerCase().includes(query);
      const subCategoryMatch = product.subCategory?.toLowerCase().includes(query);
      const descriptionMatch = Array.isArray(product.description)
        ? product.description.some(desc => desc.toLowerCase().includes(query))
        : product.description?.toLowerCase().includes(query);

      return nameMatch || categoryMatch || subCategoryMatch || descriptionMatch;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, displayProducts]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleProductClick = () => {
    onClose();
    setSearchQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  const getProductUrl = (product: Product): string => {
    if (product.subCategory) {
      return `/${product.subCategory}`;
    }
    return '/boutique';
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchModal} ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchHeader}>
          <div className={styles.searchInputWrapper}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label={t('header.clear')}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('header.close')}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.searchBody}>
          {/* Suggestions Sidebar */}
          <div className={styles.suggestionsSidebar}>
            <h3 className={styles.sidebarTitle}>{t('header.suggestions')}</h3>
            <div className={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsContent}>
            {filteredProducts.length > 0 ? (
              <div className={styles.productsGrid}>
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={getProductUrl(product)}
                    className={styles.productCard}
                    onClick={handleProductClick}
                  >
                    <div className={styles.productImageWrapper}>
                      <Image width={600} height={750} src={product.image}
                        alt={product.name}
                        className={styles.productImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.png';
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <svg
                  className={styles.noResultsIcon}
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p className={styles.noResultsText}>{t('header.noProductsFound')}</p>
                <p className={styles.noResultsSubtext}>
                  {searchQuery ? t('header.tryOtherKeywords') : t('header.collectionEmpty')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SearchDropdown;

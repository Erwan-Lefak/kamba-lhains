import Link from 'next/link';
import { useCategoriesModal } from '../contexts/CategoriesModalContext';
import styles from '../styles/ProductPage.module.css';

const GlobalCategoriesModal = () => {
  const { isModalOpen, openCategories, closeModal, toggleCategory } = useCategoriesModal();

  const renderCategoriesModal = () => {
    const mainCategories = ['Aube', 'Zénith', 'Crépuscule'];
    const subCategories = ['Denim', 'T-Shirt', 'Sweat-shirt', 'Sweatpants', 'Baggy Jeans', 'Short', 'Pantalon Cargo', 'Veste en Jeans', 'Underwear'];
    
    return (
      <div>
        <div className={styles.categoriesList}>
          {/* Lien "Tous" simple */}
          <div className={styles.categoryItem}>
            <Link href="/tous-les-produits" className={styles.allProductsLink}>
              <h4>Tous</h4>
            </Link>
          </div>

          {/* Catégories principales avec sous-catégories */}
          {mainCategories.map((category, index) => (
            <div key={category} className={styles.categoryItem}>
              <div 
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category)}
              >
                <h4>{category}</h4>
                <span className={`${styles.categoryArrow} ${openCategories[category] ? styles.open : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
              {openCategories[category] && (
                <div className={styles.subcategoriesList}>
                  {subCategories.map((subcategory) => (
                    <Link 
                      key={subcategory} 
                      href={`/${subcategory.toLowerCase()}`}
                      className={styles.subcategoryItem}
                    >
                      {subcategory}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className={`${styles.modalOverlay} ${isModalOpen ? styles.open : ''}`}
        onClick={closeModal}
      />

      {/* Categories Modal */}
      <div className={`${styles.slidingModal} ${isModalOpen ? styles.open : ''}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Catégories</h2>
          <button className={styles.closeButton} onClick={closeModal}>
            ×
          </button>
        </div>
        <div className={styles.modalContent}>
          {renderCategoriesModal()}
        </div>
      </div>
    </>
  );
};

export default GlobalCategoriesModal;
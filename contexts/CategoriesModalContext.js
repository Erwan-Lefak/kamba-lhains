import { createContext, useContext, useState } from 'react';

const CategoriesModalContext = createContext();

export const useCategoriesModal = () => {
  const context = useContext(CategoriesModalContext);
  if (!context) {
    throw new Error('useCategoriesModal must be used within a CategoriesModalProvider');
  }
  return context;
};

export const CategoriesModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setOpenCategories({ [category]: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const toggleCategory = (categoryName) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const value = {
    isModalOpen,
    selectedCategory,
    openCategories,
    openModal,
    closeModal,
    toggleCategory
  };

  return (
    <CategoriesModalContext.Provider value={value}>
      {children}
    </CategoriesModalContext.Provider>
  );
};
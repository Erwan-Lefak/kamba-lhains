import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';

interface FavoriteItem extends Product {
  selectedColor?: string;
  selectedSize?: string;
  variantImage?: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  removeFromFavorites: (productId: string, selectedColor?: string) => void;
  isFavorite: (productId: string, selectedColor?: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (product: Product, selectedColor?: string, selectedSize?: string) => {
    setFavorites(prev => {
      // Use first color if no color is selected
      const colorToUse = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);

      // Check if this exact variant (product ID + color) already exists in favorites
      if (prev.some(fav => fav.id === product.id && fav.selectedColor === colorToUse)) {
        return prev;
      }

      // Determine the correct image for the selected variant
      let variantImage = product.image;

      if (colorToUse) {
        // Check for imagesByColorAndSize first (most specific)
        if (selectedSize && product.imagesByColorAndSize &&
            product.imagesByColorAndSize[colorToUse] &&
            product.imagesByColorAndSize[colorToUse][selectedSize]) {
          const images = product.imagesByColorAndSize[colorToUse][selectedSize];
          variantImage = Array.isArray(images) ? images[0] : images;
        }
        // Then check for imagesByColor
        else if (product.imagesByColor && product.imagesByColor[colorToUse]) {
          const images = product.imagesByColor[colorToUse];
          variantImage = Array.isArray(images) ? images[0] : images;
        }
      }

      const favoriteItem: FavoriteItem = {
        ...product,
        selectedColor: colorToUse,
        selectedSize,
        variantImage
      };

      return [...prev, favoriteItem];
    });
  };

  const removeFromFavorites = (productId: string, selectedColor?: string) => {
    setFavorites(prev => {
      // If a color is specified, remove only that variant
      if (selectedColor) {
        return prev.filter(fav => !(fav.id === productId && fav.selectedColor === selectedColor));
      }
      // Otherwise, remove all variants of this product
      return prev.filter(fav => fav.id !== productId);
    });
  };

  const isFavorite = (productId: string, selectedColor?: string) => {
    // If a color is specified, check for that specific variant
    if (selectedColor) {
      return favorites.some(fav => fav.id === productId && fav.selectedColor === selectedColor);
    }
    // Otherwise, check if any variant of this product is in favorites
    return favorites.some(fav => fav.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
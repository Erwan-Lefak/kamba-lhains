import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartContextType, CartItem, Product, CartAction, CartState } from '../types';
import { trackAddToCart } from '../utils/sessionManager';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer pour gérer les actions du panier
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && 
                 item.size === action.payload.size && 
                 item.color === action.payload.color
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.cartId !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.cartId === action.payload.cartId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persistence dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('kamba-cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kamba-cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  // Actions du panier
  const addToCart = (product: Product, selectedSize: string, selectedColor: string, quantity: number = 1) => {
    // Determine the correct image for the selected variant
    let variantImage = product.image;

    // Check for imagesByColorAndSize first (most specific)
    if (product.imagesByColorAndSize &&
        product.imagesByColorAndSize[selectedColor] &&
        product.imagesByColorAndSize[selectedColor][selectedSize]) {
      const images = product.imagesByColorAndSize[selectedColor][selectedSize];
      variantImage = Array.isArray(images) ? images[0] : images;
    }
    // Then check for imagesByColor
    else if (product.imagesByColor && product.imagesByColor[selectedColor]) {
      const images = product.imagesByColor[selectedColor];
      variantImage = Array.isArray(images) ? images[0] : images;
    }

    const cartItem = {
      cartId: `${product.id}-${selectedSize}-${selectedColor}-${Date.now()}`,
      product,
      selectedSize,
      selectedColor,
      quantity,
      addedAt: new Date().toISOString(),
      // Compatibilité avec l'ancien format
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: variantImage,  // Use variant image instead of default product image
      size: selectedSize,
      color: selectedColor,
      category: product.category
    };

    dispatch({ type: 'ADD_TO_CART', payload: cartItem });

    // Track add to cart event
    trackAddToCart(product.id, null); // userId will be null for now, can be added later
  };

  const removeFromCart = (cartId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Calculateurs
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^\d.]/g, '')) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getFormattedTotal = () => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(getTotalPrice());
  };

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getTotalItems,
    getTotalPrice,
    getFormattedTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
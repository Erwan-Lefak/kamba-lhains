// Types robustes pour l'application Kamba Lhains

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface ProductAnalytics {
  views: number;
  favorites: number;
  purchases: number;
  lastViewed?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  description: string | string[];
  price: number | string;
  originalPrice?: number;
  image: string; // Pour compatibilité
  images?: ProductImage[] | string[];
  imagesByColor?: Record<string, string[]>;
  imagesByColorAndSize?: Record<string, Record<string, string[]>>;
  variants?: ProductVariant[];
  category: string;
  subCategory?: string;
  collection?: CollectionType;
  colors?: string[];
  sizes?: string[];
  availableSizes?: string[];
  tags?: string[];
  status?: ProductStatus;
  inStock: boolean;
  featured: boolean;
  seo?: SEOData;
  analytics?: ProductAnalytics;
  metaContentId?: string; // Content ID pour Meta Pixel / Facebook Catalog
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  cartId: string;
  product: Product;
  variant?: ProductVariant;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  addedAt: string;
  // Compatibilité avec l'ancien format
  id: number;
  name: string;
  price: number | string;
  image: string;
  size: string;
  color: string;
  category: string;
}

export interface UserPreferences {
  favoriteCategories: string[];
  preferredSizes: string[];
  newsletter: boolean;
  language: 'fr' | 'en';
  currency: 'EUR' | 'USD';
  theme: 'light' | 'dark';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // firstName + lastName
  avatar?: string;
  role: 'USER' | 'ADMIN';
  preferences: UserPreferences;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFormattedTotal: () => string;
}

export interface LanguageContextType {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  t: (key: string) => string;
}

export type CartAction = 
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'TOGGLE_CART' };

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Types utilitaires
export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';
export type CollectionType = 'eclat-ombre' | 'ota-benga';
export type ViewMode = 'grid' | 'list';
export type SortOption = 'name' | 'price' | 'date' | 'popularity';
export type SortOrder = 'asc' | 'desc';

// Types pour les collections
export interface Collection {
  id: string;
  name: string;
  description: string;
  type: CollectionType;
  heroImage?: ProductImage;
  heroVideo?: string;
  products: Product[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les filtres
export interface ProductFilters {
  search: string;
  category: string;
  collection: CollectionType | '';
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  sortBy: SortOption;
  sortOrder: SortOrder;
}

// Types pour les événements analytics
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  stack?: string;
}

// Types pour l'état global
export interface AppState {
  user: User | null;
  cart: CartItem[];
  favorites: string[];
  recentlyViewed: Product[];
  preferences: UserPreferences;
  isLoading: boolean;
  error: AppError | null;
}

// Types pour les hooks
export interface UseProductsOptions {
  filters?: Partial<ProductFilters>;
  page?: number;
  limit?: number;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: AppError | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

// Types pour les performances
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

// Types pour les animations
export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
}

// Types pour les toasts/notifications
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Types pour la recherche
export interface SearchResult {
  products: Product[];
  suggestions: string[];
  filters: {
    categories: Array<{ name: string; count: number }>;
    priceRanges: Array<{ min: number; max: number; count: number }>;
    colors: Array<{ name: string; count: number }>;
    sizes: Array<{ name: string; count: number }>;
  };
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}
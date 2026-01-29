// API Client with authentication and error handling

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ProductParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface OrderData {
  items: CartItem[];
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethodId?: string;
}

interface OrderParams {
  status?: string;
  page?: number;
  limit?: number;
}

interface StatusData {
  status: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://kamba-lhains.vercel.app/api' 
      : 'http://localhost:3000/api';
    this.token = null;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: RegisterData): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: any }>> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse> {
    this.removeToken();
    return { success: true };
  }

  // Product methods
  async getProducts(params: ProductParams = {}): Promise<ApiResponse<any[]>> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<any>> {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.request('/products', {
      method: 'POST',
      body: productData,
    });
  }

  // Cart methods
  async getCart(): Promise<ApiResponse<any>> {
    return this.request('/cart');
  }

  async addToCart(item: CartItem): Promise<ApiResponse<any>> {
    return this.request('/cart', {
      method: 'POST',
      body: item,
    });
  }

  async updateCartItem(itemId: string, data: Partial<CartItem>): Promise<ApiResponse<any>> {
    return this.request(`/cart/${itemId}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<any>> {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<any>> {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData: OrderData): Promise<ApiResponse<any>> {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders(params: OrderParams = {}): Promise<ApiResponse<any[]>> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    return this.request(endpoint);
  }

  async getOrder(id: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, statusData: StatusData): Promise<ApiResponse<any>> {
    return this.request(`/orders/${id}`, {
      method: 'PATCH',
      body: statusData,
    });
  }

  async cancelOrder(id: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment methods
  async confirmPayment(paymentIntentId: string): Promise<ApiResponse<any>> {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: { paymentIntentId },
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
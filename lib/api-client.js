// API Client with authentication and error handling
class ApiClient {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://kamba-lhains.vercel.app/api' 
      : 'http://localhost:3000/api'
    this.token = null
  }

  setToken(token) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken() {
    if (this.token) return this.token
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  removeToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    })
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async logout() {
    this.removeToken()
    return { success: true }
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/products?${queryString}` : '/products'
    return this.request(endpoint)
  }

  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: productData,
    })
  }

  // Cart methods
  async getCart() {
    return this.request('/cart')
  }

  async addToCart(item) {
    return this.request('/cart', {
      method: 'POST',
      body: item,
    })
  }

  async updateCartItem(itemId, data) {
    return this.request(`/cart/${itemId}`, {
      method: 'PATCH',
      body: data,
    })
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    })
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    })
  }

  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/orders?${queryString}` : '/orders'
    return this.request(endpoint)
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  async updateOrderStatus(id, statusData) {
    return this.request(`/orders/${id}`, {
      method: 'PATCH',
      body: statusData,
    })
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    })
  }

  // Payment methods
  async confirmPayment(paymentIntentId) {
    return this.request('/payments/confirm', {
      method: 'POST',
      body: { paymentIntentId },
    })
  }
}

export const apiClient = new ApiClient()
export default apiClient
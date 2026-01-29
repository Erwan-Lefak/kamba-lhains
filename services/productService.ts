import { Product, ApiResponse } from '../types';
import { apiService } from './api';

export class ProductService {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>('/products');
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return apiService.get<Product>(`/products/${id}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>('/products?featured=true');
  }

  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>(`/products?category=${category}`);
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }
}

export const productService = new ProductService();
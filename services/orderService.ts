import { Order, ApiResponse } from '../types';
import { apiService } from './api';

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  }>;
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
  paymentMethod: string;
}

export class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    return apiService.post<Order>('/orders', orderData);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiService.get<Order>(`/orders/${id}`);
  }

  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    return apiService.get<Order[]>(`/orders?userId=${userId}`);
  }

  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<ApiResponse<Order>> {
    return apiService.put<Order>(`/orders/${orderId}/status`, { status });
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiService.put<Order>(`/orders/${orderId}/cancel`);
  }
}

export const orderService = new OrderService();

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://your-production-api.replit.app/api';

class ApiService {
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: string;
  }) {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      await AsyncStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
  }

  // User
  async getUserProfile() {
    return this.request<any>('/user/profile');
  }

  async updateProfile(data: { fullName?: string; phone?: string }) {
    return this.request<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Fuel
  async getFuelTypes() {
    return this.request<any>('/fuel/types');
  }

  async createFuelOrder(orderData: {
    fuelTypeId: number;
    quantity: number;
    deliveryAddress: string;
    deliveryTime?: string;
  }) {
    return this.request<any>('/fuel/order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Marketplace
  async getProducts(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/marketplace/products${queryString}`);
  }

  async getProductDetails(id: number) {
    return this.request<any>(`/marketplace/products/${id}`);
  }

  // Toll
  async scanTollQR(qrData: string) {
    return this.request<any>('/toll/scan', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  }

  async payToll(paymentData: {
    tollGateId: string;
    amount: number;
    paymentMethodId: string;
  }) {
    return this.request<any>('/toll/pay', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Orders
  async getOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request<any>(`/orders${queryString}`);
  }

  async getOrderDetails(id: string) {
    return this.request<any>(`/orders/${id}`);
  }
}

export default new ApiService();

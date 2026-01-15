const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(name: string, email: string, password: string) {
    const data = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  logout() {
    this.setToken(null);
  }

  // Password Reset
  async forgotPassword(email: string) {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // File Upload
  async uploadFile(file: File, type: 'product' | 'category' | 'avatar') {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/files/upload/${type}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json() as Promise<{ url: string }>;
  }

  // Users
  async getCurrentUser() {
    return this.request<UserDto>('/users/me');
  }

  async updateCurrentUser(data: Partial<UserDto>) {
    return this.request<UserDto>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Products
  async getProducts(params?: ProductQueryParams) {
    const searchParams = new URLSearchParams();
    if (params?.name) searchParams.append('name', params.name);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params?.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params?.inStock !== undefined) searchParams.append('inStock', params.inStock.toString());
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.isNew !== undefined) searchParams.append('new', params.isNew.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.size) searchParams.append('size', params.size.toString());
    
    const query = searchParams.toString();
    return this.request<PageResponse<ProductDto>>(`/products${query ? `?${query}` : ''}`);
  }

  async getProductById(id: string) {
    return this.request<ProductDto>(`/products/${id}`);
  }

  async getFeaturedProducts() {
    return this.request<ProductDto[]>('/products/featured');
  }

  async getNewProducts() {
    return this.request<ProductDto[]>('/products/new');
  }

  // Categories
  async getCategories() {
    return this.request<CategoryDto[]>('/categories');
  }

  async getCategoryById(id: string) {
    return this.request<CategoryDto>(`/categories/${id}`);
  }

  // Cart
  async getCart() {
    return this.request<CartDto>('/cart');
  }

  async addToCart(productId: string, quantity: number = 1) {
    return this.request<CartDto>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number) {
    return this.request<CartDto>(`/cart/items/${productId}?quantity=${quantity}`, {
      method: 'PUT',
    });
  }

  async removeFromCart(productId: string) {
    return this.request<CartDto>(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request<void>('/cart', { method: 'DELETE' });
  }

  // Wishlist
  async getWishlist() {
    return this.request<WishlistDto>('/wishlist');
  }

  async addToWishlist(productId: string) {
    return this.request<WishlistDto>(`/wishlist/items/${productId}`, {
      method: 'POST',
    });
  }

  async removeFromWishlist(productId: string) {
    return this.request<WishlistDto>(`/wishlist/items/${productId}`, {
      method: 'DELETE',
    });
  }

  async isInWishlist(productId: string) {
    return this.request<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
  }

  async clearWishlist() {
    return this.request<void>('/wishlist', { method: 'DELETE' });
  }

  // Orders
  async getOrders(page: number = 0, size: number = 20) {
    return this.request<PageResponse<OrderDto>>(`/orders?page=${page}&size=${size}`);
  }

  async getOrderById(id: string) {
    return this.request<OrderDto>(`/orders/${id}`);
  }

  async createOrder(shippingAddress: string) {
    return this.request<OrderDto>('/orders', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    });
  }

  async cancelOrder(id: string) {
    return this.request<OrderDto>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Reviews
  async getProductReviews(productId: string, page: number = 0, size: number = 10) {
    return this.request<PageResponse<ReviewDto>>(`/reviews/product/${productId}?page=${page}&size=${size}`);
  }

  async createReview(productId: string, rating: number, comment?: string) {
    return this.request<ReviewDto>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment }),
    });
  }

  async updateReview(id: string, rating: number, comment?: string) {
    return this.request<ReviewDto>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ rating, comment }),
    });
  }

  async deleteReview(id: string) {
    return this.request<void>(`/reviews/${id}`, { method: 'DELETE' });
  }

  // Payments
  async createPaymentIntent(orderId: string) {
    return this.request<PaymentDto>(`/payments/create-intent/${orderId}`, {
      method: 'POST',
    });
  }

  async confirmPayment(paymentIntentId: string) {
    return this.request<PaymentDto>(`/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
    });
  }

  async getPaymentStatus(paymentIntentId: string) {
    return this.request<PaymentDto>(`/payments/status/${paymentIntentId}`);
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<DashboardStatsDto>('/admin/dashboard');
  }

  async getAnalytics(days: number = 30) {
    return this.request<AnalyticsDto>(`/admin/analytics?days=${days}`);
  }

  async getAllUsers(page: number = 0, size: number = 20) {
    return this.request<PageResponse<UserDto>>(`/admin/users?page=${page}&size=${size}`);
  }

  async getUserById(id: string) {
    return this.request<UserDto>(`/admin/users/${id}`);
  }

  async updateUser(id: string, data: Partial<UserDto>) {
    return this.request<UserDto>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async setUserRole(id: string, role: string) {
    return this.request<UserDto>(`/admin/users/${id}/role?role=${role}`, {
      method: 'PATCH',
    });
  }

  async toggleUserEnabled(id: string) {
    return this.request<UserDto>(`/admin/users/${id}/toggle-enabled`, {
      method: 'PATCH',
    });
  }

  async getAllOrders(page: number = 0, size: number = 20) {
    return this.request<PageResponse<OrderDto>>(`/admin/orders?page=${page}&size=${size}`);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<OrderDto>(`/admin/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
    });
  }

  // Products CRUD (uses /api/products, not /admin/products - admin check is via role)
  async createProduct(product: Partial<ProductDto>) {
    return this.request<ProductDto>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<ProductDto>) {
    return this.request<ProductDto>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string) {
    return this.request<void>(`/products/${id}`, { method: 'DELETE' });
  }

  // Categories CRUD (uses /api/categories, not /admin/categories)
  async createCategory(category: Partial<CategoryDto>) {
    return this.request<CategoryDto>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<CategoryDto>) {
    return this.request<CategoryDto>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string) {
    return this.request<void>(`/categories/${id}`, { method: 'DELETE' });
  }
}

// Types
export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
  enabled?: boolean;
  createdAt?: string;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categoryId?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount?: number;
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
}

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
  count: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
  totalPrice: number;
  totalItems: number;
}

export interface CartItemDto {
  id: string;
  productId: string;
  name: string;
  image: string;
  category?: string;
  price: number;
  quantity: number;
}

export interface WishlistDto {
  id: string;
  items: ProductDto[];
}

export interface OrderDto {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItemDto[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentId?: string;
  paymentStatus: string;
  createdAt: string;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
}

export interface ReviewDto {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PaymentDto {
  orderId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductQueryParams {
  name?: string;
  category?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  page?: number;
  size?: number;
}

export interface DashboardStatsDto {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

export interface AnalyticsDto {
  dailyStats: DailyStats[];
  categorySales: CategorySales[];
  topProducts: TopProduct[];
  orderStatusBreakdown: OrderStatusBreakdown;
}

export interface DailyStats {
  date: string;
  orders: number;
  revenue: number;
}

export interface CategorySales {
  category: string;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  name: string;
  sold: number;
}

export interface OrderStatusBreakdown {
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export const api = new ApiService();
export default api;

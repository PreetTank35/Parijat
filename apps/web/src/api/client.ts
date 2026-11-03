import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 15000, // 15s timeout — prevents silent hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if stored in localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('parijat_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API helper functions
export const api = {
  // Auth
  requestOtp: (phone: string) => apiClient.post('/auth/request-otp', { phone }),
  verifyOtp: (phone: string, otp: string) => apiClient.post('/auth/verify-otp', { phone, otp }),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),

  // User / Profile
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.patch('/users/me', data),

  // Equipment
  getCategories: () => apiClient.get('/equipment/categories'),
  getVillages: () => apiClient.get('/equipment/villages'),
  searchEquipment: (params?: any) => apiClient.get('/equipment', { params }),
  getEquipmentById: (id: string) => apiClient.get(`/equipment/${id}`),
  createEquipment: (data: any) => apiClient.post('/equipment', data),
  updateEquipment: (id: string, data: any) => apiClient.patch(`/equipment/${id}`, data),
  deleteEquipment: (id: string) => apiClient.delete(`/equipment/${id}`),

  // Bookings
  createBooking: (data: any) => apiClient.post('/bookings', data),
  getMyBookings: () => apiClient.get('/bookings/mine'),
  getIncomingBookings: () => apiClient.get('/bookings/incoming'),
  getBookingById: (id: string) => apiClient.get(`/bookings/${id}`),
  updateBookingStatus: (id: string, status: string, reason?: string) =>
    apiClient.patch(`/bookings/${id}/status`, { status, reason }),

  // Reviews
  createReview: (data: any) => apiClient.post('/reviews', data),
  getEquipmentReviews: (id: string) => apiClient.get(`/reviews/equipment/${id}`),

  // Crop Prices
  getCrops: () => apiClient.get('/crops'),
  getMarkets: () => apiClient.get('/markets'),
  getMarketPrices: (params?: any) => apiClient.get('/market-prices', { params }),
  getPriceEstimate: (data: any) => apiClient.post('/price-estimates', data),

  // Supplies & Group Purchases
  getInputs: (params?: any) => apiClient.get('/inputs', { params }),
  getInputById: (id: string) => apiClient.get(`/inputs/${id}`),
  createGroupPurchase: (data: any) => apiClient.post('/group-purchases', data),
  getMyGroupPurchases: () => apiClient.get('/group-purchases/mine'),
  joinGroupPurchase: (id: string, quantity: number) =>
    apiClient.post(`/group-purchases/${id}/join`, { quantity }),

  // Messaging
  getConversations: () => apiClient.get('/conversations'),
  createConversation: (participantId: string, listingId?: string) =>
    apiClient.post('/conversations', { participantId, listingId }),
  getMessages: (conversationId: string) => apiClient.get(`/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: string, text: string) =>
    apiClient.post(`/conversations/${conversationId}/messages`, { text }),

  // Notifications
  getNotifications: () => apiClient.get('/notifications'),
  markNotificationRead: (id: string) => apiClient.patch(`/notifications/${id}/read`),
};

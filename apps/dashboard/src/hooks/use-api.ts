import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { StacksPaySDK } from '@stackspay/sdk';
import { useAuthStore } from '../store/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Initialize SDK (for future use)
// const sdk = new StacksPaySDK({
//   apiKey: '', // Will be set dynamically
//   baseUrl: API_BASE_URL,
// });

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Dashboard stats
  getDashboardStats: async (apiKey: string) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Payments
  getPayments: async (apiKey: string, params?: { limit?: number; offset?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const response = await fetch(`${API_BASE_URL}/payments?${searchParams}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
  },

  // Create payment
  createPayment: async (apiKey: string, paymentData: {
    amount: number;
    currency: string;
    description?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) throw new Error('Failed to create payment');
    return response.json();
  },

  // Settings
  getSettings: async (apiKey: string) => {
    const response = await fetch(`${API_BASE_URL}/merchant/settings`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  updateSettings: async (apiKey: string, settings: any) => {
    const response = await fetch(`${API_BASE_URL}/merchant/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  },

  // Analytics
  getAnalytics: async (apiKey: string, period: string = '30d') => {
    const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },
};

// React Query hooks
export const useDashboardStats = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.getDashboardStats(user?.apiKey || ''),
    enabled: !!user?.apiKey,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const usePayments = (params?: { limit?: number; offset?: number; status?: string }) => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => api.getPayments(user?.apiKey || '', params),
    enabled: !!user?.apiKey,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (paymentData: { amount: number; currency: string; description?: string }) =>
      api.createPayment(user?.apiKey || '', paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useSettings = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(user?.apiKey || ''),
    enabled: !!user?.apiKey,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  return useMutation({
    mutationFn: (settings: any) => api.updateSettings(user?.apiKey || '', settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

export const useAnalytics = (period: string = '30d') => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => api.getAnalytics(user?.apiKey || '', period),
    enabled: !!user?.apiKey,
  });
};

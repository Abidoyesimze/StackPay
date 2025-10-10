import { create } from 'zustand';

export interface Payment {
  id: string;
  amountBtc: number;
  amountUsd: number;
  currency: 'BTC' | 'USD';
  status: 'pending' | 'confirming' | 'confirmed' | 'expired' | 'failed';
  description?: string;
  createdAt: Date;
  confirmedAt?: Date;
  expiresAt: Date;
  confirmations: number;
  txHash?: string;
}

export interface DashboardStats {
  totalRevenue: {
    today: number;
    week: number;
    month: number;
    allTime: number;
  };
  activePayments: number;
  completedPayments: number;
  conversionRate: number;
}

interface DashboardState {
  stats: DashboardStats;
  recentPayments: Payment[];
  isLoading: boolean;
  lastUpdated: Date | null;
  setStats: (stats: DashboardStats) => void;
  setRecentPayments: (payments: Payment[]) => void;
  setLoading: (loading: boolean) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  refresh: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: {
    totalRevenue: {
      today: 0,
      week: 0,
      month: 0,
      allTime: 0,
    },
    activePayments: 0,
    completedPayments: 0,
    conversionRate: 0,
  },
  recentPayments: [],
  isLoading: false,
  lastUpdated: null,
  setStats: (stats) => set({ stats, lastUpdated: new Date() }),
  setRecentPayments: (recentPayments) => set({ recentPayments }),
  setLoading: (isLoading) => set({ isLoading }),
  updatePayment: (paymentId, updates) => {
    const { recentPayments } = get();
    const updatedPayments = recentPayments.map(payment =>
      payment.id === paymentId ? { ...payment, ...updates } : payment
    );
    set({ recentPayments: updatedPayments });
  },
  refresh: () => {
    set({ lastUpdated: new Date() });
  },
}));

'use client';

import React from 'react';
import { StatsCards } from '../../components/overview/stats-cards';
import { RecentPayments } from '../../components/overview/recent-payments';
import { ConversionChart } from '../../components/overview/conversion-chart';
import { QuickActions } from '../../components/overview/quick-actions';
import { useDashboardStats, usePayments } from '../../hooks/use-api';

export default function OverviewPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: payments, isLoading: paymentsLoading } = usePayments({ limit: 10 });

  const handleCreatePayment = () => {
    // TODO: Implement create payment modal
    console.log('Create payment clicked');
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export data clicked');
  };

  // Mock data for demo purposes
  const mockStats = {
    totalRevenue: {
      today: 0.001234,
      week: 0.008765,
      month: 0.034567,
      allTime: 0.123456,
    },
    activePayments: 3,
    completedPayments: 127,
    conversionRate: 78.5,
  };

  const mockPayments = [
    {
      id: 'inv_1234567890',
      amountBtc: 0.001234,
      amountUsd: 55.53,
      currency: 'BTC' as const,
      status: 'confirmed' as const,
      description: 'Coffee shop purchase',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      expiresAt: new Date('2024-01-15T11:30:00Z'),
      confirmations: 6,
      txHash: 'abc123def456',
    },
    {
      id: 'inv_0987654321',
      amountBtc: 0.000876,
      amountUsd: 39.42,
      currency: 'BTC' as const,
      status: 'pending' as const,
      description: 'Online store order',
      createdAt: new Date('2024-01-15T09:15:00Z'),
      expiresAt: new Date('2024-01-15T10:15:00Z'),
      confirmations: 0,
    },
    {
      id: 'inv_5555555555',
      amountBtc: 0.002345,
      amountUsd: 105.53,
      currency: 'BTC' as const,
      status: 'confirming' as const,
      description: 'Restaurant bill',
      createdAt: new Date('2024-01-15T08:45:00Z'),
      expiresAt: new Date('2024-01-15T09:45:00Z'),
      confirmations: 2,
      txHash: 'def456ghi789',
    },
  ];

  const mockChartData = [
    { date: '2024-01-01', conversionRate: 72, payments: 15 },
    { date: '2024-01-02', conversionRate: 78, payments: 23 },
    { date: '2024-01-03', conversionRate: 75, payments: 18 },
    { date: '2024-01-04', conversionRate: 82, payments: 31 },
    { date: '2024-01-05', conversionRate: 79, payments: 27 },
    { date: '2024-01-06', conversionRate: 85, payments: 35 },
    { date: '2024-01-07', conversionRate: 81, payments: 29 },
  ];

  if (statsLoading || paymentsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <StatsCards stats={stats || mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionChart data={mockChartData} />
        <QuickActions 
          onCreatePayment={handleCreatePayment}
          onExportData={handleExportData}
        />
      </div>

      <RecentPayments payments={payments?.payments || mockPayments} />
    </div>
  );
}

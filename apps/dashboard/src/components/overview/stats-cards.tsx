'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { formatBTC, formatCurrency } from '@stackspay/utils';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Bitcoin } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalRevenue: {
      today: number;
      week: number;
      month: number;
      allTime: number;
    };
    activePayments: number;
    completedPayments: number;
    conversionRate: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue (All Time)',
      value: formatBTC(stats.totalRevenue.allTime),
      subtitle: `$${formatCurrency(stats.totalRevenue.allTime * 45000)} USD`,
      icon: Bitcoin,
      trend: '+12.5%',
      trendUp: true,
      color: 'from-bitcoin-500 to-bitcoin-600',
    },
    {
      title: 'Active Payments',
      value: stats.activePayments.toString(),
      subtitle: 'Currently processing',
      icon: CreditCard,
      trend: '+3.2%',
      trendUp: true,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Completed Payments',
      value: stats.completedPayments.toString(),
      subtitle: 'All time',
      icon: TrendingUp,
      trend: '+8.1%',
      trendUp: true,
      color: 'from-accent-green to-accent-lime',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      subtitle: 'Last 30 days',
      icon: TrendingDown,
      trend: '-2.1%',
      trendUp: false,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="glass-card hover:shadow-card transition-all duration-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {card.title}
            </CardTitle>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-card`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-text-primary mb-1">{card.value}</div>
            <p className="text-sm text-text-secondary mb-3">{card.subtitle}</p>
            <div className="flex items-center">
              {card.trendUp ? (
                <TrendingUp className="h-4 w-4 text-accent-green mr-2" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={`text-sm font-medium ${card.trendUp ? 'text-accent-green' : 'text-red-500'}`}>
                {card.trend}
              </span>
              <span className="text-sm text-text-secondary ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

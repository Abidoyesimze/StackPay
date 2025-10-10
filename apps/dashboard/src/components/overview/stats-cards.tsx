'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { formatBTC, formatCurrency } from '@stackspay/utils';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

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
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Active Payments',
      value: stats.activePayments.toString(),
      subtitle: 'Currently processing',
      icon: CreditCard,
      trend: '+3.2%',
      trendUp: true,
    },
    {
      title: 'Completed Payments',
      value: stats.completedPayments.toString(),
      subtitle: 'All time',
      icon: TrendingUp,
      trend: '+8.1%',
      trendUp: true,
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      subtitle: 'Last 30 days',
      icon: TrendingDown,
      trend: '-2.1%',
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            <div className="flex items-center pt-1">
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs ${card.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend}
              </span>
              <span className="text-xs text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

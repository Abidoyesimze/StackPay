'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@stackspay/ui';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@stackspay/utils';

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('30d');

  // Mock data for demo purposes
  const revenueData = [
    { date: '2024-01-01', revenue: 1250, transactions: 15 },
    { date: '2024-01-02', revenue: 1890, transactions: 23 },
    { date: '2024-01-03', revenue: 1560, transactions: 18 },
    { date: '2024-01-04', revenue: 2340, transactions: 31 },
    { date: '2024-01-05', revenue: 2100, transactions: 27 },
    { date: '2024-01-06', revenue: 2870, transactions: 35 },
    { date: '2024-01-07', revenue: 2450, transactions: 29 },
    { date: '2024-01-08', revenue: 3120, transactions: 42 },
    { date: '2024-01-09', revenue: 2780, transactions: 38 },
    { date: '2024-01-10', revenue: 3450, transactions: 48 },
  ];

  const paymentMethodsData = [
    { name: 'Bitcoin', value: 78, color: '#f7931a' },
    { name: 'Lightning', value: 15, color: '#fbbf24' },
    { name: 'Other', value: 7, color: '#6b7280' },
  ];

  const geographyData = [
    { country: 'United States', payments: 45, revenue: 12500 },
    { country: 'Canada', payments: 23, revenue: 6700 },
    { country: 'United Kingdom', payments: 18, revenue: 5400 },
    { country: 'Germany', payments: 15, revenue: 4200 },
    { country: 'Australia', payments: 12, revenue: 3600 },
    { country: 'Other', payments: 27, revenue: 7200 },
  ];

  const transactionValueData = [
    { range: '$0-10', count: 45 },
    { range: '$10-25', count: 67 },
    { range: '$25-50', count: 89 },
    { range: '$50-100', count: 56 },
    { range: '$100-250', count: 34 },
    { range: '$250+', count: 23 },
  ];

  const avgTransactionValue = 45.67;
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = revenueData.reduce((sum, item) => sum + item.transactions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +3.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.4% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${formatCurrency(value)}` : value,
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Geography */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Geography</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {geographyData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.country}</div>
                    <div className="text-sm text-muted-foreground">{item.payments} payments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${formatCurrency(item.revenue)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((item.revenue / totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

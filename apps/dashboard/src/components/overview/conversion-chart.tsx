'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConversionChartProps {
  data: Array<{
    date: string;
    conversionRate: number;
    payments: number;
  }>;
}

export function ConversionChart({ data }: ConversionChartProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-text-primary">Conversion Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => `${value}%`}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="conversionRate" 
                stroke="var(--accent-green)" 
                strokeWidth={3}
                dot={{ fill: 'var(--accent-green)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: 'var(--accent-green)', stroke: 'var(--accent-green)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

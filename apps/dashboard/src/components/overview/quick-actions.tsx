'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { Button } from '@stackspay/ui';
import { Plus, Download, Settings, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onCreatePayment: () => void;
  onExportData: () => void;
}

export function QuickActions({ onCreatePayment, onExportData }: QuickActionsProps) {
  const actions = [
    {
      title: 'Create Payment',
      description: 'Generate a new Bitcoin payment request',
      icon: Plus,
      action: onCreatePayment,
      variant: 'default' as const,
      color: 'from-accent-green to-accent-lime',
    },
    {
      title: 'Export Data',
      description: 'Download payment data as CSV',
      icon: Download,
      action: onExportData,
      variant: 'outline' as const,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'View Analytics',
      description: 'Detailed payment analytics',
      icon: BarChart3,
      action: () => window.location.href = '/analytics',
      variant: 'outline' as const,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Settings',
      description: 'Configure your account',
      icon: Settings,
      action: () => window.location.href = '/settings',
      variant: 'outline' as const,
      color: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-text-primary">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className={`h-auto p-4 flex flex-col items-start space-y-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                action.variant === 'default' 
                  ? 'brand-button' 
                  : 'border border-border hover:bg-surface/80 hover:border-accent-green/30'
              }`}
              onClick={action.action}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-card`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-text-primary">{action.title}</span>
              </div>
              <span className="text-sm text-text-secondary text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

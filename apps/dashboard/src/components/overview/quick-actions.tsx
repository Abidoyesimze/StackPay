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
    },
    {
      title: 'Export Data',
      description: 'Download payment data as CSV',
      icon: Download,
      action: onExportData,
      variant: 'outline' as const,
    },
    {
      title: 'View Analytics',
      description: 'Detailed payment analytics',
      icon: BarChart3,
      action: () => window.location.href = '/analytics',
      variant: 'outline' as const,
    },
    {
      title: 'Settings',
      description: 'Configure your account',
      icon: Settings,
      action: () => window.location.href = '/settings',
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={action.action}
            >
              <div className="flex items-center space-x-2">
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-sm text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

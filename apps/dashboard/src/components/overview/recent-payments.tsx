'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { Badge } from '@stackspay/ui';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@stackspay/ui';
import { formatBTC, formatCurrency } from '@stackspay/utils';
import { format } from 'date-fns';
import { Eye, ExternalLink } from 'lucide-react';
import { Button } from '@stackspay/ui';

interface Payment {
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

interface RecentPaymentsProps {
  payments: Payment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      confirming: { variant: 'secondary' as const, label: 'Confirming' },
      confirmed: { variant: 'success' as const, label: 'Confirmed' },
      expired: { variant: 'destructive' as const, label: 'Expired' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatAmount = (payment: Payment) => {
    if (payment.currency === 'BTC') {
      return `${formatBTC(payment.amountBtc)} BTC`;
    }
    return `$${formatCurrency(payment.amountUsd)}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Payments</CardTitle>
        <Button variant="outline" size="sm">
          View All
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.slice(0, 5).map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">
                  {payment.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="font-medium">
                  {formatAmount(payment)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(payment.status)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {payments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No payments yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}

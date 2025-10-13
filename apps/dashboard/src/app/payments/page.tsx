'use client';

import React, { useState } from 'react';
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
import { Button } from '@stackspay/ui';
import { Input } from '@stackspay/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@stackspay/ui';
import { formatBTC, formatCurrency } from '@stackspay/utils';
import { format } from 'date-fns';
import { Search, Download, Eye, RefreshCw } from 'lucide-react';
import { usePayments } from '../../hooks/use-api';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);

  const { data: paymentsData, isLoading, refetch } = usePayments({
    limit: pageSize,
    offset: currentPage * pageSize,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      confirming: { variant: 'secondary' as const, label: 'Confirming' },
      confirmed: { variant: 'success' as const, label: 'Confirmed' },
      expired: { variant: 'destructive' as const, label: 'Expired' },
      failed: { variant: 'destructive' as const, label: 'Failed' },
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatAmount = (amountBtc: number, amountUsd: number, currency: string) => {
    if (currency === 'BTC') {
      return `${formatBTC(amountBtc)} BTC`;
    }
    return `$${formatCurrency(amountUsd)}`;
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Export CSV clicked');
  };

  const handleViewPayment = (paymentId: string) => {
    // TODO: Implement payment details modal
    console.log('View payment:', paymentId);
  };

  // Mock data for demo purposes
  const mockPayments = [
    {
      id: 'inv_1234567890',
      amountBtc: 0.001234,
      amountUsd: 55.53,
      currency: 'BTC',
      status: 'confirmed',
      description: 'Coffee shop purchase',
      createdAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-01-15T11:30:00Z',
      confirmations: 6,
      txHash: 'abc123def456',
    },
    {
      id: 'inv_0987654321',
      amountBtc: 0.000876,
      amountUsd: 39.42,
      currency: 'BTC',
      status: 'pending',
      description: 'Online store order',
      createdAt: '2024-01-15T09:15:00Z',
      expiresAt: '2024-01-15T10:15:00Z',
      confirmations: 0,
    },
    {
      id: 'inv_5555555555',
      amountBtc: 0.002345,
      amountUsd: 105.53,
      currency: 'BTC',
      status: 'confirming',
      description: 'Restaurant bill',
      createdAt: '2024-01-15T08:45:00Z',
      expiresAt: '2024-01-15T09:45:00Z',
      confirmations: 2,
      txHash: 'def456ghi789',
    },
    {
      id: 'inv_1111111111',
      amountBtc: 0.000567,
      amountUsd: 25.52,
      currency: 'BTC',
      status: 'expired',
      description: 'Quick purchase',
      createdAt: '2024-01-14T16:20:00Z',
      expiresAt: '2024-01-14T17:20:00Z',
      confirmations: 0,
    },
    {
      id: 'inv_2222222222',
      amountBtc: 0.001890,
      amountUsd: 85.05,
      currency: 'BTC',
      status: 'failed',
      description: 'Service payment',
      createdAt: '2024-01-14T14:10:00Z',
      expiresAt: '2024-01-14T15:10:00Z',
      confirmations: 0,
    },
  ];

  const filteredPayments = (paymentsData?.payments || mockPayments).filter((payment: any) => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / pageSize);
  const paginatedPayments = filteredPayments.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirming">Confirming</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Payments ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Confirmations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(payment.amountBtc, payment.amountUsd, payment.currency)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {payment.description || 'No description'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {payment.confirmations > 0 ? (
                          <span className="text-green-600 font-medium">
                            {payment.confirmations}/6
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0/6</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPayment(payment.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {paginatedPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No payments found
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, filteredPayments.length)} of {filteredPayments.length} payments
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

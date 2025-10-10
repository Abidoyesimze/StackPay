'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@stackspay/ui';
import { Button } from '@stackspay/ui';
import { Input } from '@stackspay/ui';
import { Label } from '@stackspay/ui';
import { useAuthStore } from '../../store/auth-store';
import { TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual authentication
      // For now, just simulate a login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      login(
        {
          id: '1',
          email: email,
          businessName: 'Demo Business',
        },
        'demo_api_key_123'
      );

      // Redirect to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">StackPay</span>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo credentials: any email and password will work
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo dashboard. Use any credentials to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

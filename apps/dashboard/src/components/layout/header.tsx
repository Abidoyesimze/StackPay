'use client';

import React from 'react';
import { Button } from '@stackspay/ui';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-lg border-b border-border/60 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-surface/80 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary">Manage your Bitcoin payments</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-surface/80 rounded-xl"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
          </Button>
          
          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-surface/50 border border-border/50">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-lime rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-text-primary">Merchant</div>
              <div className="text-xs text-text-secondary">merchant@example.com</div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-surface/80 rounded-xl"
          >
            <LogOut className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>
      </div>
    </header>
  );
}

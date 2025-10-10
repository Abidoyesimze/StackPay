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
    <header className="bg-background border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden lg:block">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium">Merchant</div>
              <div className="text-xs text-muted-foreground">merchant@example.com</div>
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

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
    <header className="bg-background/95 backdrop-blur-lg border-b border-border/60 px-4 sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-gray-800/50 dark:hover:bg-gray-700/50 rounded-xl flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden lg:block min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary truncate">Dashboard</h1>
            <p className="text-sm text-text-secondary">Manage your Bitcoin payments</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-gray-800/50 dark:hover:bg-gray-700/50 rounded-xl flex-shrink-0"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
          </Button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-xl bg-gray-800/50 dark:bg-gray-700/50 border border-border/50 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-lime rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">Merchant</div>
              <div className="text-xs text-text-secondary truncate">merchant@example.com</div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-gray-800/50 dark:hover:bg-gray-700/50 rounded-xl flex-shrink-0"
          >
            <LogOut className="w-5 h-5 text-text-secondary" />
          </Button>
        </div>
      </div>
    </header>
  );
}

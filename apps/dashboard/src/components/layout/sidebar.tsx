'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@stackspay/utils';
import { 
  BarChart3, 
  CreditCard, 
  Settings, 
  Home, 
  Bitcoin,
  X
} from 'lucide-react';
import { Button } from '@stackspay/ui';

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 glass-card transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:bg-surface/95",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-accent-green to-accent-lime rounded-xl flex items-center justify-center shadow-card">
                <Bitcoin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-primary">
                StackPay
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden hover:bg-surface/80 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface/80"
                  )}
                  onClick={() => {
                    // Close mobile menu when navigating
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-accent-green" : "text-text-secondary group-hover:text-text-primary"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="text-xs text-text-secondary font-medium">
              Bitcoin Payment Gateway
            </div>
            <div className="text-xs text-text-secondary/70 mt-1">
              Powered by Stacks
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

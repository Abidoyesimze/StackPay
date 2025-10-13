'use client';

import React from 'react';
import { Button } from '@stackspay/ui';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="hover:bg-surface/80 rounded-xl transition-all duration-200"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-text-secondary" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-text-secondary" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

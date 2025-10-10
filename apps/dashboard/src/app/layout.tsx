import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { QueryProvider } from '../components/providers/query-provider';

export const metadata: Metadata = {
  title: 'StackPay Dashboard',
  description: 'Bitcoin Payment Gateway Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="stackspay-ui-theme"
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

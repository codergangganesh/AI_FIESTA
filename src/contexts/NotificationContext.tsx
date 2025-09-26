'use client';

import { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
}

interface ToastApi {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

interface NotificationContextValue {
  useToast: () => ToastApi;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Minimal placeholder; replace with your UI toast system if desired
  const api: ToastApi = {
    success: (title, description) => console.log('[SUCCESS]', title, description ?? ''),
    error: (title, description) => console.error('[ERROR]', title, description ?? ''),
    info: (title, description) => console.log('[INFO]', title, description ?? '')
  };

  const useToastHook = () => api;

  return (
    <NotificationContext.Provider value={{ useToast: useToastHook }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useToast must be used within NotificationProvider');
  return ctx.useToast();
}



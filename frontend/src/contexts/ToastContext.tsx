'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const COLORS: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
  success: { bg: '#F1F8F1', border: '#2E7D32', icon: '#2E7D32' },
  error: { bg: '#FEF2F2', border: '#C62828', icon: '#C62828' },
  info: { bg: '#EEF4FB', border: '#1565C0', icon: '#1565C0' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: '360px' }}
      >
        {toasts.map((t) => {
          const c = COLORS[t.variant];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg text-sm font-medium text-[#333333] pointer-events-auto"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: c.icon }}
              >
                {ICONS[t.variant]}
              </span>
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

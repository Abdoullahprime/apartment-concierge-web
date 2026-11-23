'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast { id: number; message: string; variant: ToastVariant }

interface ToastContextValue { toast: (message: string, variant?: ToastVariant) => void }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() { return useContext(ToastContext); }

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 01.208 1.04l-5 7.5a.75.75 0 01-1.154.114l-3-3a.75.75 0 011.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 011.04-.207z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13A6.5 6.5 0 008 1.5zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
};

const STYLES: Record<ToastVariant, { bg: string; border: string; icon: string }> = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A' },
  error:   { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', icon: '#2563EB' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none"
        style={{ maxWidth: 360 }}
      >
        {toasts.map((t) => {
          const s = STYLES[t.variant];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A] pointer-events-auto shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                style={{ background: s.icon }}
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

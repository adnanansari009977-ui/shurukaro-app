import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl bg-[#111827] text-white text-sm font-medium shadow-lg flex items-center gap-2 max-w-[92vw] sm:max-w-md pointer-events-none"
    >
      <CheckCircle2 className="w-4 h-4 text-[#2DD4BF] shrink-0" />
      <span className="truncate">{toastMessage}</span>
    </div>
  );
};

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-3 p-4 mb-6 text-red-800 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
      <AlertCircle className="h-5 w-5 shrink-0" />
      <span className="text-[14px] font-medium flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
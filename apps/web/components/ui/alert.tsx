import React from 'react';
import { clsx } from 'clsx';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

const STYLES = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  className,
  onClose,
}: AlertProps) => {
  return (
    <div
      className={clsx(
        'border rounded-xl p-4 flex items-start gap-3',
        STYLES[variant],
        className
      )}
    >
      <span className="text-lg flex-shrink-0">{ICONS[variant]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 flex-shrink-0">
          ✕
        </button>
      )}
    </div>
  );
};

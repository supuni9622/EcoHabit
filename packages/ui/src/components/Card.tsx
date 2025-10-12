import React from 'react';
import { cn } from '../lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const baseStyles = 'rounded-lg border bg-card text-card-foreground shadow-sm';
  
  const variantStyles = {
    default: 'border-border',
    outlined: 'border-2 border-border',
    elevated: 'border-border shadow-lg',
  };
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

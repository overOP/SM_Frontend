import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`
      bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden
      ${!noPadding ? 'p-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

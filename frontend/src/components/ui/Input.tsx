import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full py-2.5 bg-white border rounded-xl text-sm transition-all outline-none
            placeholder:text-slate-400
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50'
              : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
            }
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-medium text-rose-500 ml-1">{error}</span>}
    </div>
  );
};

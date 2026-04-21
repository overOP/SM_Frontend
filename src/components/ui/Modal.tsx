import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

export const Modal = ({ isOpen, onClose, title, children }:{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <Card className="relative w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200" noPadding>
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2 h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};
import React from 'react';
import { Info } from 'lucide-react';

interface OpinionFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function OpinionFormSection({ 
  title, 
  description, 
  children, 
  required = false 
}: OpinionFormSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400" />
            <div className="absolute right-0 mt-1 w-64 bg-white p-2 rounded-lg shadow-lg border border-gray-100 text-xs text-gray-600 hidden group-hover:block z-10">
              {description}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
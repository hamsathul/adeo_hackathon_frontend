import React from 'react';
import { Info } from 'lucide-react';

interface DetailSectionProps {
  title: string;
  content?: string;
  description?: string;
}

export function DetailSection({ title, content, description }: DetailSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        {description && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 w-64 p-2 bg-white rounded-lg shadow-lg border border-gray-100 text-xs text-gray-600 hidden group-hover:block z-10">
              {description}
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700 whitespace-pre-wrap">{content || 'No information provided'}</p>
      </div>
    </div>
  );
}
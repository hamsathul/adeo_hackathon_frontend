import React from 'react';
import { Search } from 'lucide-react';

interface GlobalSearchButtonProps {
  onClick: () => void;
}

export function GlobalSearchButton({ onClick }: GlobalSearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 w-12 h-12 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
    >
      <Search className="w-5 h-5" />
    </button>
  );
}
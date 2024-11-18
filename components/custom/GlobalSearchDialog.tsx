import React, { useEffect, useRef } from "react";
import { X, Search, Command } from "lucide-react";

interface GlobalSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchDialog({ isOpen, onClose }: GlobalSearchDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close the dialog when clicking outside of it or pressing the ESC key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="h-full w-full max-w-xl flex flex-col bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        style={{
          animation: isOpen ? "slide-in 0.3s ease-out" : "slide-out 0.3s ease-in",
        }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search opinions, documents, remarks..."
              className="w-full pl-12 pr-14 py-4 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-lg"
              autoFocus
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="py-12 text-center text-gray-500 flex flex-col items-center gap-3">
            <Command className="w-12 h-12 text-gray-400" />
            <p className="text-lg">Start typing to search...</p>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">↑↓</span> to navigate
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">↵</span> to select
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">esc</span> to close
            </div>
          </div>
        </div>

        {/* Separate section for the Advanced AI Search Engine button */}
        <div className="p-4 text-center">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => window.location.href = "/search"}
          >
            Advanced AI Search Engine
          </button>
        </div>
      </div>
    </div>
  );
}
'use client'

import React, { useState} from 'react';
import Header from '../../app/admin/_components/header';
import Sidebar from '../../app/admin/_components/sidebar';
import { Sparkles, Search } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';
import { GlobalSearchDialog } from '../custom/GlobalSearchDialog';
import Chatbot from '@/components/custom/chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isArabic } = useLanguageStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const text = isArabic ? translations.ar : translations.en;
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />
      <div className="px-20">
        <header className="flex justify-end p-4"></header>
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <div className="container mx-auto px-6 py-2">
          {children}
        </div>
<div className="fixed bottom-4 right-4">
  <div
    className={`relative rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4 cursor-pointer transition-all duration-500 ease-in-out ${
      isHovered ? "scale-125 shadow-2xl" : "scale-100 shadow-lg"
    }`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => setShowChatbot(true)}
  >
    {/* Animated Pulsating Circle */}
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 blur-md opacity-70 ${
        isHovered ? "animate-pulse" : ""
      }`}
    ></div>
    {/* Sparkles Icon */}
    <Sparkles
      className="relative w-10 h-10 text-white z-10"
      strokeWidth={1.1}
    />

    {/* Hover Text */}
    {isHovered && (
      <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-white text-sm font-semibold whitespace-nowrap z-20"></span>
    )}
  </div>
</div>

{/* Search Panel */}
<div className="fixed bottom-24 right-4 mb-2">
  <div
    className={`absolute bottom-full right-0 mb-4 transition-all duration-200 ${
      showSearch ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    }`}
  >
  </div>

  {/* Search Button */}
  <a href="/search"
    className={`block relative rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-4 cursor-pointer transition-all duration-500 ease-in-out ${
      searchHovered ? "scale-125 shadow-2xl" : "scale-100 shadow-lg"
    }`}
    onMouseEnter={() => setSearchHovered(true)}
    onMouseLeave={() => setSearchHovered(false)}
    onClick={() => setShowSearch(!showSearch)}
  >
    {/* Animated Pulsating Circle */}
    <div
      className={`absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-md opacity-70 ${
        searchHovered ? "animate-pulse" : ""
      }`}
    />

    {/* Search Icon with Sparkles */}
    <div className="relative w-10 h-10 text-white z-10">
      <Search className="w-full h-full" strokeWidth={1.1} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`transition-opacity duration-300 ${
            searchHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="absolute top-1 right-1 block w-1.5 h-1.5 bg-white rounded-full animate-twinkle" />
          <span className="absolute top-3 right-3 block w-1 h-1 bg-white rounded-full animate-twinkle delay-100" />
        </div>
      </div>
    </div>

        {/* Hover Text */}
        {searchHovered && (
          <span className="absolute left-14 top-1/2 transform -translate-y-1/2 text-white text-sm font-semibold whitespace-nowrap z-20">
          </span>
        )}
      </a>
          <style jsx global>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
            .animate-twinkle {
              animation: twinkle 1.5s infinite ease-in-out;
            }
          `}</style>
        </div>
      </div>
      <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />  
    </div>
  );
}
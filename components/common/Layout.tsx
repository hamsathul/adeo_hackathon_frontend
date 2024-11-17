'use client'


import React, { useState} from 'react';
import Header from '../../app/admin/_components/header';
import Sidebar from '../../app/admin/_components/sidebar';
import Chatbot from '@/components/custom/chatbot';
import { Bot } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

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
		 {/* AI Assistant Button */}
		 <div className="fixed bottom-4 right-4">
        <div
          className={`relative rounded-full bg-primary text-primary-foreground p-3 cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'w-36' : 'w-12'}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setShowChatbot(true)}
        >
          <Bot className="w-6 h-6" />
          {isHovered && (
            <span className="absolute left-12 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
              {text.ai}
            </span>
          )}
        </div>
      </div>
	
    <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)}  />
      </div>
    </div>
  );
}
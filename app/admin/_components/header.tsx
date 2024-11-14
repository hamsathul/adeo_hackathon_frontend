"use client"
import React, { useState } from 'react';
import { LogOut, Settings, Menu, Globe, X } from 'lucide-react';
import Sidebar from '../_components/sidebar';

const Header = () => {
  const [language, setLanguage] = useState('en');
  const [isHovered, setIsHovered] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = () => {
    // Add logout logic here
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ButtonWithHoverEffect = ({ icon: Icon, text, onClick }: { icon: React.ElementType, text: string, onClick: () => void }) => (
    <button
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-300 ease-in-out
        ${isHovered === text ? 'bg-indigo-600 scale-105' : 'hover:bg-gray-800'}
        text-gray-300 hover:text-white focus:outline-none
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(text)}
      onMouseLeave={() => setIsHovered('')}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isHovered === text ? 'rotate-12' : ''}`} />
      <span className="hidden sm:inline">{text}</span>
    </button>
  );

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center">
          {/* Menu Icon - Now on the left */}
          <button
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Brand - Now in the center */}
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 flex-1 text-center">
            ADEO
          </div>

          {/* Navigation Buttons - Stayed on the right */}
          <div className="flex items-center gap-2">
            <ButtonWithHoverEffect
              icon={Globe}
              text={language === 'en' ? 'English' : 'العربية'}
              onClick={handleLanguageToggle}
            />
            
            <ButtonWithHoverEffect
              icon={Settings}
              text="Settings"
              onClick={() => {}}
            />
            
            <ButtonWithHoverEffect
              icon={LogOut}
              text="Logout"
              onClick={handleLogout}
            />
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Header;
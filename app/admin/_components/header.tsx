"use client";
import React, { useState } from 'react';
import { LogOut, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation'; // This hook allows for programmatic navigation

const Header = () => {
  const [language, setLanguage] = useState('en');
  const [isHovered, setIsHovered] = useState<string | null>(null); // Track hover state for individual buttons
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter(); // Access the router for redirecting

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = () => {
    // Add logout logic here, such as clearing cookies, localStorage, or any authentication context
    // Example: localStorage.removeItem('authToken');
    
    // After logging out, redirect to the login page
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ButtonWithHoverEffect = ({ icon: Icon, text, onClick }: { icon: React.ElementType, text: string, onClick: () => void }) => (
    <button
      className={`
        flex items-center gap-1 px-2 py-2 rounded-lg
        transition-all duration-300 ease-in-out
        ${isHovered === text ? 'bg-gray-600 scale-105' : 'hover:bg-gray-800'}
        text-gray-300 hover:text-white focus:outline-none
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(text)}
      onMouseLeave={() => setIsHovered(null)} // Reset hover state when mouse leaves
    >
      <Icon className={`w-4 h-4 transition-transform duration-300 ${isHovered === text ? 'rotate-12' : ''}`} />
      <span className="hidden sm:inline">{text}</span>
    </button>
  );

  return (
    <header className="bg-gray-300 text-gray-900 py-4 px-6">
      <div className="max-w-8xl mx-auto flex items-center">
        {/* Logo - Centered and Clickable */}
        <div className="flex-1 text-center">
          <a href="/admin">
            <img 
              src="/ADEO2.png" 
              alt="Logo" 
              className="inline-block w-34 h-12 cursor-pointer"
            />
          </a>
        </div>     
        
        {/* Navigation Buttons - Stayed on the right */}
        <div className="flex items-center bg-white rounded-lg">
          <ButtonWithHoverEffect
            icon={Globe}
            text={language === 'en' ? 'English' : 'العربية'}
            onClick={handleLanguageToggle}              
          />
          
          {/* Pipe separator */}
          <div className="h-6 border-l border-gray-300"></div> {/* Thin vertical line */}
          
          <ButtonWithHoverEffect
            icon={LogOut}
            text="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

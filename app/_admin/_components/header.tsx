import React, { useState } from 'react';
import { Lucide } from 'lucide-react';

const Header = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogout = () => {
    // Add logout logic here
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={handleLanguageToggle}
        >
          {language === 'en' ? 'English' : 'العربية'}
        </button>
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={handleLogout}
        >
          <Lucide icon="LogOut" className="w-6 h-6" />
          Logout
        </button>
        <button className="text-gray-400 hover:text-white focus:outline-none">
          <Lucide icon="Settings" className="w-6 h-6" />
          Settings
        </button>
      </div>
      <button className="text-gray-400 hover:text-white focus:outline-none">
        <Lucide icon="Menu" className="w-6 h-6" />
        Open Sidebar
      </button>
    </header>
  );
};

export default Header;
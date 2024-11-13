import React, { useState } from 'react';
import { Lucide } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside
      className={`bg-gray-800 text-white h-screen w-64 fixed top-0 left-0 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="py-6 px-4">
        <h2 className="text-lg font-bold">IORMS</h2>
        <nav className="mt-6">
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-700 rounded-md transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-700 rounded-md transition-colors"
          >
            Requests
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-700 rounded-md transition-colors"
          >
            Users
          </a>
          <a
            href="#"
            className="block py-2 px-4 hover:bg-gray-700 rounded-md transition-colors"
          >
            Settings
          </a>
        </nav>
      </div>
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <Lucide icon="X" className="w-6 h-6" />
      </button>
    </aside>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { X, LayoutDashboard, FileText, Users, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const menuItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: 'Dashboard', href: '#' },
    { icon: <FileText className="w-6 h-6" />, label: 'Requests', href: '#' },
    { icon: <Users className="w-6 h-6" />, label: 'Users', href: '#' },
    { icon: <Settings className="w-6 h-6" />, label: 'Settings', href: '#' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <aside
      className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="py-6 px-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold ${!isSidebarOpen && 'hidden'}`}>IORMS</h2>
          <button
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`flex items-center py-2 px-4 hover:bg-gray-700 rounded-md transition-colors mb-1 ${
                !isSidebarOpen ? 'justify-center' : ''
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <div className="min-w-[24px] flex justify-center">
                {item.icon}
              </div>
              <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
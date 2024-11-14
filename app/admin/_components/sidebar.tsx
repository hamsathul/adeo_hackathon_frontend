'use client'

import React, { useState } from 'react';
import { X, LayoutDashboard, FileText, Users, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { icon: <LayoutDashboard className="w-6 h-6" />, label: 'Dashboard', href: '/admin' },
    { icon: <FileText className="w-6 h-6" />, label: 'Requests', href: '/request' },
    { icon: <Users className="w-6 h-6" />, label: 'Users', href: '#' },
    { icon: <Settings className="w-6 h-6" />, label: 'Settings', href: '#' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />
      <aside
        className={`bg-gray-800 text-white h-screen fixed top-0 left-0 transition-all duration-300 z-30 ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="py-6 px-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${!isOpen && 'hidden'}`}>IORMS</h2>
            <button
              className="text-gray-400 hover:text-white focus:outline-none flex items-center justify-center w-8 h-8"
              onClick={onToggle}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <nav className="mt-6">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center py-2 px-4 hover:bg-gray-700 rounded-md transition-colors mb-1 ${
                  !isOpen ? 'justify-center' : ''
                }`}
                title={!isOpen ? item.label : ''}
              >
                <div className="min-w-[24px] flex justify-center">
                  {item.icon}
                </div>
                <span className={`ml-3 ${!isOpen && 'hidden'}`}>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
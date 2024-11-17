'use client'

import React from 'react';
import Header from '../../app/admin/_components/header';
import Sidebar from '../../app/admin/_components/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
      </div>
    </div>
  );
}
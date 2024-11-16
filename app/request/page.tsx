'use client'

import React, { useState } from 'react'
import { Bot, History, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "../admin/_components/header"
import Sidebar from "../admin/_components/sidebar"
import Chatbot from '@/components/custom/chatbot'
import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/components/custom/translation'

export default function Requests() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isArabic } = useLanguageStore();
  const text = isArabic ? translations.ar : translations.en;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header />
        <div className="container mx-auto p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight py-4">{text.Requests}</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  {text.viewHistory} 
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{text.requestHistory}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <p>Your request history will be displayed here.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {/* Tabs */}
          <Tabs defaultValue="service-status" className="mb-6">
            <TabsList>
              <TabsTrigger value="service-status">{text.requestStatus}</TabsTrigger>
              <TabsTrigger value="support-requests">{text.support} </TabsTrigger>
            </TabsList>
            <TabsContent value="service-status">
              <div className="text-center py-16">
                <Folder className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                <h2 className="text-2xl font-semibold mb-2">{text.emptyText}</h2>
                <p className="text-gray-600">{text.emptyText2}</p>
              </div>
            </TabsContent>
            <TabsContent value="support-requests">
              <p>Support requests content goes here.</p>
            </TabsContent>
          </Tabs>
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
                  AI Assistant
                </span>
              )}
            </div>
          </div>
          {/* Chatbot component */}
          <Chatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
        </div>
      </div>
    </div>
  )
}
import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Mic } from 'lucide-react' // Import the X icon
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Sparkles } from 'lucide-react'

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [inputMessage, setInputMessage] = useState('')
  const chatbotRef = useRef(null)

  // Handle closing chatbot when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatbotRef.current && !(chatbotRef.current as HTMLElement).contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Handle message sending
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      console.log('Sending message:', inputMessage)
      setInputMessage('')
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
  ref={chatbotRef}
  className="bg-gradient-to-b from-blue-50 to-purple-50 rounded-3xl w-full max-w-md h-[80vh] flex flex-col shadow-xl"
>
  <div className="flex justify-between items-center p-6">
    <Button variant="ghost" size="icon" onClick={onClose}>
      <X className="w-5 h-5 text-gray-600" />
    </Button>
  </div>
  <div className="flex-grow px-6 pb-6 overflow-auto">
    <div className="flex flex-col items-center mb-8">
      {/* Updated icon to Sparkles */}
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-white" strokeWidth={1.1} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Hi MOHAMED</h2>
      <p className="text-gray-600">How can I help you today?</p>
    </div>
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 bg-gray-300" />
        <div className="bg-blue-100 rounded-2xl p-3 max-w-[80%]">
          <p className="text-sm text-gray-800">What can I do for you?</p>
          <p className="text-xs text-gray-500 mt-1">Tell me about your requirements</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 justify-end">
        <div className="bg-purple-100 rounded-2xl p-3 max-w-[80%]">
          <p className="text-sm text-gray-800">
            You can assist me with various tasks related to requests and services. Please assist me on its completion!
          </p>
        </div>
      </div>
    </div>
  </div>
  <div className="p-6">
    <p className="text-xs text-center text-gray-500 mb-4">
      I am constantly learning from people's communication with me. I might make mistakes, therefore I advise you to verify any important information.
    </p>
    <div className="relative">
      <input
        type="text"
        placeholder="Ask me about anything"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        className="w-full p-4 pr-24 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
        {inputMessage && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSendMessage}
            className="mr-1"
          >
            <Send className="w-5 h-5 text-blue-500" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
        >
          <Mic className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
    </div>
  </div>
</div>
</div>
    )
  )
}

export default Chatbot

'use client'
import React from 'react'
import { LogOut, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { translations } from '@/components/custom/translation'
import { useLanguageStore } from '@/store/useLanguageStore'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { isArabic, toggleLanguage } = useLanguageStore()
  const text = isArabic ? translations.ar : translations.en
  const router = useRouter()

const handleLogout = () => {
	localStorage.removeItem('token')
	router.push('/login')
}

return (
  <header className="bg-gray-300 text-gray-900 py-4 px-6">
    <div className="max-w-8xl mx-auto flex items-center justify-between relative">
      {/* Logo - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <a href="/admin">
          <img 
            src="/ADEO2.png" 
            alt="Logo" 
            className="inline-block w-34 h-12 cursor-pointer"
          />
        </a>
      </div>
      {/* Navigation Buttons - Right-aligned */}
      <div className="flex items-center ml-auto space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
        >
          <Globe className="h-4 w-4" />
          <span>{isArabic ? 'EN' : 'AR'}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{text.logout}</span>
        </Button>
      </div>
    </div>
  </header>
  )
}
'use client'

import Image from "next/image"
import Link from "next/link"
import { User, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isArabic, setIsArabic] = useState(false)  // Arabic/English toggle state
  const router = useRouter()

  // Load the language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setIsArabic(savedLanguage === 'ar')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your authentication logic here
    console.log('Login attempted with:', username)
  }

  return (
    <div 
      className={`min-h-screen flex flex-col bg-cover bg-center ${isArabic ? 'text-right' : 'text-left'}`}
      style={{ backgroundImage: "url('/LoginBackground.jpg')" }}
    >
      {/* Language Toggle */}
      <header className="w-full bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <Image
          src="/ADEO.png"
          alt="Abu Dhabi Executive Office Logo"
          width={200}
          height={60}
          className="h-[60px] w-auto"
        />
        <button
          type="button"
          onClick={() => {
            const newLanguage = isArabic ? 'en' : 'ar'
            setIsArabic(!isArabic)
            localStorage.setItem('language', newLanguage)  // Save the selected language
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {isArabic ? 'EN' : 'AR'}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold text-center mb-8">
            {isArabic ? 'الخدمات الرقمية لمكتب أبوظبي التنفيذي' : 'ADEO Digital Services'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {isArabic ? 'اسم المستخدم' : 'Username'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
                {isArabic ? 'واجهت مشكلة في تسجيل الدخول؟' : 'Having trouble signing in?'}
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A90E2] text-white py-2 px-4 rounded-md hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isArabic ? 'دخول' : 'Login'}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600">
        <p>{isArabic ? '© مكتب أبوظبي التنفيذي. جميع الحقوق محفوظة.' : '© Abu Dhabi Executive Office. All rights reserved.'}</p>
        <Link href="https://www.abudhabi.gov.ae"   target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
          {isArabic ? 'الشروط والأحكام' : 'Terms and Conditions'}
        </Link>
      </footer>
    </div>
  )
}

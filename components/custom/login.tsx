'use client'

import Image from "next/image"
import Link from "next/link"
import { User, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/store/useLanguageStore'
import axios from 'axios'

const server_url = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000/api/v1'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { isArabic, toggleLanguage } = useLanguageStore()
  const [error, setError] = useState('') // State for error messages
  const [loading, setLoading] = useState(false) // Loading state for API request
  const router = useRouter()

  // Validate inputs
  const validateInputs = () => {
    if (!username.trim()) {
      setError(isArabic ? 'الرجاء إدخال اسم المستخدم' : 'Please enter a username')
      return false
    }
    if (username.length < 4) {
      setError(isArabic ? 'اسم المستخدم يجب أن يكون أطول من 3 أحرف' : 'Username must be at least 4 characters')
      return false
    }
    if (!password) {
      setError(isArabic ? 'الرجاء إدخال كلمة المرور' : 'Please enter a password')
      return false
    }
    if (password.length < 6) {
      setError(isArabic ? 'كلمة المرور يجب أن تكون أطول من 5 أحرف' : 'Password must be at least 6 characters')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear any previous error
    setError('')

    // Validate form inputs
    if (!validateInputs()) {
      return
    }

    setLoading(true)
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const response = await axios.post(`${server_url}/auth/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const token = response.data.access_token
      localStorage.setItem('token', token) // Store token in localStorage
      router.push('/admin') // Redirect to admin page
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError(isArabic ? 'بيانات تسجيل الدخول غير صحيحة' : 'Invalid login credentials')
        } else if (error.response?.status === 500) {
          setError(isArabic ? 'حدث خطأ في الخادم' : 'Server error occurred')
        } else {
          setError(isArabic ? 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.' : 'An unexpected error occurred. Please try again.')
        }
      } else {
        setError(isArabic ? 'فشل الاتصال بالخادم' : 'Failed to connect to server')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className={`min-h-screen flex flex-col bg-cover bg-center ${isArabic ? 'text-right' : 'text-left'}`}
      style={{ backgroundImage: "url('/LoginBackground.jpg')" }}
    >
      {/* Language Toggle */}
      <header className="w-full bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <Image
          src="/ADEO2.png"
          alt="Abu Dhabi Executive Office Logo"
          width={200}
          height={60}
          className="h-[60px] w-auto"
        />
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {isArabic ? 'EN' : 'AR'}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-slate-300 rounded-lg shadow-lg w-full max-w-md p-8">
          {/* <h1 className="text-2xl font-semibold text-center mb-8">
            {isArabic ? 'الخدمات الرقمية لمكتب أبوظبي التنفيذي' : 'ADEO Digital Services'}
          </h1> */}
          <Image
            src="/samah.png"
            alt="Abu Dhabi Executive Office Logo"
            width={150}
            height={150}
            className="mx-auto mb-8 align-middle"
          />
          
          {/* Display error message */}
          {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

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
              disabled={loading}
            >
              {loading ? (isArabic ? 'جارٍ التحميل...' : 'Loading...') : (isArabic ? 'دخول' : 'Login')}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600">
        <p>{isArabic ? '© مكتب أبوظبي التنفيذي. جميع الحقوق محفوظة.' : '© Abu Dhabi Executive Office. All rights reserved.'}</p>
        <Link href="https://www.abudhabi.gov.ae" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
          {isArabic ? 'الشروط والأحكام' : 'Terms and Conditions'}
        </Link>
      </footer>
    </div>
  )
}

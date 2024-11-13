'use client'

import Image from "next/image"
import Link from "next/link"
import { User, Lock } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your authentication logic here
    console.log('Login attempted with:', username)
    router.push('/admin')
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('LoginBackground.jpg')" }}
    >
      <header className="w-full bg-white py-4 px-6 flex justify-center shadow-sm">
        <Image
          src="/ADEO.png"
          alt="Abu Dhabi Executive Office Logo"
          width={200}
          height={60}
          className="h-[60px] w-auto"
        />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <h1 className="text-2xl font-semibold text-center mb-8">ADEO Digital Services</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
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
                Password
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
              <Link href="/trouble-signing-in" className="text-sm text-blue-600 hover:text-blue-500">
                Having trouble signing in?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A90E2] text-white py-2 px-4 rounded-md hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-600">
        <p>© Abu Dhabi Executive Office. All rights reserved.</p>
        <Link href="/terms" className="text-blue-600 hover:text-blue-500">
          Terms and Conditions
        </Link>
      </footer>
    </div>
  )
}

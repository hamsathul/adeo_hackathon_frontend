"use client";

import Image from "next/image"
import Link from "next/link"
import { User, Lock } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {e.preventDefault()
    
    // Example validation - replace with your actual authentication logic
    if (username === 'admin' && password === 'password') {
      // Successful login
      console.log('Login successful')
      router.push('/dashboard') // Redirect to dashboard
    } else {
      // Failed login
      alert('Invalid username or password')
    }
  }

  // Rest of the component remains the same
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f0f4f8] relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(135deg,_#ffffff_25%,_transparent_25%)_-40px_0,linear-gradient(225deg,_#ffffff_25%,_transparent_25%)_-40px_0,linear-gradient(315deg,_#ffffff_25%,_transparent_25%),linear-gradient(45deg,_#ffffff_25%,_transparent_25%)] 
        bg-[length:80px_80px] opacity-50"
      />
      
      {/* Logo */}
      <div className="w-full max-w-[200px] mt-8 mb-12 relative">
        <Image
          src="/ADEO.png"
          alt="Abu Dhabi Executive Office"
          width={200}
          height={80}
          className="w-full h-auto"
        />
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[460px] mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl text-center text-gray-800 mb-6">ADEO Digital Services</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="username"
                  type="text"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="password"
                  type="password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="text-right">
              <Link 
                href="#" 
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Having trouble signing in?
              </Link>
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#4285b4] hover:bg-[#3b769e] text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-600 relative">
        <p>© Abu Dhabi Executive Office. All rights reserved.</p>
        <Link 
          href="#" 
          className="text-blue-500 hover:text-blue-600"
        >
          Terms and Conditions
        </Link>
      </footer>
    </div>
  )
}
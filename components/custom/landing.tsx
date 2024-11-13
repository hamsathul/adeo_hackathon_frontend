'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, Eye } from 'lucide-react'


export function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isArabic, setIsArabic] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.8)' }}
      >
        <source src="/BackgroundVid.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="relative z-10">
        {/* Navigation */}
        <header className="bg-white/95">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between h-20 ${isArabic ? 'flex-row-reverse' : ''}`}>
              {/* Logo */}
              <div className="flex-shrink-0">
                <Image
                  src="/ADEO.png"
                  alt="Department of Economic Development"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>

              {/* Right Navigation */}
              <div className={`flex items-center space-x-4 ${isArabic ? 'space-x-reverse' : ''}`}>
                {/* Arabic Translation Button */}
                <button
                  type="button"
                  onClick={() => setIsArabic(!isArabic)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {isArabic ? 'EN' : 'AR'}
                </button>

                {/* Login Button */}
                <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                    {isArabic ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-64 ${isArabic ? 'text-right' : 'text-left'}`}>
          <div className={`max-w-2xl ${isArabic ? 'ml-auto' : ''}`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8">
              {isArabic ? 'مكتب أبوظبي التنفيذي' : 'Abu Dhabi Executive Office (ADEO)'}
            </h1>
            <Button 
              variant="default"
              size="lg"
              className="bg-black text-white hover:bg-gray-900 group"
            >
              {isArabic ? 'اقرأ المزيد' : 'READ MORE'}
              <ArrowRight className={`ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 ${isArabic ? 'transform -scale-x-100' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      <button
        className="absolute bottom-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full"
        onClick={() => {
          const video = document.querySelector('video')
          if (isPlaying) {
            video?.pause()
          } else {
            video?.play()
          }
          setIsPlaying(!isPlaying)
        }}
        aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  )
}

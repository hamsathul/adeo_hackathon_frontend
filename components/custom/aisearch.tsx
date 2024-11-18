'use client'

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { Bot, Search, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* AI Search Icon Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 hover:scale-110 transition-transform"
      >
        <Search className="h-6 w-6" />
      </Button>

      {/* Search Engine Slide-out Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        ref={searchRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h2 className="text-lg font-semibold">AI Search</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anything..."
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-auto max-h-[calc(100vh-8rem)]">
          {searchQuery ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Sample Result 1</h3>
                <p className="text-sm text-muted-foreground">
                  This is a sample search result. The actual implementation would connect to your search backend.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">Sample Result 2</h3>
                <p className="text-sm text-muted-foreground">
                  Another sample search result to demonstrate the layout.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Enter your search query above to get started
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
// store/useLanguageStore.ts
import  create  from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  isArabic: boolean
  toggleLanguage: () => void
}

export const useLanguageStore = create<LanguageState>(
  persist<LanguageState>(
    (set) => ({
      isArabic: false,
      toggleLanguage: () => set((state) => ({ isArabic: !state.isArabic })),
    }),
    {
      name: 'language-storage',
    }
  )
)
'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  activeTheme: string
  setActiveTheme: (theme: string) => void
}

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
  activeTheme: 'default',
  setActiveTheme: () => null,
}

const ThemeContext = createContext<ThemeContextType>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultActiveTheme = 'default',
  themeStorageKey = 'ui-theme',
  activeThemeStorageKey = 'ui-theme-active',
}: {
  children: ReactNode
  defaultTheme?: Theme
  defaultActiveTheme?: string
  themeStorageKey?: string
  activeThemeStorageKey?: string
}) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem(themeStorageKey) as Theme) || defaultTheme)

  const [activeTheme, setActiveThemeState] = useState<string>(
    () => localStorage.getItem(activeThemeStorageKey) || defaultActiveTheme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    setMetaThemeColor()
  }, [theme])

  useEffect(() => {
    localStorage.setItem(activeThemeStorageKey, activeTheme)

    Array.from(document.body.classList)
      .filter((className) => className.startsWith('theme-'))
      .forEach((className) => {
        document.body.classList.remove(className)
      })

    document.body.classList.add(`theme-${activeTheme}`)

    if (activeTheme.endsWith('-scaled')) {
      document.body.classList.add('theme-scaled')
    }
    setMetaThemeColor()
  }, [activeTheme, activeThemeStorageKey])

  const setMetaThemeColor = () => {
    const computedStyle = getComputedStyle(document.documentElement)
    const backgroundColor = computedStyle.getPropertyValue('--color-background').trim()

    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.setAttribute('name', 'theme-color')
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.setAttribute('content', backgroundColor)
  }

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(themeStorageKey, newTheme)
    setThemeState(newTheme)
  }

  const setActiveTheme = (newActiveTheme: string) => {
    localStorage.setItem(activeThemeStorageKey, newActiveTheme)
    setActiveThemeState(newActiveTheme)
  }

  const toggleTheme = () => {
    let currentTheme = theme
    if (currentTheme === 'system') {
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    const newTheme = currentTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    activeTheme,
    setActiveTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

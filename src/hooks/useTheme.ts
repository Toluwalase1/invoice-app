import { useCallback, useState } from 'react'
import type { ThemeMode } from '../types/invoice.ts'
import { loadTheme, saveTheme } from '../lib/storage.ts'

/**
 * Manages the light/dark theme and persists the preference in localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(loadTheme)

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: ThemeMode = current === 'dark' ? 'light' : 'dark'
      saveTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme } as const
}

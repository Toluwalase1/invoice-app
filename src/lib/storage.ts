import type { Invoice, ThemeMode } from '../types/invoice.ts'

const INVOICES_KEY = 'invoices'
const THEME_KEY = 'theme'

/**
 * Read invoices from localStorage.
 * Returns `null` when the key has never been written (first visit).
 */
export function loadInvoices(): Invoice[] | null {
  try {
    const raw = localStorage.getItem(INVOICES_KEY)
    if (raw === null) return null
    return JSON.parse(raw) as Invoice[]
  } catch {
    return null
  }
}

/**
 * Persist the full invoices array to localStorage.
 */
export function saveInvoices(invoices: Invoice[]): void {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices))
  } catch {
    // Storage full or unavailable — fail silently.
  }
}

/**
 * Read the saved theme preference.
 */
export function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark') return raw
    return 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Persist theme preference.
 */
export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // fail silently
  }
}

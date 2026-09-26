import { createContext, useCallback, useContext, useEffect, useState } from 'react'

/**
 * Theme state.
 *
 * Product decision: a first-time visitor always lands on DARK, regardless of
 * their operating system setting. `prefers-color-scheme` is deliberately never
 * consulted — dark is the brand's primary expression and light is an opt-in.
 * Once the visitor picks a theme it is remembered in localStorage.
 *
 * The actual swap is pure CSS: this only sets `data-theme` on <html>, and the
 * custom properties in index.css do the rest.
 */

const STORAGE_KEY = 'gc-theme'
const THEMES = ['dark', 'light']
/** Browser-bar colour per theme: the page background, so the bar blends in. */
const BAR_COLOR = { dark: '#050506', light: '#ffffff' }

const ThemeContext = createContext(null)

/** Read the stored choice, falling back to dark. Never reads the OS setting. */
const readStoredTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(stored) ? stored : 'dark'
  } catch {
    // Private browsing or blocked storage — dark is the correct default anyway.
    return 'dark'
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BAR_COLOR[theme])
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Not being able to persist the choice must not break the page.
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider')
  return context
}

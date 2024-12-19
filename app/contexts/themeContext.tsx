import { createContext, useEffect, useState } from 'react'

export type ThemeType = '🌚' | '🌞' | ''

const defaultState: {
  theme: ThemeType
  setTheme: (theme: Omit<ThemeType, ''>) => void
} = {
  theme: '',
  setTheme: () => {},
}

export const ThemeContext = createContext(defaultState)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as ThemeType
      if (storedTheme) {
        setTheme(storedTheme)
      }
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

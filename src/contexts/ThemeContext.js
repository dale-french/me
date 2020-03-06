import React, { useState, createContext, useEffect } from "react"
import PropTypes from "prop-types"

const defaultState = {
  darkMode: false,
  setDarkMode: () => {},
}
const ThemeContext = createContext(defaultState)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultState.darkMode)

  useEffect(() => {
    const isDark = JSON.parse(localStorage.getItem("dark"))
    if (isDark) {
      setIsDarkMode(isDark)
    }
  }, [isDarkMode])

  return (
    <ThemeContext.Provider
      value={{
        darkMode: isDarkMode,
        setDarkMode: setIsDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ThemeContext
export { ThemeProvider }

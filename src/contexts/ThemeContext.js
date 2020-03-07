import React, { useState, createContext, useEffect } from "react"
import PropTypes from "prop-types"
import GlobalStyles from "../theme/globalStyles"

const defaultState = {
  darkMode: false,
  setDarkMode: () => {},
}
const ThemeContext = createContext(defaultState)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultState.darkMode)

  useEffect(() => {
    const isDark = document.body.className === "dark"
    if (isDark) {
      document.body.classList.remove("dark")
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
      <GlobalStyles darkMode={isDarkMode} />
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

export default ThemeContext
export { ThemeProvider }

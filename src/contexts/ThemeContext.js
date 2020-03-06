import React, { useState, createContext } from "react"
import PropTypes from "prop-types"

const defaultState = {
  darkMode: false,
  setDarkMode: () => {},
}
const ThemeContext = createContext(defaultState)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultState.darkMode)

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

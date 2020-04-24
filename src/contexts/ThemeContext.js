import React, { useState, createContext, useEffect } from "react"
import PropTypes from "prop-types"
import GlobalStyles from "../theme/globalStyles"
import { ThemeProvider } from "styled-components"
import { getTheme } from "../theme/getTheme"
import { useTheme } from "../hooks"

const ThemeContext = createContext()

const ThemeContextProvider = ({ children }) => {
  const [theme, toggleTheme] = useTheme()
  const currentTheme = getTheme(theme)
  const [key, forceUpdate] = useState(0)

  useEffect(() => {
    // let react take care of dynamic styles
    forceUpdate(1)
    // after mounting, remove the class from body
    document.body.classList.remove("dark")
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <GlobalStyles theme={currentTheme} key={key} />
      <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

ThemeContextProvider.propTypes = {
  children: PropTypes.node,
}

export default ThemeContext
export { ThemeContextProvider as ThemeProvider }

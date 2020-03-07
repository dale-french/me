import { useState, useEffect } from "react"

/**
 * A hook to get and update the current theme for dark mode
 * @returns [theme, toggleTheme] - [current theme, function to toggle theme]
 */
export const useTheme = () => {
  const storedTheme =
    typeof window !== "undefined" && window.localStorage.getItem("theme")
  const [theme, setTheme] = useState(storedTheme || "light")
  const toggleTheme = () =>
    setTheme(prevTheme => {
      return prevTheme === "light" ? "dark" : "light"
    })
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme)
    }
  }, [theme])
  return [theme, toggleTheme]
}

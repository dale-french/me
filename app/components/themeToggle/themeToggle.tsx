import { useContext } from 'react'
import { ThemeContext, type ThemeType } from '~/contexts/themeContext'
import styles from './themeToggle.module.css'

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext)

  const handleChangeTheme = () => {
    const savedTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = savedTheme === '🌚' ? '🌞' : '🌚' as ThemeType
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <button onClick={handleChangeTheme} className={styles.toggle}>
      <div className={`${styles.icon} ${
        theme === '🌚' ? styles.icon__dark : styles.icon__light
      }`}
      />
    </button>
  )
}

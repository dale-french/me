import { Outlet } from 'react-router'
import { Logo } from '~/components'
import styles from './main.module.css'

export default function Main() {
  const handleChangeTheme = () => {
    const savedTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = savedTheme === '🌚' ? '🌞' : '🌚'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <main className={styles.main}>
      <header>
        <Logo />
        <button onClick={handleChangeTheme}>
          Switch Theme
        </button>
      </header>
      <div>
        <Outlet />
      </div>
    </main>
  )
}

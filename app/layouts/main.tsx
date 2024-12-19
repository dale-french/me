import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
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
      <section>
        <Outlet />
      </section>
      <footer>
        <div className={styles.social}>
          <a href="https://www.linkedin.com/in/dale-french-dev" target="_blank"><LinkedInLogoIcon /></a>
          <a href="https://github.com/dale-french" target="_blank"><GitHubLogoIcon /></a>
          <a href="https://www.instagram.com/dale__french/" target="_blank"><InstagramLogoIcon /></a>
        </div>
        <p>
          &copy;
          {' '}
          {new Date().getFullYear()}
          {' - '}
          Dale French
        </p>
        <p>
          Built with
          {' '}
          <a href="#">React Router</a>
          {' '}
          • Hosted on
          {' '}
          <a href="#">Cloudfare Workers</a>
          {' '}
          • Code on
          {' '}
          <a href="#">GitHub</a>
        </p>
      </footer>
    </main>
  )
}

import { GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { Outlet } from 'react-router'
import { Logo, ThemeToggle } from '~/components'
import { ThemeProvider } from '~/contexts/themeContext'
import styles from './main.module.css'

export default function Main() {
  return (
    <ThemeProvider>
      <main className={styles.main}>
        <header>
          <Logo />
          <ThemeToggle />
        </header>
        <section>
          <Outlet />
        </section>
        <footer>
          <div className={styles.social}>
            <a href="https://www.linkedin.com/in/dale-french-dev" target="_blank" rel="noopener noreferrer"><LinkedInLogoIcon /></a>
            <a href="https://github.com/dale-french" target="_blank" rel="noopener noreferrer"><GitHubLogoIcon /></a>
            <a href="https://www.instagram.com/dale__french/" target="_blank" rel="noopener noreferrer"><InstagramLogoIcon /></a>
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
    </ThemeProvider>
  )
}

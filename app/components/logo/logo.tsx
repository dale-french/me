import { Link } from 'react-router'
import styles from './logo.module.css'

export function Logo() {
  return (
    <div className={styles.logo}>
      <Link to="/">
        D
        <span>/</span>
        F
      </Link>
    </div>
  )
}

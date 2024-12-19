import styles from './about.module.css'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'About me and my experience - Dale French' },
  ]
}

export default function About() {
  const yearsOfExperience = new Date().getFullYear() - 2012

  return (
    <div className={styles.about}>
      <h2>
        Hi 👋! My name is Dale, and I have spent over
        {' '}
        <span>
          {yearsOfExperience}
          {' '}
          years
        </span>
        {' '}
        in the software engineering industry.
        After a decade as an individual contributor (IC), I transitioned to the management track and am currently an
        <span> Engineering Manager</span>
        {' '}
        at
        {' '}
        <a href="https://www.vio.com" target="_blank" rel="noopener noreferrer">Vio.com</a>
        .
      </h2>
      <p>
        I grew up in sunny South Africa and started building websites back when Internet Explorer 6 was the latest and
        greatest. A lot has changed since then, and now I’m based in the beautiful city of Amsterdam.
      </p>
    </div>
  )
}

import type { Route } from './+types/home'
import { Link } from 'react-router'
import TypeIt from 'typeit-react'
import styles from './home.module.css'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dale French - Frontend Engineer & Engineering Leader' },
    {
      name: 'description',
      content:
        'I\'m an experienced Frontend Engineer & Engineering Leader based in Amsterdam.',
    },
  ]
}

export default function Home() {
  return (
    <div className={styles.home}>
      <h2>Hi 👋 i'm</h2>
      <h1>Dale French</h1>
      <div className={styles.typeit_container}>
        <TypeIt
          as="h2"
          getBeforeInit={(instance) => {
            instance
              .type('A Frontend Engineer who likes building products')
              .break()
              .type('with React')
              .pause(750)
              .delete(5)
              .pause(750)
              .type('Typescript')
              .pause(750)
              .delete(10)
              .pause(750)
              .type('React Native')
              .pause(750)
              .delete(12)
              .pause(750)
              .delete(5)
              .type('that users love')
              .pause(750)
              .type(' 💜')
              .pause(750)
              .move(-46)
              .pause(750)
              .delete(18)
              .pause(750)
              .type('n Engineering Leader')
              .go()
            return instance
          }}
        />
      </div>
      <Link to="about">About me</Link>
    </div>
  )
}

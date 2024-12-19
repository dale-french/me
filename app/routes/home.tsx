import type { Route } from './+types/home'
import TypeIt from 'typeit-react'
import styles from './home.module.css'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dale French - Frontend Engineer' },
    {
      name: 'description',
      content:
        'I\'m an experienced Frontend Engineer based in Amsterdam.',
    },
  ]
}

export default function Home() {
  return (
    <div className={styles.home}>

      <h2>Hi 👋 i'm</h2>
      <h1>Dale French</h1>
      <h2>
        <TypeIt
          getBeforeInit={(instance) => {
            instance
              .type('A Frontend Engineer who likes building stuff')
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
              .move(-43)
              .pause(750)
              .delete(18)
              .pause(750)
              .type('n Engineering Manager')
              .go()
            return instance
          }}
        />
      </h2>
    </div>
  )
}

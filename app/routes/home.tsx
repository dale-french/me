import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dale French - Software Engineer' },
    {
      name: 'description',
      content:
        'I\'m an experienced Software Engineer / Engineering Manager based in Amsterdam.',
    },
  ]
}

export default function Home() {
  const handleChangeTheme = () => {
    const savedTheme = document.documentElement.getAttribute('data-theme')
    const newTheme = savedTheme === '🌚' ? '🌞' : '🌚'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button onClick={handleChangeTheme}>
      Switch Theme
    </button>
  )
}

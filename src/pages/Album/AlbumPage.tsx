import { FaSpotify, FaYoutube, FaAmazon } from 'react-icons/fa'

import styles from './AlbumPage.module.css'

type LinkItem = {
  id: string
  title: string
  url: string
  icon: React.ReactNode
}

const LINKS: LinkItem[] = [
  {
    id: 'spotify',
    title: 'Ascolta su Spotify',
    url: 'https://open.spotify.com/intl-it/artist/4PwVOfl7JZJIOJv35dogVU',
    icon: <FaSpotify />,
  },
  {
    id: 'youtube',
    title: 'Guarda su YouTube',
    url: 'https://www.youtube.com/channel/UC37K4rUHIH2rolI3cS4vw3Q',
    icon: <FaYoutube />,
  },
  {
    id: 'amazon',
    title: 'Acquista su Amazon',
    url: 'https://www.amazon.com/music/player/artists/B09V5MW1T1/nicola-raffaello-tallone',
    icon: <FaAmazon />,
  },
]

export function AlbumPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Album</h1>
        <p className={styles.description}>Discografia di Nicola, con link allo streaming o all'acquisto.</p>
        <div className={styles.linktree}>
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url || '#'}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.icon}>{link.icon}</div>
              <span className={styles.linkTitle}>{link.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiMail, FiMessageCircle } from 'react-icons/fi'

import styles from './Footer.module.css'

const SOCIAL_LINKS = [
  {
    icon: FiInstagram,
    label: 'Instagram',
    href: 'https://instagram.com/',
  },
  {
    icon: FiFacebook,
    label: 'Facebook',
    href: 'https://facebook.com/',
  },
  {
    icon: FiMail,
    label: 'Email',
    href: 'mailto:info@nicolatallone.com',
  },
  {
    icon: FiMessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/391234567890',
  },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Link to="/galleria" className={styles.galleryButton}>
        Galleria
      </Link>

      <div className={styles.socialGroup}>
        {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className={styles.socialLink}
          >
            <Icon aria-hidden />
          </a>
        ))}
      </div>
    </footer>
  )
}


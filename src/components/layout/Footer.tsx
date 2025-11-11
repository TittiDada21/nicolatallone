import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiMail, FiMessageCircle } from 'react-icons/fi'
import { Copy, Check } from 'lucide-react'

import styles from './Footer.module.css'

const SOCIAL_LINKS = [
  {
    icon: FiInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/nicolatallone/?hl=en',
    type: 'link' as const,
  },
  {
    icon: FiFacebook,
    label: 'Facebook',
    href: 'https://www.facebook.com/nicolaRAFFAEllotaLLOne',
    type: 'link' as const,
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'nitcellist@gmail.com',
    type: 'popup' as const,
  },
  {
    icon: FiMessageCircle,
    label: 'WhatsApp',
    value: '+41 79 401 60 15',
    type: 'popup' as const,
  },
]

export function Footer() {
  const [popup, setPopup] = useState<{ label: string; value: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSocialClick = (item: typeof SOCIAL_LINKS[0]) => {
    if (item.type === 'popup') {
      setPopup({ label: item.label, value: item.value! })
    }
  }

  return (
    <>
      <footer className={styles.footer}>
        <Link to="/galleria" className={styles.galleryButton}>
          Galleria
        </Link>

        <div className={styles.poweredBy}>
          <a href="https://www.dada21.com" target="_blank" rel="noreferrer" className={styles.poweredByLink}>
            powered by dada21
          </a>
        </div>

        <div className={styles.socialGroup}>
          {SOCIAL_LINKS.map((item) => {
            const { icon: Icon, label } = item
            if (item.type === 'link') {
              return (
                <a
                  key={label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={styles.socialLink}
                >
                  <Icon aria-hidden />
                </a>
              )
            }
            return (
              <button
                key={label}
                onClick={() => handleSocialClick(item)}
                aria-label={label}
                className={styles.socialLink}
              >
                <Icon aria-hidden />
              </button>
            )
          })}
        </div>
      </footer>

      {popup && (
        <div className={styles.popupOverlay} onClick={() => setPopup(null)}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <h3>{popup.label}</h3>
            <div className={styles.popupContent}>
              <span className={styles.popupValue}>{popup.value}</span>
              <button
                onClick={() => handleCopy(popup.value)}
                className={styles.copyButton}
                aria-label="Copia"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


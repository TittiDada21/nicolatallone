import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiMail, FiMessageCircle } from 'react-icons/fi'
import { Copy, Check } from 'lucide-react'

import { CONTENT_ROUTES } from '@/data/navigation'

import styles from './Footer.module.css'

const GENERIC_CONTENT_PATHS = CONTENT_ROUTES.filter(({ key }) => !key.startsWith('eventi/') && key !== 'progetti/album').map(
  ({ path }) => path,
)

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
  const location = useLocation()
  const [popup, setPopup] = useState<{ label: string; value: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const isGalleryPage = location.pathname === '/galleria'
  const isContentPage = GENERIC_CONTENT_PATHS.includes(location.pathname)

  useEffect(() => {
    if (!isGalleryPage && !isContentPage) {
      setIsAtBottom(true)
      return
    }

    setIsAtBottom(false)

    const checkScroll = () => {
      const windowHeight = window.innerHeight
      const html = document.documentElement
      const body = document.body
      
      const documentHeight = Math.max(
        html.scrollHeight,
        html.offsetHeight,
        body.scrollHeight,
        body.offsetHeight
      )
      
      const scrollTop = window.pageYOffset || html.scrollTop || body.scrollTop || 0
      
      const hasScroll = documentHeight > windowHeight + 10
      if (!hasScroll) {
        setIsAtBottom(true)
        return
      }
      
      const threshold = 300
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      const scrolledToBottom = distanceFromBottom <= threshold

      setIsAtBottom(scrolledToBottom)
    }

    const scrollHandler = () => {
      requestAnimationFrame(checkScroll)
    }
    
    const initCheck = () => {
      setTimeout(() => checkScroll(), 200)
      setTimeout(() => checkScroll(), 800)
      setTimeout(() => checkScroll(), 1500)
    }
    
    initCheck()
    window.addEventListener('scroll', scrollHandler, { passive: true })
    window.addEventListener('resize', checkScroll)
    
    const images = document.querySelectorAll('img')
    if (images.length > 0) {
      let loadedCount = 0
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++
        } else {
          img.addEventListener('load', () => {
            loadedCount++
            if (loadedCount === images.length) {
              setTimeout(checkScroll, 100)
            }
          })
        }
      })
      if (loadedCount === images.length) {
        setTimeout(checkScroll, 100)
      }
    }

    return () => {
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', checkScroll)
    }
  }, [isGalleryPage, isContentPage])

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
      <footer className={`${styles.footer} ${!isAtBottom ? styles.hidden : styles.visible}`}>
        <Link to="/galleria" className={styles.galleryButton}>
          Galleria
        </Link>

        <div className={styles.poweredBy}>
          <a href="https://www.dada21.com" target="_blank" rel="noreferrer" className={styles.poweredByLink}>
            Powered by <strong>Dada21</strong>
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


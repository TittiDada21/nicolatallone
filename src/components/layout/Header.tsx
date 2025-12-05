import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiExternalLink, FiMenu, FiX } from 'react-icons/fi'

import { NAV_ITEMS, type NavigationItem } from '@/data/navigation'

import styles from './Header.module.css'

const NAME_LINES = ['Nicola Raffaello', 'Tallone']

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string | undefined) => {
    if (!path) return false
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleNavigate = (item: NavigationItem) => {
    if (item.externalHref) {
      window.open(item.externalHref, '_blank', 'noopener')
      return
    }
    if (item.path) {
      navigate(item.path)
      setMobileOpen(false)
    }
  }

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img
          src="/media/logo-portal/portal-light-bg-128.png"
          alt="Nicola Raffaello Tallone logo"
          className={styles.logoMark}
        />
        <div className={styles.logoText}>
          {NAME_LINES.map((line, index) => (
            <span key={line} className={index === 1 ? styles.logoTextWide : ''}>{line}</span>
          ))}
        </div>
      </Link>

      <nav className={styles.desktopNav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <li key={item.label} className={styles.navItemWithDropdown}>
                  <span className={styles.navTrigger}>{item.label}</span>
                  <div className={styles.dropdown}>
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path ?? '#'}
                        className={`${styles.dropdownLink} ${
                          isActive(child.path) ? styles.activeLink : ''
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </li>
              )
            }

            return (
              <li key={item.label}>
                {item.externalHref ? (
                  <button
                    type="button"
                    className={`${styles.linkButton} ${isActive(item.path) ? styles.activeLink : ''}`}
                    onClick={() => handleNavigate(item)}
                  >
                    {item.label}
                    <FiExternalLink aria-hidden className={styles.externalIcon} />
                  </button>
                ) : (
                  <Link
                    to={item.path ?? '#'}
                    className={`${styles.navLink} ${isActive(item.path) ? styles.activeLink : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <button
        type="button"
        className={styles.mobileToggle}
        aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setMobileOpen((value) => !value)
        }}
      >
        {mobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {createPortal(
        <div className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ''}`}>
          <div className={styles.mobileNavContent}>
            <div className={styles.mobileHeader}>
              <span>Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Chiudi menu">
                <FiX />
              </button>
            </div>
            <div className={styles.mobileLinks}>
              {NAV_ITEMS.map((item) => {
                if (item.children) {
                  const isExpanded = expandedItems.has(item.label)
                  return (
                    <div key={item.label} className={styles.mobileGroup}>
                      <button
                        type="button"
                        className={styles.mobileGroupHeader}
                        onClick={() => toggleExpanded(item.label)}
                      >
                        <span>{item.label}</span>
                        <span className={styles.mobileGroupIcon}>{isExpanded ? '−' : '+'}</span>
                      </button>
                      {isExpanded && (
                        <div className={styles.mobileGroupChildren}>
                          {item.children.map((child) => (
                            <button
                              key={child.path}
                              type="button"
                              className={`${styles.mobileLink} ${styles.mobileSubLink} ${
                                isActive(child.path) ? styles.mobileLinkActive : ''
                              }`}
                              onClick={() => handleNavigate(child)}
                            >
                              {child.label}
                              {child.externalHref && <FiExternalLink aria-hidden className={styles.externalIcon} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`${styles.mobileLink} ${isActive(item.path) ? styles.mobileLinkActive : ''}`}
                    onClick={() => handleNavigate(item)}
                  >
                    {item.label}
                    {item.externalHref && <FiExternalLink aria-hidden className={styles.externalIcon} />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}

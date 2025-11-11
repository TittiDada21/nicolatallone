import type { PropsWithChildren } from 'react'

import styles from './GlassPanel.module.css'

type GlassPanelProps = PropsWithChildren<{
  size?: 'narrow' | 'wide'
}> &
  React.HTMLAttributes<HTMLDivElement>

export function GlassPanel({ children, size = 'narrow', className = '', ...rest }: GlassPanelProps) {
  return (
    <div className={`${styles.panel} ${styles[size]} ${className}`} {...rest}>
      {children}
    </div>
  )
}


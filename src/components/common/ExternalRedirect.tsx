import { useEffect } from 'react'

type ExternalRedirectProps = {
  href: string
}

export function ExternalRedirect({ href }: ExternalRedirectProps) {
  useEffect(() => {
    window.open(href, '_blank', 'noopener')
  }, [href])

  return null
}


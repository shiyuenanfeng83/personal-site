import { useEffect, useState } from 'react'

const KEY = 'theme'

function readInitial() {
  if (typeof window === 'undefined') return false
  const saved = localStorage.getItem(KEY)
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const [dark, setDark] = useState(readInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(KEY, dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark((v) => !v) }
}

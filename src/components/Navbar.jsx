import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme.js'
import { MenuIcon, CloseIcon, MoonIcon, SunIcon } from './Icons.jsx'

const links = [
  { href: '#about', label: '关于我' },
  { href: '#skills', label: '技能' },
  { href: '#projects', label: '作品集' },
  { href: '#experience', label: '经历' },
  { href: '#contact', label: '联系' },
]

export default function Navbar({ name }) {
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled ? 'backdrop-blur bg-white/80 border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800' : ''
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-sm font-bold text-white">{name ? [...name][0] : 'M'}</span>
          <span className="hidden sm:inline">{name}</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900
                         dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggle}
            aria-label="切换主题"
            className="ml-2 grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600
                       transition hover:text-brand-500 dark:border-slate-700 dark:text-slate-300"
          >
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 md:hidden dark:border-slate-700"
        >
          {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-300"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggle}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-300"
          >
            {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            {dark ? '切换到浅色' : '切换到深色'}
          </button>
        </div>
      )}
    </header>
  )
}

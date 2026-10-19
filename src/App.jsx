import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'
import AdminPanel from './components/admin/AdminPanel.jsx'
import { useSite } from './store/siteStore.jsx'

export default function App() {
  const { data } = useSite()
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (hash.startsWith('#admin')) return <AdminPanel />

  return (
    <div className="min-h-screen">
      <Navbar name={data.profile.name} />
      <main>
        <Hero profile={data.profile} />
        <div className="border-t border-slate-100 dark:border-slate-800/60">
          <About content={data.about} />
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800/60">
          <Skills groups={data.profile.skillGroups} />
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800/60">
          <Projects projects={data.projects} />
        </div>
        <div className="border-t border-slate-100 dark:border-slate-800/60">
          <Experience items={data.experience} />
        </div>
        <Contact profile={data.profile} />
      </main>
      <footer className="border-t border-slate-100 py-10 dark:border-slate-800/60">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} {data.profile.name} · 使用 React + Vite + Tailwind CSS 构建
          </p>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-brand-500">
              回到顶部
            </a>
            <a href="#admin" className="hover:text-brand-500">
              管理
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

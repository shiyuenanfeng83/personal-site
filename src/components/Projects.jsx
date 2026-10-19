import { useState } from 'react'
import { ArrowIcon } from './Icons.jsx'

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('all')
  const tags = ['all', ...new Set(projects.map((p) => p.role))]
  const list = filter === 'all' ? projects : projects.filter((p) => p.role === filter)

  return (
    <section id="projects" className="container-page py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="section-title">作品集</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === t
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((p) => (
          <article key={p.id} className="card flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{p.period}</p>
              </div>
              {p.featured && (
                <span className="chip bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">精选</span>
              )}
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{p.summary}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{p.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span key={h} className="chip border border-brand-500/30 text-brand-600 dark:text-brand-400">
                  {h}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.tech.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4 pt-1 text-sm">
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-brand-500 hover:underline"
                >
                  在线预览 <ArrowIcon className="h-4 w-4" />
                </a>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-500">
                  源码
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

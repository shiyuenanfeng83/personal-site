import { socialIcons, ArrowIcon } from './Icons.jsx'

export default function Hero({ profile }) {
  return (
    <section id="top" className="container-page pt-28 pb-16 sm:pt-36">
      <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:text-left">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-4 ring-brand-500/20 sm:h-32 sm:w-32"
        />
        <div className="animate-fade-up">
          <p className="text-sm font-medium text-brand-500">{profile.location}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{profile.name}</h1>
          <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">{profile.title}</p>
          <p className="mx-auto mt-4 max-w-xl text-slate-600 sm:mx-0 dark:text-slate-400">{profile.tagline}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-medium text-white
                         shadow-lg shadow-brand-500/25 transition hover:bg-brand-600"
            >
              查看作品集 <ArrowIcon className="h-4 w-4" />
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium
                         transition hover:border-brand-500 hover:text-brand-500 dark:border-slate-700 dark:hover:border-brand-500"
            >
              下载简历
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 sm:max-w-lg">
        {profile.stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-slate-50 py-4 text-center dark:bg-slate-900">
            <div className="text-2xl font-bold text-brand-500">{s.value}</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        {profile.socials.map((s) => {
          const Icon = socialIcons[s.icon] ?? socialIcons.link
          return (
            <a
              key={s.label}
              href={s.url}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600
                         transition hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-500
                         dark:border-slate-800 dark:text-slate-300"
            >
              <Icon className="h-4 w-4" />
              {s.label}
            </a>
          )
        })}
      </div>
    </section>
  )
}

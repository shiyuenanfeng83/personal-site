import { socialIcons, MailIcon } from './Icons.jsx'

export default function Contact({ profile }) {
  return (
    <section id="contact" className="container-page py-16">
      <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-12 text-center text-white sm:px-12">
        <h2 className="text-2xl font-bold sm:text-3xl">正在寻找合作机会？</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/85">
          无论是项目合作、技术交流还是招聘机会，都欢迎随时联系我，我通常会在 24 小时内回复。
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-600
                     shadow-lg transition hover:-translate-y-0.5"
        >
          <MailIcon className="h-5 w-5" />
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {profile.socials.map((s) => {
            const Icon = socialIcons[s.icon] ?? socialIcons.link
            return (
              <a
                key={s.label}
                href={s.url}
                target={s.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

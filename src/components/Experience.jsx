export default function Experience({ items }) {
  return (
    <section id="experience" className="container-page py-16">
      <h2 className="section-title">工作经历</h2>
      <ol className="mt-8 space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800">
        {items.map((it) => (
          <li key={it.company + it.period} className="relative">
            <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-brand-500 ring-4 ring-brand-500/20" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold">
                {it.role} · <span className="text-brand-500">{it.company}</span>
              </h3>
              <span className="text-xs text-slate-400">
                {it.period} · {it.location}
              </span>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {it.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

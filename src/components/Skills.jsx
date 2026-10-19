export default function Skills({ groups }) {
  return (
    <section id="skills" className="container-page py-16">
      <h2 className="section-title">技能</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.name} className="card">
            <h3 className="font-semibold">{g.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {g.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

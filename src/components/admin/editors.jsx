import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Card, ChipField, Field, TextArea, TextField, Toggle } from './fields.jsx'

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const move = (arr, i, dir) => {
  const j = i + dir
  if (j < 0 || j >= arr.length) return arr
  const next = [...arr]
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

/* ---------------- 基本资料 ---------------- */
export function ProfileEditor({ profile, onChange }) {
  const fileRef = useRef(null)
  const set = (patch) => onChange({ ...profile, ...patch })

  const onUploadAvatar = (file) => {
    const reader = new FileReader()
    reader.onload = () => set({ avatar: String(reader.result) })
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <Card title="基本信息">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="姓名" value={profile.name} onChange={(v) => set({ name: v })} />
          <TextField label="职位/头衔" value={profile.title} onChange={(v) => set({ title: v })} />
          <TextField label="所在地" value={profile.location} onChange={(v) => set({ location: v })} />
          <TextField label="邮箱" value={profile.email} onChange={(v) => set({ email: v })} />
          <TextField label="头像地址" hint="粘贴图片外链，或上传本地图片" value={profile.avatar} onChange={(v) => set({ avatar: v })} />
          <TextField label="简历文件地址" hint="如 public/resume.pdf 填写 ./resume.pdf" value={profile.resumeUrl} onChange={(v) => set({ resumeUrl: v })} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && onUploadAvatar(e.target.files[0])}
          />
          <Button onClick={() => fileRef.current?.click()}>上传头像</Button>
          <img src={profile.avatar} alt="预览" className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200" />
        </div>
        <div className="mt-4">
          <TextArea label="一句话简介" rows={2} value={profile.tagline} onChange={(v) => set({ tagline: v })} />
        </div>
      </Card>

      <Card title="数据卡片">
        <div className="space-y-3">
          {profile.stats.map((s, i) => (
            <div key={i} className="flex gap-3">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={s.label}
                onChange={(e) => set({ stats: profile.stats.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={s.value}
                onChange={(e) => set({ stats: profile.stats.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)) })}
              />
              <Button
                variant="danger"
                onClick={() => onChange({ ...profile, stats: profile.stats.filter((_, k) => k !== i) }, `数据指标「${s.label}」`)}
              >
                删除
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button onClick={() => set({ stats: [...profile.stats, { label: '新指标', value: '0' }] })}>+ 添加指标</Button>
        </div>
      </Card>

      <Card title="技能分组">
        <div className="space-y-4">
          {profile.skillGroups.map((g, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <input
                  className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  value={g.name}
                  onChange={(e) =>
                    set({ skillGroups: profile.skillGroups.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)) })
                  }
                />
                <Button
                  variant="danger"
                  onClick={() => onChange({ ...profile, skillGroups: profile.skillGroups.filter((_, k) => k !== i) }, `技能分组「${g.name}」`)}
                >
                  删除分组
                </Button>
              </div>
              <div className="mt-3">
                <ChipField
                  label="技能项"
                  value={g.skills}
                  onChange={(v) =>
                    set({ skillGroups: profile.skillGroups.map((x, k) => (k === i ? { ...x, skills: v } : x)) })
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button onClick={() => set({ skillGroups: [...profile.skillGroups, { name: '新分组', skills: [] }] })}>
            + 添加分组
          </Button>
        </div>
      </Card>

      <Card title="社交链接">
        <div className="space-y-3">
          {profile.socials.map((s, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr_1fr_auto]">
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={s.label}
                placeholder="名称"
                onChange={(e) =>
                  set({ socials: profile.socials.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) })
                }
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={s.url}
                placeholder="链接"
                onChange={(e) => set({ socials: profile.socials.map((x, k) => (k === i ? { ...x, url: e.target.value } : x)) })}
              />
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                value={s.icon}
                onChange={(e) => set({ socials: profile.socials.map((x, k) => (k === i ? { ...x, icon: e.target.value } : x)) })}
              >
                <option value="github">GitHub</option>
                <option value="mail">邮箱</option>
                <option value="wechat">微信</option>
                <option value="link">链接</option>
              </select>
              <Button
                variant="danger"
                onClick={() => onChange({ ...profile, socials: profile.socials.filter((_, k) => k !== i) }, `社交链接「${s.label}」`)}
              >
                删除
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Button onClick={() => set({ socials: [...profile.socials, { label: '新链接', url: 'https://', icon: 'link' }] })}>
            + 添加链接
          </Button>
        </div>
      </Card>
    </div>
  )
}

/* ---------------- 关于我 ---------------- */
export function AboutEditor({ about, onChange }) {
  const [preview, setPreview] = useState(false)
  return (
    <Card
      title="关于我（Markdown）"
      actions={
        <div className="flex gap-2">
          <Button onClick={() => setPreview((v) => !v)}>{preview ? '继续编辑' : '预览效果'}</Button>
        </div>
      }
    >
      {preview ? (
        <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{about}</ReactMarkdown>
        </div>
      ) : (
        <Field label="正文内容" hint="支持标准 Markdown：标题、列表、加粗、引用、链接">
          <textarea
            className="min-h-[320px] w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm outline-none
                       focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
            value={about}
            onChange={(e) => onChange(e.target.value)}
          />
        </Field>
      )}
    </Card>
  )
}

/* ---------------- 作品集 ---------------- */
export function ProjectsEditor({ projects, onChange }) {
  const update = (i, patch) => onChange(projects.map((p, k) => (k === i ? { ...p, ...patch } : p)))

  return (
    <div className="space-y-5">
      {projects.map((p, i) => (
        <Card
          key={p.id ?? i}
          title={p.name || '未命名项目'}
          actions={
            <div className="flex gap-2">
              <Button onClick={() => onChange(move(projects, i, -1))}>↑</Button>
              <Button onClick={() => onChange(move(projects, i, 1))}>↓</Button>
              <Button variant="danger" onClick={() => onChange(projects.filter((_, k) => k !== i), `项目「${p.name || '未命名'}」`)}>
                删除
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="项目名称" value={p.name} onChange={(v) => update(i, { name: v })} />
            <TextField label="担任角色" value={p.role} onChange={(v) => update(i, { role: v })} />
            <TextField label="时间" value={p.period} onChange={(v) => update(i, { period: v })} />
            <TextField label="封面图地址" hint="留空则不显示图片" value={p.cover} onChange={(v) => update(i, { cover: v })} />
          </div>
          <div className="mt-4">
            <TextField label="一句话摘要" value={p.summary} onChange={(v) => update(i, { summary: v })} />
          </div>
          <div className="mt-4">
            <TextArea label="详细描述" rows={3} value={p.description} onChange={(v) => update(i, { description: v })} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ChipField label="亮点标签" value={p.highlights} onChange={(v) => update(i, { highlights: v })} />
            <ChipField label="技术栈" value={p.tech} onChange={(v) => update(i, { tech: v })} />
            <TextField label="在线预览链接" value={p.demo} onChange={(v) => update(i, { demo: v })} />
            <TextField label="源码链接" value={p.repo} onChange={(v) => update(i, { repo: v })} />
          </div>
          <div className="mt-4">
            <Toggle label="标记为精选项目" checked={p.featured} onChange={(v) => update(i, { featured: v })} />
          </div>
        </Card>
      ))}
      <Button
        variant="primary"
        onClick={() =>
          onChange([
            ...projects,
            {
              id: newId(),
              name: '新项目',
              summary: '',
              description: '',
              highlights: [],
              tech: [],
              role: '参与开发',
              period: '',
              cover: '',
              demo: '',
              repo: '',
              featured: false,
            },
          ])
        }
      >
        + 添加项目
      </Button>
    </div>
  )
}

/* ---------------- 工作经历 ---------------- */
export function ExperienceEditor({ experience, onChange }) {
  const update = (i, patch) => onChange(experience.map((x, k) => (k === i ? { ...x, ...patch } : x)))

  return (
    <div className="space-y-5">
      {experience.map((item, i) => (
        <Card
          key={i}
          title={item.company || '未命名经历'}
          actions={
            <div className="flex gap-2">
              <Button onClick={() => onChange(move(experience, i, -1))}>↑</Button>
              <Button onClick={() => onChange(move(experience, i, 1))}>↓</Button>
              <Button
                variant="danger"
                onClick={() => onChange(experience.filter((_, k) => k !== i), `经历「${item.company || '未命名'}」`)}
              >
                删除
              </Button>
            </div>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="公司/组织" value={item.company} onChange={(v) => update(i, { company: v })} />
            <TextField label="职位" value={item.role} onChange={(v) => update(i, { role: v })} />
            <TextField label="时间" value={item.period} onChange={(v) => update(i, { period: v })} />
            <TextField label="地点" value={item.location} onChange={(v) => update(i, { location: v })} />
          </div>
          <div className="mt-4">
            <Field label="主要职责与成果" hint="每行一条">
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none
                           focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900"
                value={(item.points || []).join('\n')}
                onChange={(e) => update(i, { points: e.target.value.split('\n') })}
              />
            </Field>
          </div>
        </Card>
      ))}
      <Button
        variant="primary"
        onClick={() => onChange([...experience, { company: '新公司', role: '新职位', period: '', location: '', points: [] }])}
      >
        + 添加经历
      </Button>
    </div>
  )
}

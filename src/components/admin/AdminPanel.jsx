import { useEffect, useRef, useState } from 'react'
import { useSite, DEFAULT_PASSCODE } from '../../store/siteStore.jsx'
import { AboutEditor, ExperienceEditor, ProfileEditor, ProjectsEditor } from './editors.jsx'
import { Button, Card, ConfirmButton, TextField } from './fields.jsx'

const TABS = [
  { key: 'profile', label: '基本资料' },
  { key: 'about', label: '关于我' },
  { key: 'projects', label: '作品集' },
  { key: 'experience', label: '经历' },
  { key: 'settings', label: '设置' },
]

function Login({ onSuccess, onExit }) {
  const { verifyPasscode } = useSite()
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (verifyPasscode(pwd)) onSuccess()
    else setError('口令不正确，请重试')
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
        <h1 className="text-lg font-semibold">进入编辑后台</h1>
        <p className="mt-1 text-sm text-slate-500">请输入访问口令（默认 {DEFAULT_PASSCODE}）</p>
        <div className="mt-4">
          <TextField label="口令" type="password" value={pwd} onChange={setPwd} />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-5 flex gap-3">
          <Button variant="primary" type="submit">
            进入
          </Button>
          <Button onClick={onExit}>返回站点</Button>
        </div>
      </form>
    </div>
  )
}

function Settings({ onLogout }) {
  const { resetAll, getPasscode, setPasscode, logout } = useSite()
  const [pwd, setPwd] = useState('')
  const [msg, setMsg] = useState('')

  return (
    <div className="space-y-6">
      <Card title="修改访问口令">
        <div className="max-w-sm">
          <TextField label="新口令" type="password" value={pwd} onChange={setPwd} hint={`当前口令：${getPasscode()}`} />
        </div>
        <div className="mt-4 flex gap-3">
          <Button
            variant="primary"
            onClick={() => {
              if (!pwd) return setMsg('请输入新口令')
              setPasscode(pwd)
              setPwd('')
              setMsg('口令已更新')
            }}
          >
            保存口令
          </Button>
          <Button
            onClick={() => {
              logout()
              onLogout()
            }}
          >
            退出登录
          </Button>
        </div>
        {msg && <p className="mt-3 text-sm text-brand-500">{msg}</p>}
      </Card>

      <Card title="数据管理">
        <p className="text-sm text-slate-500">
          编辑内容保存在浏览器本地（localStorage），刷新与重新打开浏览器都不会丢失。若要让线上站点永久生效，请导出源文件并覆盖
          <code className="mx-1 rounded bg-slate-100 px-1 dark:bg-slate-800">src/data/</code> 下的同名文件后重新部署。
        </p>
        <div className="mt-4">
          <ConfirmButton confirmText="确认恢复？" onConfirm={resetAll}>
            恢复为默认内容
          </ConfirmButton>
        </div>
      </Card>
    </div>
  )
}

export default function AdminPanel() {
  const {
    data,
    setValue,
    exportSourceFiles,
    exportBackup,
    importBackup,
    isAuthed,
    logout,
    error,
    clearError,
    undoState,
    undo,
    dismissUndo,
  } = useSite()
  const [authed, setAuthed] = useState(isAuthed)
  const [tab, setTab] = useState(() => {
    const m = window.location.hash.match(/^#admin\/(\w+)/)
    return m && TABS.some((t) => t.key === m[1]) ? m[1] : 'profile'
  })
  const fileRef = useRef(null)

  useEffect(() => {
    if (!undoState) return
    const timer = setTimeout(dismissUndo, 8000)
    return () => clearTimeout(timer)
  }, [undoState, dismissUndo])

  const exit = () => {
    window.location.hash = ''
  }

  if (!authed) return <Login onSuccess={() => setAuthed(true)} onExit={exit} />

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-5 py-3">
          <span className="font-semibold">编辑后台</span>
          <span className="chip">自动保存</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button onClick={exportSourceFiles} variant="primary">
              导出源文件
            </Button>
            <Button onClick={exportBackup}>备份 JSON</Button>
            <Button onClick={() => fileRef.current?.click()}>导入备份</Button>
            <Button
              onClick={() => {
                logout()
                setAuthed(false)
              }}
            >
              退出
            </Button>
            <Button onClick={exit}>查看站点</Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importBackup(f)
              e.target.value = ''
            }}
          />
        </div>
      </header>

      {error && (
        <div className="bg-red-50 px-5 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <span>{error}</span>
            <button onClick={clearError} className="shrink-0 underline">
              关闭
            </button>
          </div>
        </div>
      )}

      {undoState && (
        <div className="bg-brand-50 px-5 py-2.5 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <span>已删除 {undoState.label}</span>
            <div className="flex shrink-0 items-center gap-3">
              <button onClick={undo} className="font-medium underline">
                撤销
              </button>
              <button onClick={dismissUndo}>关闭</button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium transition ${
                tab === t.key
                  ? 'border-b-2 border-brand-500 text-brand-500'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-6">
        {tab === 'profile' && <ProfileEditor profile={data.profile} onChange={(v, label) => setValue('profile', v, label)} />}
        {tab === 'about' && <AboutEditor about={data.about} onChange={(v) => setValue('about', v)} />}
        {tab === 'projects' && <ProjectsEditor projects={data.projects} onChange={(v, label) => setValue('projects', v, label)} />}
        {tab === 'experience' && (
          <ExperienceEditor experience={data.experience} onChange={(v, label) => setValue('experience', v, label)} />
        )}
        {tab === 'settings' && <Settings onLogout={() => setAuthed(false)} />}
      </main>
    </div>
  )
}

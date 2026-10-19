import { useState } from 'react'
import { useSite } from '../../store/siteStore.jsx'
import { findRun, putFile, siteUrl } from '../../lib/github.js'
import { Button, Card, TextField, Toggle } from './fields.jsx'

const CFG_KEY = 'site:publish:cfg'
const TOKEN_KEY = 'site:publish:token'

const readCfg = () => {
  try {
    return { owner: 'shiyuenanfeng83', repo: 'personal-site', branch: 'main', ...JSON.parse(localStorage.getItem(CFG_KEY) || '{}') }
  } catch {
    return { owner: 'shiyuenanfeng83', repo: 'personal-site', branch: 'main' }
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function PublishPanel() {
  const { data } = useSite()
  const [cfg, setCfg] = useState(readCfg)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [remember, setRemember] = useState(() => !!localStorage.getItem(TOKEN_KEY))
  const [busy, setBusy] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)

  const set = (patch) => {
    const next = { ...cfg, ...patch }
    setCfg(next)
    localStorage.setItem(CFG_KEY, JSON.stringify(next))
  }

  const append = (text) => setLogs((l) => [...l, text])

  const publish = async () => {
    if (!token) return append('请先填写 GitHub Token')
    setBusy(true)
    setResult(null)
    setLogs([])

    const files = [
      { path: 'src/data/profile.json', content: JSON.stringify(data.profile, null, 2) + '\n' },
      { path: 'src/data/projects.json', content: JSON.stringify(data.projects, null, 2) + '\n' },
      { path: 'src/data/experience.json', content: JSON.stringify(data.experience, null, 2) + '\n' },
      { path: 'src/data/about.md', content: data.about },
    ]

    try {
      if (remember) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)

      const startedAt = new Date().toISOString()
      for (const f of files) {
        append(`正在提交 ${f.path} …`)
        await putFile({
          token,
          owner: cfg.owner,
          repo: cfg.repo,
          branch: cfg.branch,
          path: f.path,
          content: f.content,
          message: `chore: 更新站点内容（${new Date().toLocaleString('zh-CN')}）`,
        })
      }
      append('已提交到仓库，等待 GitHub Actions 自动部署…')

      let run = null
      for (let i = 0; i < 60; i++) {
        await sleep(5000)
        run = await findRun({ token, owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, since: startedAt })
        if (run && run.status === 'completed') break
      }

      if (run?.conclusion === 'success') {
        append('部署完成')
        setResult({ ok: true, url: siteUrl(cfg.owner, cfg.repo), runUrl: run.html_url })
      } else {
        append('部署未成功，请到 Actions 页面查看日志')
        setResult({ ok: false, runUrl: run?.html_url || `https://github.com/${cfg.owner}/${cfg.repo}/actions` })
      }
    } catch (e) {
      append(`失败：${e.message}`)
      setResult({ ok: false })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card title="发布到线上">
        <p className="text-sm text-slate-500">
          点击发布后，会把当前编辑的内容写入仓库的 <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/data/</code>，
          GitHub Actions 会自动重新构建并更新线上站点（约 1–2 分钟）。
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <TextField label="仓库拥有者" value={cfg.owner} onChange={(v) => set({ owner: v })} />
          <TextField label="仓库名" value={cfg.repo} onChange={(v) => set({ repo: v })} />
          <TextField label="分支" value={cfg.branch} onChange={(v) => set({ branch: v })} />
        </div>

        <div className="mt-4 max-w-xl">
          <TextField
            label="GitHub Token"
            type="password"
            value={token}
            onChange={setToken}
            hint="需要 repo 与 workflow 权限的 Personal Access Token"
          />
          <div className="mt-3">
            <Toggle label="在本机记住 Token（保存在浏览器本地，不会上传到任何服务器）" checked={remember} onChange={setRemember} />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={publish} disabled={busy}>
            {busy ? '发布中…' : '发布到线上'}
          </Button>
          {token && !remember && (
            <Button
              onClick={() => {
                setToken('')
                localStorage.removeItem(TOKEN_KEY)
              }}
            >
              清除 Token
            </Button>
          )}
        </div>

        {logs.length > 0 && (
          <ol className="mt-5 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
            {logs.map((l, i) => (
              <li key={i}>· {l}</li>
            ))}
          </ol>
        )}

        {result?.ok && (
          <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
            已上线：
            <a href={result.url} target="_blank" rel="noreferrer" className="ml-1 font-medium underline">
              {result.url}
            </a>
            <a href={result.runUrl} target="_blank" rel="noreferrer" className="ml-3 underline">
              查看构建日志
            </a>
          </div>
        )}
        {result && !result.ok && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400">
            发布失败。
            <a href={result.runUrl} target="_blank" rel="noreferrer" className="ml-1 underline">
              查看 Actions 日志
            </a>
          </div>
        )}
      </Card>
    </div>
  )
}

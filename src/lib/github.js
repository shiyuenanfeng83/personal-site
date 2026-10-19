const API = 'https://api.github.com'

function toBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
  }
  return btoa(bin)
}

const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/')

async function gh(path, token, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let detail = ''
    try {
      const j = await res.json()
      detail = j.message || ''
    } catch {
      detail = await res.text().catch(() => '')
    }
    throw new Error(`${res.status} ${res.statusText} ${detail}`.trim())
  }
  return res.status === 204 ? null : res.json()
}

/** 更新（或新建）仓库中的单个文件，返回 commit 信息 */
export async function putFile({ token, owner, repo, branch, path, content, message }) {
  let sha
  try {
    const existing = await gh(`/repos/${owner}/${repo}/contents/${encodePath(path)}?ref=${branch}`, token)
    sha = existing?.sha
  } catch {
    sha = undefined // 文件不存在则新建
  }
  const body = { message, content: toBase64(content), branch }
  if (sha) body.sha = sha
  return gh(`/repos/${owner}/${repo}/contents/${encodePath(path)}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/** 查询指定分支最近一次工作流运行（可限定不早于 since） */
export async function findRun({ token, owner, repo, branch, since }) {
  const data = await gh(`/repos/${owner}/${repo}/actions/runs?branch=${branch}&per_page=5`, token)
  const runs = data.workflow_runs || []
  return runs.find((r) => !since || r.created_at >= since) || null
}

export function siteUrl(owner, repo) {
  return repo.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? `https://${owner}.github.io/`
    : `https://${owner}.github.io/${repo}/`
}

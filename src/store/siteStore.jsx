import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import defaultProfile from '../data/profile.json'
import defaultProjects from '../data/projects.json'
import defaultExperience from '../data/experience.json'
import defaultAbout from '../data/about.md?raw'

const DATA_KEY = 'site:data:v1'
const PASS_KEY = 'site:admin:pass'
const SESSION_KEY = 'site:admin:session'
export const DEFAULT_PASSCODE = 'admin123'

const defaults = {
  profile: defaultProfile,
  projects: defaultProjects,
  experience: defaultExperience,
  about: defaultAbout,
}

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (!raw) return defaults
    const saved = JSON.parse(raw)
    return { ...defaults, ...saved }
  } catch {
    return defaults
  }
}

export function downloadFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [data, setData] = useState(loadData)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState('')
  const [undoState, setUndoState] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data))
      setDirty(true)
      setError('')
    } catch (e) {
      console.error(e)
      setError('保存失败：本地存储空间可能已满，头像建议使用外链 URL 而非上传大图。')
    }
  }, [data])

  // undoLabel 非空时记录一份修改前的快照，UI 侧可展示“撤销”
  const setValue = useCallback(
    (key, value, undoLabel = '') => {
      setData((prev) => ({ ...prev, [key]: value }))
      setUndoState(undoLabel ? { label: undoLabel, data } : null)
    },
    [data]
  )

  const undo = useCallback(() => {
    setUndoState((u) => {
      if (u) setData(u.data)
      return null
    })
  }, [])

  const dismissUndo = useCallback(() => setUndoState(null), [])

  const resetAll = useCallback(() => setData(defaults), [])
  const clearError = useCallback(() => setError(''), [])

  const exportSourceFiles = useCallback(() => {
    downloadFile('profile.json', JSON.stringify(data.profile, null, 2), 'application/json')
    downloadFile('projects.json', JSON.stringify(data.projects, null, 2), 'application/json')
    downloadFile('experience.json', JSON.stringify(data.experience, null, 2), 'application/json')
    downloadFile('about.md', data.about, 'text/markdown')
  }, [data])

  const exportBackup = useCallback(() => {
    downloadFile('site-data.json', JSON.stringify(data, null, 2), 'application/json')
  }, [data])

  const importBackup = useCallback(async (file) => {
    try {
      const parsed = JSON.parse(await file.text())
      setData((prev) => ({ ...prev, ...parsed }))
      return true
    } catch {
      setError('导入失败：文件格式不是有效的 JSON。')
      return false
    }
  }, [])

  // ---- 访问口令（纯前端保护，仅防误操作）----
  const getPasscode = () => localStorage.getItem(PASS_KEY) || DEFAULT_PASSCODE
  const setPasscode = (p) => {
    localStorage.setItem(PASS_KEY, p)
    sessionStorage.setItem(SESSION_KEY, '1')
  }
  const verifyPasscode = (p) => {
    if (p === getPasscode()) {
      sessionStorage.setItem(SESSION_KEY, '1')
      return true
    }
    return false
  }
  const isAuthed = () => sessionStorage.getItem(SESSION_KEY) === '1'
  const logout = () => sessionStorage.removeItem(SESSION_KEY)

  const value = useMemo(
    () => ({
      data,
      setValue,
      dirty,
      error,
      clearError,
      undoState,
      undo,
      dismissUndo,
      resetAll,
      exportSourceFiles,
      exportBackup,
      importBackup,
      getPasscode,
      setPasscode,
      verifyPasscode,
      isAuthed,
      logout,
    }),
    [data, dirty, error, clearError, undoState, undo, dismissUndo, setValue, resetAll, exportSourceFiles, exportBackup, importBackup]
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite 必须在 SiteProvider 内使用')
  return ctx
}

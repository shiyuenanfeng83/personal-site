import { useEffect, useRef, useState } from 'react'

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition ' +
  'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-700 dark:bg-slate-900'

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

export function TextField({ label, hint, value, onChange, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  )
}

export function TextArea({ label, hint, value, onChange, rows = 4, ...rest }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputCls} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  )
}

export function ChipField({ label, hint, value = [], onChange }) {
  const [text, setText] = useState(value.join('、'))
  useEffect(() => setText(value.join('、')), [value])

  const commit = (t) => onChange(t.split(/[,，、]/).map((s) => s.trim()).filter(Boolean))

  return (
    <Field label={label} hint={hint ?? '用逗号或顿号分隔'}>
      <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} onBlur={(e) => commit(e.target.value)} />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span key={v + i} className="chip">
            {v}
          </span>
        ))}
      </div>
    </Field>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" className="h-4 w-4 accent-brand-500" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function Card({ title, actions, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h3 className="font-semibold">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  )
}

/**
 * 两段式确认按钮：第一次点击进入待确认状态，再次点击才真正执行。
 * 不依赖 window.confirm，避免被浏览器/预览环境拦截导致操作“点了没反应”。
 */
export function ConfirmButton({ children, confirmText = '确认删除？', onConfirm, variant = 'danger', timeout = 4000 }) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const timer = setTimeout(() => setArmed(false), timeout)
    return () => clearTimeout(timer)
  }, [armed, timeout])

  return (
    <Button
      variant={armed ? 'primary' : variant}
      onClick={() => {
        if (armed) {
          setArmed(false)
          onConfirm()
        } else {
          setArmed(true)
        }
      }}
    >
      {armed ? confirmText : children}
    </Button>
  )
}

export function Button({ children, onClick, variant = 'default', type = 'button', ...rest }) {
  const styles = {
    default: 'border border-slate-300 hover:border-brand-500 hover:text-brand-500 dark:border-slate-700',
    primary: 'bg-brand-500 text-white hover:bg-brand-600',
    danger: 'border border-red-300 text-red-500 hover:bg-red-50 dark:border-red-500/40 dark:hover:bg-red-500/10',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${styles[variant]}`}
      {...rest}
    >
      {children}
    </button>
  )
}

import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { Status } from '../types'

export const STATUS_COLOR: Record<Status, string> = { pass: '#279361', warn: '#F59E0B', fail: '#EF4444' }

export function Dot({ status }: { status: Status }) {
  const color = STATUS_COLOR[status]
  return <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px ${color}22` }} />
}

interface BtnProps {
  icon?: LucideIcon
  children: ReactNode
  onClick: () => void
  primary?: boolean
  disabled?: boolean
}

export function Btn({ icon: Icon, children, onClick, primary, disabled }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
        primary ? 'border-transparent bg-btn text-white shadow-soft hover:opacity-90' : 'border-line bg-panel hover:border-ac'
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  )
}

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-mute">{sub}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export function Ring({ value }: { value: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" role="img" aria-label={`${value} / 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="9" />
      <circle
        cx="60" cy="60" r={r} fill="none" stroke="#63C795" strokeWidth="9" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)' }}
      />
      <text
        x="60" y="60" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="28" fontWeight="600"
        className="font-mono" transform="rotate(90 60 60)"
      >
        {value}
      </text>
    </svg>
  )
}

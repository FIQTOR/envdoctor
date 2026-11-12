import { Menu, ShieldCheck, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TFn } from '../i18n'
import type { ModuleId } from '../types'
import { MODULES } from '../types'
import { DASH_ICON, MODULE_ICON, REPORT_ICON, SETTINGS_ICON } from './icons'
import { STATUS_COLOR } from './ui'

export type View = 'dash' | ModuleId | 'report' | 'set'

const NAV: [View, LucideIcon][] = [
  ['dash', DASH_ICON],
  ...MODULES.map((m): [View, LucideIcon] => [m, MODULE_ICON[m]]),
  ['report', REPORT_ICON],
  ['set', SETTINGS_ICON],
]

interface Props {
  view: View
  onNavigate: (v: View) => void
  open: boolean
  onToggle: () => void
  score: number
  failCounts: Partial<Record<ModuleId, number>>
  t: TFn
}

export function Sidebar({ view, onNavigate, open, onToggle, score, failCounts, t }: Props) {
  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bg px-4 py-3 md:hidden">
        <button aria-label="Menu" onClick={onToggle}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        <span className="font-bold">EnvDoctor</span>
        <span className="ml-auto font-mono text-xs text-ac">{score}/100</span>
      </header>
      <aside
        className={`${open ? 'flex' : 'hidden'} fixed inset-x-0 top-[49px] z-20 flex-col gap-1 overflow-y-auto border-b border-line bg-panel p-3 md:sticky md:top-0 md:flex md:h-screen md:w-[264px] md:shrink-0 md:inset-x-auto md:border-b-0 md:border-r md:p-6`}
      >
        <div className="mb-7 mt-1 hidden items-center gap-3 px-2 md:flex">
          <div className="grad grid h-10 w-10 place-items-center rounded-xl text-white shadow-md"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <span className="block text-[21px] font-extrabold leading-none tracking-tight">EnvDoctor</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ac">Dev environment</span>
          </div>
        </div>
        <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-mute md:block">{t('menu')}</p>
        {NAV.map(([key, Icon]) => {
          const active = view === key
          const fails = key in failCounts ? failCounts[key as ModuleId] ?? 0 : 0
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`relative flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left text-[14.5px] transition ${
                active ? 'bg-pale font-semibold text-fg' : 'font-medium text-mute hover:bg-bg hover:text-fg'
              }`}
            >
              {active && <span className="absolute -left-6 bottom-1.5 top-1.5 hidden w-[5px] rounded-r-full bg-ac md:block" />}
              <Icon className={`h-5 w-5 ${active ? 'text-ac' : ''}`} />
              {t(key)}
              {fails > 0 && (
                <span className="ml-auto rounded px-1.5 font-mono text-[10px]" style={{ background: `${STATUS_COLOR.fail}22`, color: STATUS_COLOR.fail }}>
                  {fails}
                </span>
              )}
            </button>
          )
        })}
        <div className="wavy mt-auto hidden rounded-2xl p-4 text-xs text-white md:block">
          <div className="mb-1 font-bold">Offline · privacy-first</div>
          <div className="text-white/70">No telemetry · MIT · v0.1.0</div>
        </div>
      </aside>
    </>
  )
}

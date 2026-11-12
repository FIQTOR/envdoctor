import { Play, ShieldCheck } from 'lucide-react'
import { MODULE_ICON } from '../components/icons'
import { Btn, Dot, PageHead, Ring, STATUS_COLOR } from '../components/ui'
import { summarize } from '../diagnostics/score'
import type { TFn } from '../i18n'
import type { ActivityEntry, Check, Status } from '../types'
import { MODULES } from '../types'
import type { ModuleId } from '../types'

interface Props {
  checks: Check[]
  activity: ActivityEntry[]
  scanning: ModuleId | null
  onRun: () => void
  t: TFn
}

function Tile({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="fade rounded-2xl border border-line bg-panel p-4 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-mute">{label}</div>
      <div className="mt-2 font-mono text-3xl font-bold" style={{ color }}>{value}</div>
    </div>
  )
}

export function Dashboard({ checks, activity, scanning, onRun, t }: Props) {
  const s = summarize(checks)
  const statuses: Status[] = ['pass', 'warn', 'fail']
  return (
    <div className="fade">
      <PageHead title={t('dash')} sub="EnvDoctor">
        <Btn icon={Play} primary onClick={onRun} disabled={scanning !== null}>
          {scanning ? `${t('scanning')} ${t(scanning)}…` : t('run')}
        </Btn>
      </PageHead>
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-line bg-panel p-3.5 text-sm text-mute shadow-card">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ac" />
        <span>{t('demo')}</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="grad fade flex flex-col items-center justify-center rounded-2xl p-6 text-white shadow-soft">
          <Ring value={s.score} />
          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/70">{t('score')}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Tile label={t('total')} value={s.total} />
          <Tile label={t('pass')} value={s.pass} color={STATUS_COLOR.pass} />
          <Tile label={t('warn')} value={s.warn} color={STATUS_COLOR.warn} />
          <Tile label={t('fail')} value={s.fail} color={STATUS_COLOR.fail} />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="fade rounded-2xl border border-line bg-panel p-5 shadow-card">
          <h2 className="mb-4 font-bold">{t('bymod')}</h2>
          <div className="space-y-4">
            {MODULES.map((m) => {
              const k = summarize(checks.filter((c) => c.mod === m))
              const Icon = MODULE_ICON[m]
              return (
                <div key={m}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-mute" />{t(m)}</span>
                    <span className="font-mono text-xs text-mute">{k.pass}/{k.total}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-line">
                    {statuses.map((st) => (
                      <div
                        key={st}
                        className={st === 'warn' ? 'striped' : ''}
                        style={{ width: `${k.total ? (k[st] / k.total) * 100 : 0}%`, background: st === 'warn' ? undefined : STATUS_COLOR[st], transition: 'width .5s ease' }}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="wavy fade rounded-2xl p-5 text-white shadow-soft">
          <h2 className="mb-4 font-bold">{t('activity')}</h2>
          {activity.length ? (
            <ul className="space-y-3">
              {activity.slice(0, 8).map((e) => (
                <li key={e.id} className="flex gap-3 text-sm">
                  <span className="mt-1.5"><Dot status={e.status} /></span>
                  <div className="min-w-0">
                    <div>{e.msg}</div>
                    <div className="font-mono text-xs text-white/60">{e.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/60">{t('empty')}</p>
          )}
        </div>
      </div>
    </div>
  )
}

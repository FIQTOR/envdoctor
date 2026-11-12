import { Check as CheckIcon, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Dot, PageHead, STATUS_COLOR } from '../components/ui'
import { summarize } from '../diagnostics/score'
import type { TFn } from '../i18n'
import type { Check, ModuleId, Status } from '../types'

type Filter = 'all' | Status
const FILTERS: Filter[] = ['all', 'pass', 'warn', 'fail']

interface Props {
  mod: ModuleId
  checks: Check[]
  onResolve: (c: Check) => void
  t: TFn
}

export function ListView({ mod, checks, onResolve, t }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const mine = useMemo(() => checks.filter((c) => c.mod === mod), [checks, mod])
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine.filter(
      (c) =>
        (filter === 'all' || c.status === filter) &&
        [c.name, c.value, c.detail, ...c.meta.map((m) => m[1])].join(' ').toLowerCase().includes(q),
    )
  }, [mine, query, filter])
  const s = summarize(mine)

  return (
    <div className="fade">
      <PageHead title={t(mod)} sub={`${s.total} ${t('total').toLowerCase()} · ${s.fail} ${t('fail').toLowerCase()} · ${s.warn} ${t('warn').toLowerCase()}`} />
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 transition focus-within:border-ac">
          <Search className="h-4 w-4 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                filter === f ? 'border-transparent bg-btn text-white' : 'border-line bg-panel text-mute hover:text-fg'
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((c) => (
          <div key={c.id} className="fade rounded-2xl border border-line bg-panel p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5"><Dot status={c.status} /><span className="truncate font-medium">{c.name}</span></div>
              <span className="break-all rounded-md border border-line px-2 py-0.5 text-right font-mono text-sm" style={{ color: STATUS_COLOR[c.status] }}>{c.value}</span>
            </div>
            <p className="mt-2 text-sm text-mute">{c.detail}</p>
            {c.meta.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {c.meta.map(([k, v]) => (
                  <span key={k} className="rounded border border-line bg-bg px-2 py-1 font-mono text-xs"><span className="text-mute">{k}</span> {v}</span>
                ))}
              </div>
            )}
            {c.status !== 'pass' && (
              <div className="mt-3 border-t border-line pt-3">
                <div className="mb-1 text-xs uppercase tracking-wider text-mute">{t('fix')}</div>
                <div className="break-words font-mono text-xs">{c.fix}</div>
                <button onClick={() => onResolve(c)} className="mt-3 inline-flex items-center gap-1.5 text-xs text-ac hover:underline">
                  <CheckIcon className="h-3.5 w-3.5" />{t('resolve')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {rows.length === 0 && <p className="py-10 text-center text-sm text-mute">{t('none')}</p>}
    </div>
  )
}

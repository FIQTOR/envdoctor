import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import { Sidebar } from './components/Sidebar'
import type { View } from './components/Sidebar'
import { Toast } from './components/Toast'
import type { ToastMessage } from './components/Toast'
import { activeProvider } from './diagnostics/providers'
import { summarize } from './diagnostics/score'
import { translate } from './i18n'
import type { TFn } from './i18n'
import { clearSettings, DEFAULT_SETTINGS, loadSettings, saveSettings } from './settings/settings'
import { MODULES } from './types'
import type { ActivityEntry, Check, ModuleId, Settings, Status } from './types'
import { Dashboard } from './views/Dashboard'
import { ListView } from './views/ListView'
import { ReportView } from './views/ReportView'
import { SettingsView } from './views/SettingsView'

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [view, setView] = useState<View>('dash')
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [scanning, setScanning] = useState<ModuleId | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const seq = useRef(0)
  const busy = useRef(false)
  const toastTimer = useRef<number | undefined>(undefined)

  const t: TFn = (key) => translate(settings.lang, key)

  const log = useCallback((msg: string, status: Status = 'pass') => {
    setActivity((a) => [{ id: ++seq.current, msg, status, time: new Date().toLocaleTimeString() }, ...a].slice(0, 30))
  }, [])

  const notify = useCallback((message: string, ok: boolean) => {
    setToast({ message, ok })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const load = useCallback(async () => {
    try {
      setChecks(await activeProvider.collect())
      log(`Loaded ${activeProvider.label}`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Failed to load diagnostics', false)
    } finally {
      setLoading(false)
    }
  }, [log, notify])

  useEffect(() => { void load() }, [load])

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
    document.documentElement.lang = settings.lang
    saveSettings(settings)
  }, [settings])

  const run = async () => {
    if (busy.current) return
    busy.current = true
    const delay = settings.speed === 'fast' ? 150 : 550
    try {
      for (const mod of MODULES) {
        setScanning(mod)
        await sleep(delay)
        const s = summarize(checks.filter((c) => c.mod === mod))
        log(`${mod}: ${s.total} checks · ${s.warn} warnings · ${s.fail} failed`, s.fail ? 'fail' : s.warn ? 'warn' : 'pass')
      }
      log('Simulated diagnostic run complete')
    } finally {
      setScanning(null)
      busy.current = false
    }
  }

  const resolve = (c: Check) => {
    setChecks((all) => all.map((x) => (x.id === c.id ? { ...x, status: 'pass', detail: 'Resolved (simulated)', fix: '' } : x)))
    log(`Resolved ${c.name} (simulated)`)
  }

  const reset = async () => {
    setLoading(true)
    await load()
    notify(t('reset'), true)
  }

  const clear = () => {
    clearSettings()
    setSettings(DEFAULT_SETTINGS)
    notify(t('clear'), true)
  }

  const go = (v: View) => {
    setView(v)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  const failCounts: Partial<Record<ModuleId, number>> = {}
  for (const m of MODULES) failCounts[m] = checks.filter((c) => c.mod === m && c.status === 'fail').length

  let body: ReactElement
  if (loading) body = <p className="text-sm text-mute">{t('loading')}</p>
  else if (view === 'dash') body = <Dashboard checks={checks} activity={activity} scanning={scanning} onRun={run} t={t} />
  else if (view === 'report') body = <ReportView checks={checks} settings={settings} notify={notify} t={t} />
  else if (view === 'set') body = <SettingsView settings={settings} onChange={setSettings} onReset={reset} onClear={clear} t={t} />
  else body = <ListView key={view} mod={view} checks={checks} onResolve={resolve} t={t} />

  return (
    <div className="min-h-screen md:flex">
      <Sidebar view={view} onNavigate={go} open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} score={summarize(checks).score} failCounts={failCounts} t={t} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl p-4 md:p-8">{body}</div>
      </main>
      <Toast toast={toast} />
    </div>
  )
}

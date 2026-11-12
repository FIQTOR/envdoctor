import { Moon, RotateCcw, Sun, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Btn, PageHead } from '../components/ui'
import type { TFn } from '../i18n'
import type { Lang, Settings, Theme } from '../types'

interface Props {
  settings: Settings
  onChange: (s: Settings) => void
  onReset: () => void
  onClear: () => void
  t: TFn
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
      <h2 className="mb-3 font-bold">{title}</h2>
      {children}
    </div>
  )
}

function Segment<T extends string>({ value, options, onPick }: { value: T; options: [T, string, LucideIcon?][]; onPick: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(([v, label, Icon]) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${value === v ? 'border-ac text-ac' : 'border-line text-mute hover:text-fg'}`}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </button>
      ))}
    </div>
  )
}

export function SettingsView({ settings, onChange, onReset, onClear, t }: Props) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => onChange({ ...settings, [key]: value })
  const check = (key: 'includeFixes' | 'includeNotes', label: string) => (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" checked={settings[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-[var(--ac)]" />
      {label}
    </label>
  )
  return (
    <div className="fade">
      <PageHead title={t('set')} />
      <div className="grid max-w-2xl gap-4">
        <Card title={t('theme')}>
          <Segment<Theme> value={settings.theme} onPick={(v) => set('theme', v)} options={[['dark', t('dark'), Moon], ['light', t('light'), Sun]]} />
        </Card>
        <Card title={t('lang')}>
          <Segment<Lang> value={settings.lang} onPick={(v) => set('lang', v)} options={[['en', 'English'], ['id', 'Bahasa Indonesia']]} />
        </Card>
        <Card title={t('prefs')}>
          <div className="space-y-3">
            {check('includeFixes', t('pf'))}
            {check('includeNotes', t('pn'))}
            <div className="pt-2 text-sm text-mute">{t('speed')}</div>
            <Segment<Settings['speed']> value={settings.speed} onPick={(v) => set('speed', v)} options={[['slow', t('slow')], ['fast', t('fast')]]} />
          </div>
        </Card>
        <Card title={t('privacy')}>
          <p className="text-sm leading-relaxed text-mute">{t('ptxt')}</p>
        </Card>
        <div className="flex flex-wrap gap-2">
          <Btn icon={RotateCcw} onClick={onReset}>{t('reset')}</Btn>
          <Btn icon={X} onClick={onClear}>{t('clear')}</Btn>
        </div>
      </div>
    </div>
  )
}

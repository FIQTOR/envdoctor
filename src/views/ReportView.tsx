import { Copy, Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { Btn, PageHead } from '../components/ui'
import { activeProvider } from '../diagnostics/providers'
import { copyText, downloadFile } from '../export/browser'
import { buildReport, toJson, toMarkdown, toSummaryText } from '../export/report'
import type { TFn } from '../i18n'
import type { Check, Report, Settings } from '../types'

interface Props {
  checks: Check[]
  settings: Settings
  notify: (message: string, ok: boolean) => void
  t: TFn
}

export function ReportView({ checks, settings, notify, t }: Props) {
  const [report, setReport] = useState<Report | null>(null)
  const [tab, setTab] = useState<'json' | 'md'>('json')

  const generate = (): Report => {
    const r = buildReport(checks, { includeFixes: settings.includeFixes, includeNotes: settings.includeNotes }, activeProvider.simulated)
    setReport(r)
    return r
  }
  const current = () => report ?? generate()
  const stamp = () => new Date().toISOString().slice(0, 10)

  const copy = async (render: (r: Report) => string) => {
    const ok = await copyText(render(current()))
    notify(ok ? t('copied') : t('cfail'), ok)
  }
  const save = (name: string, render: (r: Report) => string, mime: string) => {
    const ok = downloadFile(name, render(current()), mime)
    notify(ok ? t('saved') : t('dlfail'), ok)
  }

  return (
    <div className="fade">
      <PageHead title={t('report')} sub={report ? toSummaryText(report) : '—'}>
        <Btn icon={FileText} primary onClick={() => { generate(); notify(t('generated'), true) }}>{t('gen')}</Btn>
      </PageHead>
      <div className="mb-4 flex flex-wrap gap-2">
        <Btn icon={Download} onClick={() => save(`envdoctor-report-${stamp()}.json`, toJson, 'application/json')}>{t('dlj')}</Btn>
        <Btn icon={Download} onClick={() => save(`envdoctor-report-${stamp()}.md`, toMarkdown, 'text/markdown')}>{t('dlm')}</Btn>
        <Btn icon={Copy} onClick={() => copy(toSummaryText)}>{t('cps')}</Btn>
        <Btn icon={Copy} onClick={() => copy(toMarkdown)}>{t('cpm')}</Btn>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-card">
        <div className="flex gap-1 border-b border-line p-2">
          {(['json', 'md'] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-md px-3 py-1.5 font-mono text-xs ${tab === k ? 'bg-bg text-ac' : 'text-mute'}`}>
              {k === 'json' ? 'report.json' : 'report.md'}
            </button>
          ))}
          <span className="ml-auto self-center pr-2 text-xs text-mute">{t('preview')}</span>
        </div>
        <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs">
          {report ? (tab === 'json' ? toJson(report) : toMarkdown(report)) : t('pressGen')}
        </pre>
      </div>
    </div>
  )
}

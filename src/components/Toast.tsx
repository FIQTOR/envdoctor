import { Check, TriangleAlert } from 'lucide-react'

export interface ToastMessage { message: string; ok: boolean }

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null
  const Icon = toast.ok ? Check : TriangleAlert
  return (
    <div
      role="status"
      className="fade fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#114B32] px-4 py-3 text-xs font-semibold text-white shadow-lg"
    >
      <Icon className={`h-4 w-4 ${toast.ok ? 'text-emerald-300' : 'text-amber-300'}`} />
      <span>{toast.message}</span>
    </div>
  )
}

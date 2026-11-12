import { Cpu, KeyRound, LayoutDashboard, Lock, Package, Plug, FileText, SlidersHorizontal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ModuleId } from '../types'

export const MODULE_ICON: Record<ModuleId, LucideIcon> = {
  runtime: Cpu, port: Plug, dep: Package, env: KeyRound, perm: Lock,
}
export const DASH_ICON = LayoutDashboard
export const REPORT_ICON = FileText
export const SETTINGS_ICON = SlidersHorizontal

import { BookOpen, Gavel, LayoutGrid, Plus, ShieldAlert } from 'lucide-react'

export const nav = [
  { to: '/', label: 'Board', icon: LayoutGrid },
  { to: '/verify', label: 'Verify', icon: Gavel },
  { to: '/launch', label: 'Launch', icon: Plus },
  { to: '/defaults', label: 'Defaults', icon: ShieldAlert },
  { to: '/rules', label: 'Rules', icon: BookOpen },
]
export const docsUrl = '#'

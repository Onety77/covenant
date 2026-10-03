import { cn } from '@/lib/cn'

interface Props<T extends string> {
  items: { id: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}

/** Segmented tabs that scroll sideways on phones. */
export function Tabs<T extends string>({ items, value, onChange, label, className }: Props<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn('no-scrollbar flex gap-1 overflow-x-auto', className)}>
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            'flex h-9 shrink-0 items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-semibold transition-colors',
            value === it.id ? 'bg-ink text-bg' : 'text-ink-3 hover-device:hover:bg-hover hover-device:hover:text-ink',
          )}
        >
          {it.label}
          {it.count !== undefined && <span className={cn('font-mono text-[11px]', value === it.id ? 'text-bg/60' : 'text-ink-4')}>{it.count}</span>}
        </button>
      ))}
    </div>
  )
}

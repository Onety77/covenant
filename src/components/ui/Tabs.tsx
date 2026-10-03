import { useId } from 'react'
import { m } from 'motion/react'
import { cn } from '@/lib/cn'
import { SPRING_UI } from '@/lib/motion'

interface Props<T extends string> {
  items: { id: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}

/** Segmented tabs that scroll sideways on phones. */
export function Tabs<T extends string>({ items, value, onChange, label, className }: Props<T>) {
  const group = useId()
  return (
    <div role="tablist" aria-label={label} className={cn('no-scrollbar flex gap-1 overflow-x-auto', className)}>
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={cn(
            'relative flex h-9 shrink-0 items-center gap-1.5 rounded-[9px] px-3 text-[13px] font-semibold transition-colors duration-200',
            value === it.id ? 'text-bg' : 'text-ink-3 hover-device:hover:text-ink',
          )}
        >
          {value === it.id && <m.span layoutId={`tab-${group}`} className="absolute inset-0 rounded-[9px] bg-ink" transition={SPRING_UI} />}
          <span className="relative">{it.label}</span>
          {it.count !== undefined && <span className={cn('relative font-mono text-[11px] transition-colors duration-200', value === it.id ? 'text-bg/60' : 'text-ink-4')}>{it.count}</span>}
        </button>
      ))}
    </div>
  )
}

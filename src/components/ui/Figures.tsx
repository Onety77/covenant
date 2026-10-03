import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A row of key figures under a page header. */
export function Figures({ items, className }: { items: { k: string; v: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-5 [&>*:last-child:nth-child(odd)]:col-span-2 sm:[&>*:last-child:nth-child(odd)]:col-span-1', className)}>
      {items.map((it) => (
        <div key={it.k} className="bg-surface px-4 py-3.5">
          <dt className="label">{it.k}</dt>
          <dd className="mt-1 font-mono text-[15px] font-medium tabular">{it.v}</dd>
        </div>
      ))}
    </dl>
  )
}

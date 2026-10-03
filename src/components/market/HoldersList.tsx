import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { holders } from '@/lib/market'

/** Top holders by share of supply. The covenant escrow and the pool are labelled. */
export function HoldersList({ project }: { project: Project }) {
  const list = holders(project)
  const max = Math.max(...list.map((h) => h.pct))
  return (
    <ol className="grid gap-2.5">
      {list.map((h, i) => (
        <li key={h.wallet} className="grid grid-cols-[20px_1fr_64px] items-center gap-3 text-[13px]">
          <span className="font-mono text-[11px] text-ink-3">{i + 1}</span>
          <div className="min-w-0">
            <p className="flex items-baseline gap-2">
              <span className={cn('truncate', h.label ? 'font-semibold' : 'font-mono text-ink-2')}>{h.wallet}</span>
              {h.label && <span className="font-mono text-[10px] text-ink-3 uppercase">{h.label}</span>}
            </p>
            <div className="mt-1.5 h-1 rounded-full bg-raised">
              <div className={cn('h-full rounded-full', h.label === 'locked' ? 'held bg-raised' : h.label ? 'bg-ink-3' : 'bg-ink-4')} style={{ width: `${(h.pct / max) * 100}%` }} />
            </div>
          </div>
          <span className="text-right font-mono tabular">{(h.pct * 100).toFixed(2)}%</span>
        </li>
      ))}
    </ol>
  )
}

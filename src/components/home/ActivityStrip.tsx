import { Link } from 'react-router-dom'
import type { Activity, ActivityKind } from '@/types'
import { cn } from '@/lib/cn'
import { ago } from '@/lib/format'

const tone: Record<ActivityKind, string> = {
  launch: 'bg-blue',
  graduated: 'bg-blue',
  proof: 'bg-review',
  proven: 'bg-proven',
  rejected: 'bg-default',
  default: 'bg-default',
  redeem: 'bg-default',
  takeover: 'bg-ink',
}

/** The protocol's latest events in one scrollable row. Every item opens its project. */
export function ActivityStrip({ items, now }: { items: Activity[]; now: number }) {
  return (
    <div className="border-y border-line bg-surface">
      <ul className="wrap flex snap-x gap-8 overflow-x-auto py-3.5 [scrollbar-width:none]" aria-label="Latest activity">
        {items.map((a) => (
          <li key={a.id} className="shrink-0 snap-start">
            <Link to={`/p/${a.projectId}`} className="flex items-center gap-2.5 text-[13px] whitespace-nowrap text-ink-2 hover-device:hover:text-ink">
              <span aria-hidden className={cn('size-1.5 rounded-full', tone[a.kind])} />
              {a.text}
              <span className="font-mono text-[11px] text-ink-4">{ago(a.at, now)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

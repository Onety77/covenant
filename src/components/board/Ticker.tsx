import { Link } from 'react-router-dom'
import type { Activity, ActivityKind } from '@/types'
import { cn } from '@/lib/cn'
import { ago } from '@/lib/format'
import { getProject } from '@/data/projects'
import { TokenArt } from '@/components/ui/TokenArt'

const tone: Record<ActivityKind, string> = {
  launch: 'text-accent',
  graduated: 'text-accent',
  proof: 'text-review',
  proven: 'text-proven',
  rejected: 'text-default',
  default: 'text-default',
  redeem: 'text-default',
  takeover: 'text-ink',
}
const verb: Record<ActivityKind, string> = {
  launch: 'launched',
  graduated: 'graduated',
  proof: 'sent proof',
  proven: 'proven',
  rejected: 'rejected',
  default: 'defaulted',
  redeem: 'redeemed',
  takeover: 'takeover bid',
}

/** The protocol's latest events in one row under the header. Every item opens its token. */
export function Ticker({ items, now }: { items: Activity[]; now: number }) {
  return (
    <div className="border-b border-line">
      <ul className="wrap no-scrollbar flex gap-2 overflow-x-auto py-2" aria-label="Latest activity">
        {items.map((a) => {
          const p = getProject(a.projectId)
          return (
            <li key={a.id} className="shrink-0">
              <Link to={`/p/${a.projectId}`} title={a.text} className="flex h-8 items-center gap-2 rounded-[8px] bg-surface pr-3 pl-1 text-[12px] whitespace-nowrap hover-device:hover:bg-raised">
                {p && <TokenArt seed={p.ticker} size={24} />}
                <span className="font-semibold">{p?.ticker}</span>
                <span className={cn('font-mono text-[11px] uppercase', tone[a.kind])}>{verb[a.kind]}</span>
                <span className="font-mono text-[11px] text-ink-4">{ago(a.at, now).replace(' ago', '')}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

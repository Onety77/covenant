import { Link } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'
import type { Activity, ActivityKind } from '@/types'
import { ago } from '@/lib/format'
import { getProject } from '@/data/projects'
import { TokenArt } from '@/components/ui/TokenArt'

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

/**
 * The protocol's latest events, drifting slowly left. It pauses while pointed at or focused,
 * and becomes a still, scrollable row under reduced motion. Every item opens its token.
 */
export function Ticker({ items, now }: { items: Activity[]; now: number }) {
  const still = useReducedMotion()
  const row = (copy: number) =>
    items.map((a) => {
      const p = getProject(a.projectId)
      return (
        <li key={`${copy}-${a.id}`} className="shrink-0 pr-1" aria-hidden={copy > 0 || undefined}>
          <Link
            to={`/p/${a.projectId}`}
            title={a.text}
            tabIndex={copy > 0 ? -1 : undefined}
            className="flex h-8 items-center gap-2 rounded-[8px] pr-3 pl-1 text-[12px] whitespace-nowrap hover-device:hover:bg-hover"
          >
            {p && <TokenArt seed={p.ticker} size={24} />}
            <span className="font-semibold">{p?.ticker}</span>
            <span className="text-ink-3">{verb[a.kind]}</span>
            <span className="font-mono text-[11px] text-ink-3">{ago(a.at, now).replace(' ago', '')}</span>
          </Link>
        </li>
      )
    })

  return (
    <div className="marquee-wrap relative overflow-hidden border-y border-line" aria-label="Latest activity" role="region">
      {still ? (
        <ul className="wrap no-scrollbar flex gap-1 overflow-x-auto py-2">{row(0)}</ul>
      ) : (
        <>
          <ul className="marquee flex w-max py-2">
            {row(0)}
            {row(1)}
          </ul>
          {/* soft edges so items glide in and out */}
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent" />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent" />
        </>
      )}
    </div>
  )
}

import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { ago, change, left, usd } from '@/lib/format'
import { current, due, statusLabel, tally } from '@/lib/covenant'
import { TokenArt } from '@/components/ui/TokenArt'
import { Meter } from '@/components/covenant/Meter'

/** One launch on the board: logo first, then the market, then where its covenant stands. */
export function TokenItem({ project: p, now }: { project: Project; now: number }) {
  const c = p.covenant
  const m = current(c)
  const up = p.market.change24h >= 0
  const curve = p.market.stage === 'curve' ? p.market.curveSol / p.market.curveTargetSol : null

  // one coloured mark carries the state; the words stay neutral
  const [mark, label] =
    c.state === 'fulfilled'
      ? ['bg-proven', 'Fulfilled · bond returned']
      : c.state === 'defaulted'
        ? ['bg-default', 'Defaulted · redemption open']
        : m?.status === 'review'
          ? ['bg-accent', `M${m.n} in review · ${tally(m.panel).approve}/${tally(m.panel).needed} approve`]
          : m
            ? ['bg-ink-3', `M${m.n} ${statusLabel[m.status].toLowerCase()} · due ${left(due(c, m), now)}`]
            : ['bg-ink-3', '']

  return (
    <Link to={`/p/${p.id}`} className="group flex gap-3.5 rounded-[14px] p-3 transition-colors hover-device:hover:bg-hover sm:p-3.5">
      <TokenArt seed={p.ticker} src={p.image} size={64} className="max-sm:size-14!" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="min-w-0 truncate">
            <span className="text-[15px] font-semibold">{p.name}</span> <span className="font-mono text-[12px] text-ink-3">${p.ticker}</span>
          </p>
          <p className="shrink-0 font-mono text-[13px] font-medium tabular">{curve !== null ? `${Math.round(curve * 100)}%` : usd(p.market.mcapUsd)}</p>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-3 text-[12px] text-ink-3">
          <p className="min-w-0 truncate">
            {c.builder.handle} · {ago(p.launchedAt, now).replace(' ago', '')}
          </p>
          <p className={cn('shrink-0 font-mono tabular', curve !== null ? 'text-ink-3' : up ? 'text-proven' : 'text-default')}>{curve !== null ? 'bonding' : change(p.market.change24h)}</p>
        </div>
        <Meter covenant={c} now={now} className="mt-3" />
        <p className="mt-2 flex items-center gap-2 text-[12px] text-ink-2">
          <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', mark)} />
          <span className="truncate">{label}</span>
        </p>
      </div>
    </Link>
  )
}

export function TokenItemSkeleton() {
  return (
    <div className="flex gap-3.5 p-3.5">
      <div className="skeleton size-16 rounded-[14px]" />
      <div className="flex-1">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton mt-2 h-3 w-24" />
        <div className="skeleton mt-4 h-1 w-full" />
      </div>
    </div>
  )
}

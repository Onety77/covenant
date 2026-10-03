import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { change, left, usd } from '@/lib/format'
import { covenantLabel, covenantTone, current, due, provenCount, statusLabel, statusTone } from '@/lib/covenant'
import { Tag } from '@/components/ui/Tag'
import { TokenMark } from '@/components/ui/TokenMark'
import { MiniRail } from './MiniRail'

/** A launch in a list: identity, market, the term, and what's next. The whole row opens the project. */
export function LaunchRow({ project: p, now }: { project: Project; now: number }) {
  const c = p.covenant
  const m = current(c)
  const next =
    c.state === 'fulfilled' ? (
      <Tag tone="proven">Fulfilled</Tag>
    ) : c.state === 'defaulted' ? (
      <Tag tone="default">Defaulted</Tag>
    ) : m ? (
      <span className="flex min-w-0 items-center gap-2">
        <Tag tone={statusTone[m.status]}>{m.status === 'locked' ? `M${m.n}` : `M${m.n} ${statusLabel[m.status].toLowerCase()}`}</Tag>
        {m.status !== 'review' && <span className="font-mono text-[12px] text-ink-3 tabular">{left(due(c, m), now)}</span>}
      </span>
    ) : (
      <Tag tone={covenantTone[c.state]}>{covenantLabel[c.state]}</Tag>
    )
  return (
    <Link
      to={`/p/${p.id}`}
      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 hover-device:hover:bg-hover sm:px-5 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.3fr)_90px_80px] md:gap-x-6"
    >
      <div className="flex min-w-0 items-center gap-3">
        <TokenMark ticker={p.ticker} src={p.image} size={36} />
        <div className="min-w-0">
          <p className="flex items-baseline gap-2">
            <span className="truncate text-[15px] font-semibold">{p.name}</span>
            <span className="font-mono text-[11px] text-ink-3">${p.ticker}</span>
          </p>
          <p className="truncate text-[13px] text-ink-3">{p.tagline}</p>
        </div>
      </div>
      <div className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:row-start-auto">
        <div className="flex items-center justify-between font-mono text-[11px] text-ink-3">
          <span>{provenCount(c)} of 3 proven</span>
          <span className="md:hidden">{p.market.stage === 'curve' ? `${Math.round((p.market.curveSol / p.market.curveTargetSol) * 100)}% to graduation` : usd(p.market.mcapUsd)}</span>
        </div>
        <MiniRail covenant={c} now={now} className="mt-2" />
      </div>
      <div className="col-start-2 row-start-1 flex justify-end md:col-start-auto md:row-start-auto md:justify-start">{next}</div>
      <p className="hidden text-right font-mono text-[13px] tabular md:block">{p.market.stage === 'curve' ? <span className="text-ink-3">On curve</span> : usd(p.market.mcapUsd)}</p>
      <p className={`hidden text-right font-mono text-[13px] tabular md:block ${p.market.change24h >= 0 ? 'text-proven' : 'text-default'}`}>{change(p.market.change24h)}</p>
    </Link>
  )
}

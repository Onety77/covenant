import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { change, left, price, usd } from '@/lib/format'
import { covenantLabel, covenantTone, current, due, tally } from '@/lib/covenant'
import { Tag } from '@/components/ui/Tag'
import { TokenMark } from '@/components/ui/TokenMark'
import { TermRail } from './TermRail'

/** One project's covenant at a glance: who, the market, the term, and what happens next. */
export function CovenantCard({ project: p, now, className }: { project: Project; now: number; className?: string }) {
  const c = p.covenant
  const m = current(c)
  const t = tally(m?.panel)
  return (
    <article className={cn('rounded-card border border-line bg-surface', className)}>
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <TokenMark ticker={p.ticker} src={p.image} size={40} />
          <div className="min-w-0">
            <p className="flex items-center gap-2">
              <Link to={`/p/${p.id}`} className="truncate text-[17px] font-semibold tracking-[-0.01em] hover-device:hover:underline">
                {p.name}
              </Link>
              <span className="font-mono text-[12px] text-ink-3">${p.ticker}</span>
            </p>
            <p className="truncate text-[13px] text-ink-3">
              by <span className="text-ink-2">{c.builder.handle}</span> · {p.tagline}
            </p>
          </div>
        </div>
        <dl className="flex items-center gap-6 max-sm:w-full max-sm:justify-between">
          <div>
            <dt className="label">Price</dt>
            <dd className="font-mono text-[13px] font-medium tabular">
              {price(p.market.priceUsd)} <span className={p.market.change24h >= 0 ? 'text-proven' : 'text-default'}>{change(p.market.change24h)}</span>
            </dd>
          </div>
          <div>
            <dt className="label">Mkt cap</dt>
            <dd className="font-mono text-[13px] font-medium tabular">{usd(p.market.mcapUsd)}</dd>
          </div>
          <Tag tone={covenantTone[c.state]}>{covenantLabel[c.state]}</Tag>
        </dl>
      </header>

      <div className="px-5 pt-6 pb-5 sm:px-6">
        <TermRail covenant={c} now={now} />
      </div>

      {m && c.state === 'active' && (
        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-5 py-3.5 text-[13px] sm:px-6">
          <p className="min-w-0 flex-1 text-ink-2">
            <span className="font-semibold text-ink">M{m.n} · {m.title}</span>{' '}
            {m.status === 'review' ? (
              <>
                is in review: <span className="text-ink">{t.approve} of {t.needed}</span> approvals, closes in <span className="font-mono text-ink tabular">{left(m.reviewClosesAt!, now)}</span>
              </>
            ) : (
              <>
                is due in <span className="font-mono text-ink tabular">{left(due(c, m), now)}</span>
              </>
            )}
          </p>
          <Link to={`/p/${p.id}`} className="inline-flex items-center gap-1 font-semibold text-blue-text hover-device:hover:underline">
            Open covenant <ArrowRight className="size-3.5" />
          </Link>
        </footer>
      )}
    </article>
  )
}

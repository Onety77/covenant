import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { change, left, price, sol } from '@/lib/format'
import { current, dayOf, heldPct, tally } from '@/lib/covenant'
import { reviewId } from '@/lib/reviews'
import { TERM_DAYS } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { TokenArt } from '@/components/ui/TokenArt'
import { TermRail } from '@/components/covenant/TermRail'
import { Ticking } from '@/components/motion/Ticking'
import { useLive } from '@/lib/liveMarket'
import { VoteDots } from '@/components/covenant/VoteDots'

/**
 * The product, shown as the hero: one live covenant with its term, what's held against it,
 * and the verdict in progress.
 */
export function LiveCovenant({ project: p, now, drawDelay = 0, className }: { project: Project; now: number; drawDelay?: number; className?: string }) {
  const c = p.covenant
  const live = useLive(p.id)
  const m = current(c)!
  const t = tally(m.panel)
  return (
    <div className={cn('relative', className)}>
      {/* a soft brand glow behind the panel; the panel itself carries no border */}
      <div aria-hidden className="pointer-events-none absolute -inset-y-10 inset-x-0 -z-10 sm:-inset-x-10 bg-[radial-gradient(60%_55%_at_60%_40%,var(--accent-soft),transparent_70%)]" />
      <article className="overflow-hidden rounded-[18px] bg-surface shadow-[0_0_0_1px_var(--line),0_30px_80px_-30px_rgb(0_0_0/0.8)] [--rail-bg:var(--surface)]">
        <header className="flex items-center gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <TokenArt seed={p.ticker} src={p.image} size={40} />
          <div className="min-w-0 flex-1">
            <Link to={`/p/${p.id}`} className="block truncate text-[16px] font-semibold hover-device:hover:underline">
              {p.name} <span className="font-mono text-[12px] font-normal text-ink-3">${p.ticker}</span>
            </Link>
            <p className="truncate text-[12px] text-ink-3">
              by {c.builder.handle} · day {Math.floor(dayOf(c, now))} of {TERM_DAYS}
            </p>
          </div>
          <div className="text-right">
            <Ticking className="font-mono text-[15px] font-medium" value={live.price} text={price(live.price)} />
            <p className={cn('font-mono text-[12px] tabular', live.change24h >= 0 ? 'text-proven' : 'text-default')}>{change(live.change24h)}</p>
          </div>
        </header>

        <div className="px-5 pt-6 pb-5 sm:px-6">
          <TermRail covenant={c} now={now} stacked draw delay={drawDelay} />
        </div>

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line bg-[color-mix(in_srgb,var(--surface)_60%,var(--bg))] px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-[13px]">
              <span aria-hidden className="ping relative size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="truncate">
                <span className="font-medium">M{m.n} · {m.title}</span> <span className="text-ink-3">in review</span>
              </span>
            </p>
            <div className="mt-1.5 flex items-center gap-2.5">
              <VoteDots panel={m.panel} size={9} />
              <span className="font-mono text-[11px] text-ink-3">
                {t.approve}/{t.needed} approve · closes {left(m.reviewClosesAt!, now)}
              </span>
            </div>
          </div>
          <Button size="sm" to={`/verify/${reviewId(p, m)}`}>
            See the proof
          </Button>
        </footer>
      </article>
      <p className="mt-3 px-1 text-[12px] text-ink-3">
        {heldPct(c)}% of supply, {sol(c.feesSol - c.feesReleasedSol, 0)} in fees and a {sol(c.bondSol, 0)} bond held against this roadmap.
      </p>
    </div>
  )
}

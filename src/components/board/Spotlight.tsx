import { Link } from 'react-router-dom'
import type { Project } from '@/types'
import { change, count, left, usd } from '@/lib/format'
import { current, tally } from '@/lib/covenant'
import { reviewId } from '@/lib/reviews'
import { Button } from '@/components/ui/Button'
import { TokenArt } from '@/components/ui/TokenArt'
import { TermRail } from '@/components/covenant/TermRail'
import { VoteDots } from '@/components/covenant/VoteDots'
import { Meter } from '@/components/covenant/Meter'

/** The launch everyone is watching: proof under review, verdict close. */
export function Spotlight({ project: p, now }: { project: Project; now: number }) {
  const m = current(p.covenant)!
  const t = tally(m.panel)
  return (
    <section aria-labelledby="spotlight" className="bg-surface [--rail-bg:var(--surface)]">
      <div className="wrap grid gap-8 py-6 lg:grid-cols-12 lg:gap-10 lg:py-9 [&>*]:min-w-0">
        <div className="lg:col-span-4">
          <p className="flex items-center gap-2 font-mono text-[11px] text-review uppercase">
            <span className="size-1.5 rounded-full bg-review" /> Proof under review
          </p>
          <div className="mt-4 flex items-center gap-4">
            <TokenArt seed={p.ticker} src={p.image} size={72} className="max-sm:size-14!" />
            <div className="min-w-0">
              <h2 id="spotlight" className="truncate text-h2">
                <Link to={`/p/${p.id}`} className="hover-device:hover:underline">
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 font-mono text-[13px] text-ink-2">
                ${p.ticker} · MC {usd(p.market.mcapUsd)} <span className={p.market.change24h >= 0 ? 'text-proven' : 'text-default'}>{change(p.market.change24h)}</span>
              </p>
            </div>
          </div>
          <Meter covenant={p.covenant} now={now} className="mt-5 lg:hidden" />
          <p className="mt-5 text-[14px] leading-relaxed text-ink-2">
            {p.covenant.builder.handle} says <span className="text-ink">“{m.title}”</span> is done. If verifiers agree, 5% of supply and the fees so far unlock. {count(p.market.holders)} holders are
            waiting on it.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <VoteDots panel={m.panel} size={12} />
            <p className="font-mono text-[12px] text-ink-2">
              {t.approve}/{t.needed} approve · closes {left(m.reviewClosesAt!, now)}
            </p>
          </div>
          <div className="mt-6 flex gap-2">
            <Button variant="primary" to={`/p/${p.id}`} className="max-sm:flex-1">
              Trade ${p.ticker}
            </Button>
            <Button to={`/verify/${reviewId(p, m)}`} className="max-sm:flex-1">
              See the proof
            </Button>
          </div>
        </div>
        <div className="max-lg:hidden lg:col-span-8 lg:pt-8">
          <TermRail covenant={p.covenant} now={now} />
        </div>
      </div>
    </section>
  )
}

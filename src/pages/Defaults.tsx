import { Link } from 'react-router-dom'
import { projects } from '@/data/projects'
import { count, date, left, pct, sol } from '@/lib/format'
import { useDemoState } from '@/lib/hooks'
import { useNow } from '@/lib/live'
import { redeemRate } from '@/lib/redeem'
import { DEFAULT_WINDOW_DAYS, ESCROW_PCT, SUPPLY } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import { TokenArt } from '@/components/ui/TokenArt'
import { Meter } from '@/components/covenant/Meter'
import { Ticking } from '@/components/motion/Ticking'

/** Covenants that broke: open redemption windows first, then how earlier defaults resolved. */
export function Defaults() {
  const now = useNow()
  const state = useDemoState()
  const open = state === 'empty' ? [] : projects.filter((p) => p.covenant.state === 'defaulted')
  const past = projects.flatMap((p) => (p.previous ?? []).filter((c) => c.default).map((c) => ({ project: p, covenant: c })))

  return (
    <div className="pb-24 lg:pb-16">
      <div className="wrap pt-8 lg:pt-12">
        <h1 className="text-h1">Defaults</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
          A missed deadline or rejected proof defaults a covenant on its own. For {DEFAULT_WINDOW_DAYS} days, holders can burn tokens for a share of what the builder put up, and other builders can bid to take
          the roadmap over.
        </p>
      </div>

      <section aria-label="Open redemptions" className="mt-10">
        {state === 'loading' ? (
          <div className="wrap">
            <div className="skeleton h-48 rounded-[16px]" />
          </div>
        ) : open.length ? (
          open.map((p) => {
            const c = p.covenant
            const d = c.default!
            return (
              <article key={p.id} className="bg-surface">
                <div className="wrap grid gap-8 py-8 lg:grid-cols-12 lg:items-center [&>*]:min-w-0">
                  <div className="lg:col-span-7">
                    <p className="flex items-center gap-2 text-[13px] text-ink-2"><span aria-hidden className="size-1.5 rounded-full bg-default" />Redemption open</p>
                    <div className="mt-4 flex items-center gap-3.5">
                      <TokenArt seed={p.ticker} size={56} />
                      <div className="min-w-0">
                        <h2 className="truncate text-h2">{p.name}</h2>
                        <p className="mt-0.5 text-[13px] text-ink-2">
                          {c.builder.handle} missed M{d.milestone}, “{c.milestones[d.milestone - 1].title}” · {date(d.at)}
                        </p>
                      </div>
                    </div>
                    <Meter covenant={c} now={now} className="mt-6 max-w-md" />
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                      {[
                        ['Pool', sol(d.poolSol)],
                        ['Redeem 1M', sol(redeemRate(c) * 1e6, 3)],
                        ['Redeemed', pct(d.redeemedPct)],
                        ['Takeover bids', String(d.takeovers.length)],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="label">{k}</dt>
                          <dd className="mt-1 font-mono text-[16px] font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div className="lg:col-span-5">
                    <p className="label">Window closes in</p>
                    <Ticking className="mt-1 font-mono text-[40px] leading-none font-medium tracking-[-0.04em]" value={-now} text={left(d.redemptionClosesAt, now)} flash={false} />
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                      {count(Math.round((SUPPLY * (1 - ESCROW_PCT / 100) * (1 - d.redeemedPct)) / 1e6))}M ${p.ticker} not yet redeemed. Every token pays the same rate, whenever it’s burned.
                    </p>
                    <div className="mt-5 flex gap-2">
                      <Button variant="danger" to={`/p/${p.id}#redeem`} className="max-sm:flex-1">
                        Redeem
                      </Button>
                      <Button to={`/p/${p.id}`} className="max-sm:flex-1">
                        Takeover bids
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        ) : (
          <div className="wrap">
            <Notice title="No covenant is in default." body="Every live builder is inside their deadlines. If one misses, redemption opens here on its own." />
          </div>
        )}
      </section>

      <section aria-labelledby="how-title" className="wrap mt-14">
        <h2 id="how-title" className="text-h2">
          How a default resolves
        </h2>
        <ol className="mt-7 grid gap-8 md:grid-cols-3">
          {[
            ['The pool', 'What’s left of the 10 SOL bond, plus every pledged fee not yet released. Locked liquidity is never part of it; it stays in the pool for traders.'],
            ['Redemption', 'Burn any amount for a pro-rata share of the pool. The rate is the pool over every token outside escrow, so it doesn’t change as others redeem.'],
            ['Takeover', 'Builders post a new bond and new deadlines for what’s still owed. One takes over and inherits the unreleased escrow; the other bonds go back.'],
          ].map(([t, b], i) => (
            <li key={t}>
              <span className="grid size-6 place-items-center rounded-[6px] bg-raised font-mono text-[11px] text-ink-2">{i + 1}</span>
              <p className="mt-4 font-display text-[17px] font-semibold tracking-[-0.03em]">{t}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{b}</p>
            </li>
          ))}
        </ol>
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-title" className="wrap mt-14">
          <h2 id="past-title" className="text-h2">
            Resolved
          </h2>
          <ul className="-mx-3 mt-5">
            {past.map(({ project: p, covenant: c }) => (
              <li key={p.id + c.startedAt}>
                <Link to={`/p/${p.id}`} className="grid items-center gap-x-6 gap-y-3 rounded-[12px] p-3 hover-device:hover:bg-hover md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto]">
                  <div className="flex min-w-0 items-center gap-3">
                    <TokenArt seed={p.ticker} size={40} />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold">{p.name}</p>
                      <p className="truncate text-[13px] text-ink-3">
                        {c.builder.handle} → {c.default!.successor?.handle} · {pct(c.default!.redeemedPct, 0)} redeemed
                      </p>
                    </div>
                  </div>
                  <Meter covenant={c} now={now} />
                  <span className="font-mono text-[11px] text-ink-3 uppercase">Handed over</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

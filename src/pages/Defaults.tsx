import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { count, date, left, pct, sol } from '@/lib/format'
import { useNow } from '@/lib/live'
import { redeemRate } from '@/lib/redeem'
import { DEFAULT_WINDOW_DAYS, ESCROW_PCT, SUPPLY } from '@/lib/rules'
import { MiniRail } from '@/components/covenant/MiniRail'
import { Notice } from '@/components/ui/Notice'
import { Tag } from '@/components/ui/Tag'
import { TokenMark } from '@/components/ui/TokenMark'
import { useDemoState } from '@/lib/hooks'

/** Covenants that broke: open redemption windows first, then how earlier defaults resolved. */
export function Defaults() {
  const now = useNow()
  const state = useDemoState()
  const open = state === 'empty' ? [] : projects.filter((p) => p.covenant.state === 'defaulted')
  const past = projects.flatMap((p) => (p.previous ?? []).filter((c) => c.default).map((c) => ({ project: p, covenant: c })))

  return (
    <div className="wrap pt-10 pb-20 lg:pt-14">
      <div className="max-w-3xl">
        <p className="label">Defaults</p>
        <h1 className="mt-3 text-h1">When a promise breaks, holders are paid first.</h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
          A missed deadline or rejected proof defaults the covenant on its own. For the next {DEFAULT_WINDOW_DAYS} days holders can burn tokens for a share of what the builder put up, and other
          builders can offer to take the roadmap over.
        </p>
      </div>

      <section aria-labelledby="open-title" className="mt-12">
        <h2 id="open-title" className="flex items-baseline gap-2 font-sans text-[15px] font-semibold">
          Redemption open <span className="font-mono text-[12px] font-normal text-ink-3">{open.length}</span>
        </h2>
        <div className="mt-3 grid gap-4">
          {state === 'loading' ? (
            <div className="skeleton h-56 rounded-card" />
          ) : open.length ? (
            open.map((p) => {
              const c = p.covenant
              const d = c.default!
              return (
                <article key={p.id} className="grid overflow-hidden rounded-card border border-default/40 bg-surface lg:grid-cols-12">
                  <div className="p-5 sm:p-6 lg:col-span-7">
                    <div className="flex items-center gap-3">
                      <TokenMark ticker={p.ticker} size={44} />
                      <div className="min-w-0">
                        <p className="text-[17px] font-semibold">
                          {p.name} <span className="font-mono text-[12px] font-normal text-ink-3">${p.ticker}</span>
                        </p>
                        <p className="text-[13px] text-ink-2">
                          {c.builder.handle} missed M{d.milestone}, “{c.milestones[d.milestone - 1].title}” · {date(d.at)}
                        </p>
                      </div>
                    </div>
                    <MiniRail covenant={c} now={now} className="mt-6" />
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        ['Pool', sol(d.poolSol)],
                        ['Redeem 1M', sol(redeemRate(c) * 1e6, 3)],
                        ['Redeemed', pct(d.redeemedPct)],
                        ['Offers', String(d.takeovers.length)],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <p className="label">{k}</p>
                          <p className="mt-0.5 font-mono text-[15px] font-medium">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-6 border-t border-default/30 bg-default-soft p-5 sm:p-6 lg:col-span-5 lg:border-t-0 lg:border-l">
                    <div>
                      <p className="label text-default">Window closes in</p>
                      <p className="mt-1 font-display text-[44px] leading-none">{left(d.redemptionClosesAt, now)}</p>
                      <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                        {count(Math.round(SUPPLY * (1 - ESCROW_PCT / 100) * (1 - d.redeemedPct) / 1e6))}M ${p.ticker} still unredeemed. Burning pays the same rate whenever you do it.
                      </p>
                    </div>
                    <Link to={`/p/${p.id}#redeem`} className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-default px-4 text-[14px] font-semibold text-on-default hover-device:hover:brightness-110">
                      Redeem or see offers <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </article>
              )
            })
          ) : (
            <Notice title="No covenant is in default." body="Every active builder is inside their deadlines. If one misses, the redemption window opens here automatically." />
          )}
        </div>
      </section>

      <section aria-labelledby="how-title" className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
        <h2 id="how-title" className="sr-only">
          How a default resolves
        </h2>
        {[
          ['01', 'The pool', 'What’s left of the 10 SOL bond, plus every pledged fee not yet released. Locked liquidity is never part of it, and stays in the pool for traders.'],
          ['02', 'Redemption', `Burn any amount of the token for a pro-rata share of the pool. The rate is the pool over all tokens outside escrow, so it doesn’t change as others redeem.`],
          ['03', 'Takeover', 'Builders post a new bond and new deadlines for what’s still owed. One takes the roadmap and inherits the unreleased escrow; the others’ bonds go back.'],
        ].map(([n, t, b]) => (
          <div key={n} className="bg-surface p-6">
            <p className="font-mono text-[11px] text-ink-3">{n}</p>
            <p className="mt-3 font-display text-[28px] leading-tight">{t}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{b}</p>
          </div>
        ))}
      </section>

      {past.length > 0 && (
        <section aria-labelledby="past-title" className="mt-16">
          <h2 id="past-title" className="flex items-baseline gap-2 font-sans text-[15px] font-semibold">
            Resolved <span className="font-mono text-[12px] font-normal text-ink-3">{past.length}</span>
          </h2>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
            {past.map(({ project: p, covenant: c }) => (
              <li key={p.id + c.startedAt}>
                <Link to={`/p/${p.id}#history`} className="grid items-center gap-4 px-5 py-4 hover-device:hover:bg-hover md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_auto]">
                  <div className="flex min-w-0 items-center gap-3">
                    <TokenMark ticker={p.ticker} size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold">{p.name}</p>
                      <p className="truncate text-[13px] text-ink-2">
                        {c.builder.handle} → {c.default!.successor?.handle} · {pct(c.default!.redeemedPct, 0)} redeemed
                      </p>
                    </div>
                  </div>
                  <MiniRail covenant={c} now={now} />
                  <Tag tone="neutral">Handed over</Tag>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

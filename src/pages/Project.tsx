import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import { getProject } from '@/data/projects'
import { change, count, date, price, sol, usd } from '@/lib/format'
import { covenantLabel, covenantTone, dayOf, provenCount } from '@/lib/covenant'
import { useNow, sampleNowMs } from '@/lib/live'
import { redeemRate } from '@/lib/redeem'
import { reviewId } from '@/lib/reviews'
import { BOND_SOL } from '@/lib/rules'
import { postTakeover, redeem } from '@/lib/session'
import { Button } from '@/components/ui/Button'
import { Figures } from '@/components/ui/Figures'
import { Notice } from '@/components/ui/Notice'
import { Tag } from '@/components/ui/Tag'
import { TokenMark } from '@/components/ui/TokenMark'
import { MilestoneCard } from '@/components/covenant/MilestoneCard'
import { MiniRail } from '@/components/covenant/MiniRail'
import { TermRail } from '@/components/covenant/TermRail'
import { PriceChart } from '@/components/market/PriceChart'
import { Backing } from '@/components/project/Backing'
import { CurveProgress } from '@/components/project/CurveProgress'
import { RedeemPanel } from '@/components/project/RedeemPanel'
import { Takeovers } from '@/components/project/Takeovers'
import { TradePanel } from '@/components/project/TradePanel'

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/**
 * One launch: its covenant drawn over the 90-day term, each milestone with proof and verdicts,
 * the market, and the one action that matters (trade, or redeem after a default).
 */
export function ProjectPage() {
  const { id = '' } = useParams()
  const now = useNow()
  const p = getProject(id)

  if (!p) {
    return (
      <div className="wrap py-16">
        <Notice title="There’s no launch here." body="The link may be wrong, or the launch never happened.">
          <Link to="/launches" className="mt-4 text-sm font-semibold text-blue-text underline-offset-4 hover:underline">
            See all launches
          </Link>
        </Notice>
      </div>
    )
  }

  const c = p.covenant
  const defaulted = c.state === 'defaulted'
  const day = Math.floor(dayOf(c, now))
  const m = p.market

  return (
    <>
      <div className="border-b border-line">
        <div className="wrap pt-6 pb-8 lg:pt-8">
          <Link to="/launches" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-3 hover-device:hover:text-ink">
            <ChevronLeft className="size-4" /> Launches
          </Link>
          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-5">
            <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3">
              <TokenMark ticker={p.ticker} src={p.image} size={64} className="max-sm:size-12! max-sm:rounded-[12px]!" />
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-h1">{p.name}</h1>
                <span className="font-mono text-[14px] text-ink-3">${p.ticker}</span>
              </div>
              <p className="col-span-2 text-[15px] text-ink-2 sm:col-span-1 sm:col-start-2 sm:-mt-2">
                {p.tagline} · by <span className="font-medium text-ink">{c.builder.handle}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Tag tone={covenantTone[c.state]}>
                {covenantLabel[c.state]}
                {c.state === 'active' && ` · day ${day}`}
              </Tag>
              {p.site && (
                <a href={p.site} className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-2 hover-device:hover:text-ink">
                  Website <ArrowUpRight className="size-3.5" />
                </a>
              )}
            </div>
          </div>
          <Figures
            className="mt-7"
            items={[
              { k: 'Price', v: <>{price(m.priceUsd)} <span className={m.change24h >= 0 ? 'text-proven' : 'text-default'}>{change(m.change24h)}</span></> },
              { k: 'Market cap', v: usd(m.mcapUsd) },
              { k: m.stage === 'curve' ? 'Curve' : 'Liquidity', v: m.stage === 'curve' ? `${Math.round((m.curveSol / m.curveTargetSol) * 100)}% to graduation` : `${usd(m.liquidityUsd)} locked` },
              { k: 'Holders', v: count(m.holders) },
              { k: 'Proven', v: `${provenCount(c)} of 3` },
            ]}
          />
        </div>
      </div>

      <div className="wrap grid gap-10 pt-8 pb-28 lg:grid-cols-12 lg:gap-10 lg:pt-10 lg:pb-24 [&>*]:min-w-0">
        <div className="flex flex-col gap-12 lg:col-span-8">
          {defaulted && c.default && (
            <div role="status" className="rounded-card border border-default/40 bg-default-soft p-5 sm:p-6">
              <p className="label text-default">Defaulted · {date(c.default.at)}</p>
              <p className="mt-2 text-[20px] leading-snug font-semibold tracking-[-0.01em]">
                {c.builder.handle} {c.default.reason === 'missed' ? 'missed' : 'failed to prove'} M{c.default.milestone}, “{c.milestones[c.default.milestone - 1].title}”.
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                The remaining bond and pledged fees, {sol(c.default.poolSol)}, are open to holders who burn ${p.ticker}. Meanwhile, other builders can post a bond to take the roadmap over, so the
                token and its community carry on.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="danger" to="#redeem" className="lg:hidden">
                  Redeem
                </Button>
                <a href="#takeover" className="inline-flex h-10 items-center text-[14px] font-semibold text-ink underline decoration-line-2 underline-offset-4">
                  See takeover offers ({c.default.takeovers.length})
                </a>
              </div>
            </div>
          )}
          {c.takenOverFrom && (
            <p className="rounded-card border border-line bg-surface px-5 py-4 text-[14px] text-ink-2">
              <span className="font-semibold text-ink">{c.builder.handle}</span> took this roadmap over from {c.takenOverFrom} after a default, with a new {BOND_SOL} SOL bond.{' '}
              <a href="#history" className="font-semibold text-blue-text hover-device:hover:underline">
                See the first covenant
              </a>
            </p>
          )}

          <section aria-labelledby="covenant-title">
            <h2 id="covenant-title" className="text-[28px] leading-tight">
              The covenant
            </h2>
            <div className="mt-5 rounded-card border border-line bg-surface p-5 sm:p-6">
              <TermRail covenant={c} now={now} />
            </div>
          </section>

          <section aria-labelledby="milestones-title">
            <h2 id="milestones-title" className="text-[28px] leading-tight">
              Milestones
            </h2>
            <div className="mt-5 grid gap-4">
              {c.milestones.map((ms) => (
                <MilestoneCard key={ms.n} covenant={c} milestone={ms} now={now} reviewHref={ms.status === 'review' ? `/verify/${reviewId(p, ms)}` : undefined} />
              ))}
            </div>
          </section>

          {defaulted && c.default && (
            <section aria-labelledby="takeover-title" id="takeover" className="scroll-mt-24">
              <h2 id="takeover-title" className="text-[28px] leading-tight">
                Takeover offers
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-ink-2">Builders who’d carry the roadmap from here. Each has posted their own bond and set new deadlines for what’s still owed.</p>
              <div className="mt-5">
                <Takeovers
                  project={p}
                  now={now}
                  onOffer={async (plan, schedule) => {
                    await wait(900)
                    postTakeover(p.id, { id: 'mine', builder: { handle: 'you', wallet: '5uGv…r2Wd' }, bondSol: BOND_SOL, plan, schedule, at: new Date(sampleNowMs()).toISOString() })
                  }}
                />
              </div>
            </section>
          )}

          <section aria-labelledby="market-title">
            <h2 id="market-title" className="text-[28px] leading-tight">
              Market
            </h2>
            <div className="mt-5 rounded-card border border-line bg-surface p-5 sm:p-6">
              <PriceChart seed={p.id} last={m.priceUsd} change={m.change24h} className="h-48 sm:h-56" />
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
                {[
                  ['Volume 24h', usd(m.volume24hUsd)],
                  ['Venue', m.stage === 'curve' ? 'Bonding curve' : 'DAMM v2 pool'],
                  ['Token', 'Token-2022'],
                  ['Launched', date(p.launchedAt)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="label">{k}</dt>
                    <dd className="mt-0.5 text-[14px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="about-title">
            <h2 id="about-title" className="text-[28px] leading-tight">
              About
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">{p.about}</p>
          </section>

          {p.previous && p.previous.length > 0 && (
            <section aria-labelledby="history-title" id="history" className="scroll-mt-24">
              <h2 id="history-title" className="text-[28px] leading-tight">
                Earlier covenants
              </h2>
              <div className="mt-5 grid gap-4">
                {p.previous.map((pc) => (
                  <div key={pc.startedAt} className="rounded-card border border-line bg-surface p-5 sm:p-6">
                    <p className="flex flex-wrap items-center gap-3">
                      <span className="text-[15px] font-semibold">{pc.builder.handle}</span>
                      <Tag tone={covenantTone[pc.state]}>{covenantLabel[pc.state]}</Tag>
                      <span className="font-mono text-[12px] text-ink-3">
                        {date(pc.startedAt)} → {pc.default ? date(pc.default.at) : date(pc.endsAt)}
                      </span>
                    </p>
                    <MiniRail covenant={pc} now={now} className="mt-4" />
                    {pc.default && (
                      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                        Defaulted when M{pc.default.milestone}’s proof was {pc.default.reason === 'missed' ? 'not delivered' : 'rejected'}. Holders redeemed {Math.round(pc.default.redeemedPct * 100)}% of supply
                        from a {sol(pc.default.poolSol)} pool before {pc.default.successor?.handle} took over.
                      </p>
                    )}
                    <div className="mt-4 grid gap-3">
                      {pc.milestones
                        .filter((x) => x.proof)
                        .map((x) => (
                          <MilestoneCard key={x.n} covenant={pc} milestone={x} now={now} className="bg-raised" />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside aria-label={defaulted ? 'Redeem' : 'Trade'} className="lg:col-span-4">
          <div className="flex flex-col gap-4 lg:sticky lg:top-24">
            {defaulted ? (
              <RedeemPanel
                project={p}
                now={now}
                onRedeem={async (tokens) => {
                  await wait(900)
                  redeem(p.id, { tokens, sol: tokens * redeemRate(c), at: sampleNowMs() })
                }}
              />
            ) : (
              <TradePanel project={p} onTrade={() => wait(900)} />
            )}
            {m.stage === 'curve' && <CurveProgress market={m} />}
            <Backing project={p} />
          </div>
        </aside>
      </div>

      {/* phones: the price and the one action stay pinned to the bottom */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-md lg:hidden">
        <div className="wrap flex items-center gap-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[15px] font-medium tabular">{defaulted ? sol(c.default!.poolSol) : price(m.priceUsd)}</p>
            <p className="text-[12px] text-ink-3">{defaulted ? 'open to holders' : `${p.ticker} · ${change(m.change24h)} today`}</p>
          </div>
          <Button variant={defaulted ? 'danger' : 'primary'} to={defaulted ? '#redeem' : '#trade'}>
            {defaulted ? 'Redeem' : 'Trade'}
          </Button>
        </div>
      </div>
    </>
  )
}

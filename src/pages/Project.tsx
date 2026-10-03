import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '@/data/projects'
import { change, count, date, price, sol, usd } from '@/lib/format'
import { covenantLabel, covenantTone, dayOf, provenCount } from '@/lib/covenant'
import { sampleNowMs, useNow } from '@/lib/live'
import { redeemRate } from '@/lib/redeem'
import { reviewId } from '@/lib/reviews'
import { BOND_SOL } from '@/lib/rules'
import { postTakeover, redeem } from '@/lib/session'
import { cn } from '@/lib/cn'
import { useMedia } from '@/lib/useMedia'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import { Tabs } from '@/components/ui/Tabs'
import { Tag } from '@/components/ui/Tag'
import { TokenArt } from '@/components/ui/TokenArt'
import { Meter } from '@/components/covenant/Meter'
import { Milestones } from '@/components/covenant/Milestones'
import { TermRail } from '@/components/covenant/TermRail'
import { Candles } from '@/components/market/Candles'
import { HoldersList } from '@/components/market/HoldersList'
import { TradesList } from '@/components/market/TradesList'
import { Backing } from '@/components/project/Backing'
import { CurveProgress } from '@/components/project/CurveProgress'
import { RedeemPanel } from '@/components/project/RedeemPanel'
import { Takeovers } from '@/components/project/Takeovers'
import { TradePanel } from '@/components/project/TradePanel'

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

type Tab = 'milestones' | 'takeover' | 'trades' | 'holders' | 'history'

/**
 * A token, laid out like a trading screen: price and chart first, the covenant right under
 * it, then milestones, trades and holders. The one action (trade, or redeem after a
 * default) stays beside it on desktop and pinned to the bottom on phones.
 */
export function ProjectPage() {
  const { id = '' } = useParams()
  const now = useNow()
  const p = getProject(id)
  // the action panel renders once: beside the content on desktop, inline under the covenant on phones
  const wide = useMedia('(min-width: 1024px)')
  const [tab, setTab] = useState<Tab>(p?.covenant.state === 'defaulted' ? 'takeover' : 'milestones')

  if (!p) {
    return (
      <div className="wrap">
        <Notice title="There’s no token here." body="The link may be wrong, or the launch never happened.">
          <Link to="/" className="mt-4 text-sm font-semibold text-accent hover:underline">
            Back to the board
          </Link>
        </Notice>
      </div>
    )
  }

  const c = p.covenant
  const m = p.market
  const defaulted = c.state === 'defaulted'
  const day = Math.floor(dayOf(c, now))
  const tabs: { id: Tab; label: string }[] = [
    ...(defaulted ? [{ id: 'takeover' as const, label: 'Takeover' }] : []),
    { id: 'milestones', label: 'Milestones' },
    { id: 'trades', label: 'Trades' },
    { id: 'holders', label: 'Holders' },
    ...(p.previous?.length ? [{ id: 'history' as const, label: 'First covenant' }] : []),
  ]
  const figures: [string, string][] = [
    ['Market cap', usd(m.mcapUsd)],
    [m.stage === 'curve' ? 'Curve' : 'Liquidity', m.stage === 'curve' ? `${Math.round((m.curveSol / m.curveTargetSol) * 100)}%` : usd(m.liquidityUsd)],
    ['24h', change(m.change24h)],
    ['Vol 24h', usd(m.volume24hUsd)],
    ['Holders', count(m.holders)],
    ['Proven', `${provenCount(c)}/3`],
  ]

  const side = (
    <>
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
      {m.stage === 'curve' && <CurveProgress market={m} className="px-1" />}
      <Backing project={p} className="px-1" />
      <div className="px-1">
        <p className="label">About</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{p.about}</p>
      </div>
    </>
  )

  return (
    <>
      <div className="wrap pt-5 pb-36 lg:pt-8 lg:pb-16">
        <header className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <TokenArt seed={p.ticker} src={p.image} size={56} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <h1 className="truncate text-h1">{p.name}</h1>
                <span className="font-mono text-[13px] text-ink-3">${p.ticker}</span>
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[13px] text-ink-3">
                <span>
                  by <span className="text-ink-2">{c.builder.handle}</span>
                </span>
                <span>· {date(p.launchedAt)}</span>
                <Tag tone={covenantTone[c.state]}>{c.state === 'active' ? `Day ${day}` : covenantLabel[c.state]}</Tag>
              </p>
            </div>
          </div>
          <div className="text-right max-sm:hidden">
            <p className="font-mono text-[26px] font-medium tracking-[-0.03em] tabular">{price(m.priceUsd)}</p>
            <p className={cn('font-mono text-[13px]', m.change24h >= 0 ? 'text-proven' : 'text-default')}>{change(m.change24h)} 24h</p>
          </div>
        </header>

        <dl className="mt-5 grid grid-cols-3 gap-x-4 gap-y-4 sm:flex sm:gap-7">
          <div className="min-w-0 sm:hidden">
            <dt className="label">Price</dt>
            <dd className={cn('mt-1 truncate font-mono text-[14px] font-medium', m.change24h >= 0 ? 'text-proven' : 'text-default')}>
              {price(m.priceUsd)}
            </dd>
          </div>
          {figures.map(([k, v]) => (
            <div key={k} className={cn('min-w-0 sm:shrink-0', k === '24h' && 'sm:hidden', k === 'Vol 24h' && 'max-sm:hidden')}>
              <dt className="label truncate">{k}</dt>
              <dd className="mt-1 truncate font-mono text-[14px] font-medium sm:text-[15px]">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-8 [&>*]:min-w-0">
          <div className="lg:col-span-8">
            <Candles seed={p.id} last={m.priceUsd} change={m.change24h} className="h-56 sm:h-72 lg:h-80" />

            {defaulted && c.default && (
              <div role="status" className="mt-8 rounded-[14px] bg-default-soft p-4 sm:p-5">
                <p className="font-mono text-[11px] text-default uppercase">Defaulted · {date(c.default.at)}</p>
                <p className="mt-2 text-[16px] leading-snug font-semibold">
                  {c.builder.handle} {c.default.reason === 'missed' ? 'missed' : 'failed to prove'} M{c.default.milestone}, “{c.milestones[c.default.milestone - 1].title}”.
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">
                  {sol(c.default.poolSol)} from the bond and pledged fees is open to holders who burn ${p.ticker}. Other builders can post a bond to take the roadmap over.
                </p>
              </div>
            )}
            {c.takenOverFrom && (
              <p className="mt-8 rounded-[14px] bg-surface p-4 text-[14px] text-ink-2">
                <span className="font-semibold text-ink">{c.builder.handle}</span> took this roadmap over from {c.takenOverFrom} after a default, with a new {BOND_SOL} SOL bond.
              </p>
            )}

            <section aria-labelledby="covenant-title" className="mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="covenant-title" className="text-h2">
                  Covenant
                </h2>
                <span className="font-mono text-[12px] text-ink-3">{c.builder.wallet}</span>
              </div>
              <TermRail covenant={c} now={now} className="mt-6" />
            </section>

            {!wide && <div className="mt-8 flex flex-col gap-4">{side}</div>}

            <section aria-label="Details" className="mt-12">
              <Tabs label="Token details" value={tab} onChange={setTab} items={tabs} className="-mx-1 px-1" />
              <div className="mt-7">
                {tab === 'milestones' && <Milestones covenant={c} now={now} reviewHref={(x) => (x.status === 'review' ? `/verify/${reviewId(p, x)}` : undefined)} />}
                {tab === 'takeover' && c.default && (
                  <>
                    <p className="mb-5 max-w-xl text-[14px] text-ink-2">Builders offering to carry the roadmap from here. Each has posted their own bond and set new deadlines for what’s still owed.</p>
                    <Takeovers
                      project={p}
                      now={now}
                      onOffer={async (plan, schedule) => {
                        await wait(900)
                        postTakeover(p.id, { id: 'mine', builder: { handle: 'you', wallet: '5uGv…r2Wd' }, bondSol: BOND_SOL, plan, schedule, at: new Date(sampleNowMs()).toISOString() })
                      }}
                    />
                  </>
                )}
                {tab === 'trades' && <TradesList project={p} now={now} />}
                {tab === 'holders' && <HoldersList project={p} />}
                {tab === 'history' &&
                  p.previous?.map((pc) => (
                    <div key={pc.startedAt}>
                      <p className="flex flex-wrap items-center gap-3 text-[14px]">
                        <span className="font-semibold">{pc.builder.handle}</span>
                        <Tag tone="default">Defaulted</Tag>
                        <span className="font-mono text-[12px] text-ink-3">
                          {date(pc.startedAt)} → {pc.default ? date(pc.default.at) : date(pc.endsAt)}
                        </span>
                      </p>
                      <Meter covenant={pc} now={now} className="mt-4 max-w-md" />
                      {pc.default && (
                        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-ink-2">
                          M{pc.default.milestone}’s proof was {pc.default.reason === 'missed' ? 'never delivered' : 'rejected'}. Holders redeemed {Math.round(pc.default.redeemedPct * 100)}% of supply from a{' '}
                          {sol(pc.default.poolSol)} pool before {pc.default.successor?.handle} took over.
                        </p>
                      )}
                      <Milestones covenant={pc} now={now} only={pc.milestones.filter((x) => x.proof).map((x) => x.n)} className="mt-8" />
                    </div>
                  ))}
              </div>
            </section>
          </div>

          <aside aria-label={defaulted ? 'Redeem' : 'Trade'} className="hidden lg:col-span-4 lg:block">
            {wide && <div className="sticky top-24 flex flex-col gap-6">{side}</div>}
          </aside>
        </div>
      </div>

      {/* phones: the action stays pinned above the tab bar */}
      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 border-t border-line bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md lg:hidden">
        <div className="wrap flex gap-2 py-2.5">
          {defaulted ? (
            <Button variant="danger" to="#redeem" className="h-11 flex-1">
              Redeem · {sol(c.default!.poolSol, 0)} pool
            </Button>
          ) : (
            <>
              <Button variant="buy" to="#trade" className="h-11 flex-1">
                Buy
              </Button>
              <Button variant="sell" to="#trade" className="h-11 flex-1">
                Sell
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

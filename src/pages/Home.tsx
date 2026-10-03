import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { activity, getProject, projects } from '@/data/projects'
import { cn } from '@/lib/cn'
import { standing, type Standing } from '@/lib/covenant'
import { sol } from '@/lib/format'
import { useDemoState } from '@/lib/hooks'
import { useNow } from '@/lib/live'
import { protocolStats } from '@/lib/stats'
import { BOND_SOL, ESCROW_PCT, NEEDED, PANEL, TERM_DAYS } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { Notice } from '@/components/ui/Notice'
import { Tabs } from '@/components/ui/Tabs'
import { LiveCovenant } from '@/components/board/LiveCovenant'
import { Ticker } from '@/components/board/Ticker'
import { TokenItem, TokenItemSkeleton } from '@/components/board/TokenItem'

type Filter = Standing | 'all'
type Sort = 'due' | 'mcap' | 'new'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'curve', label: 'Bonding' },
  { id: 'review', label: 'In review' },
  { id: 'term', label: 'Live' },
  { id: 'fulfilled', label: 'Fulfilled' },
  { id: 'defaulted', label: 'Defaulted' },
]

const steps = [
  ['Bond', `${BOND_SOL} SOL, ${ESCROW_PCT}% of supply and every creator fee go into the covenant before launch.`],
  ['Build', `Three measurable milestones, due inside ${TERM_DAYS} days. The token trades from block one.`],
  ['Prove', `Proof goes to ${PANEL} staked verifiers. ${NEEDED} matching verdicts decide each one.`],
  ['Release or default', 'Proven milestones unlock 5% each. A missed one pays holders and opens the roadmap to a new builder.'],
]

/** The board: what's at stake right now, the launch everyone is watching, then every token. */
export function Home() {
  const now = useNow()
  const state = useDemoState()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('due')
  const stats = protocolStats()

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: projects.length }
    projects.forEach((p) => (out[standing(p)] = (out[standing(p)] ?? 0) + 1))
    return out
  }, [])

  // cheap enough to recompute on every render
  const term = q.trim().toLowerCase()
  const rows = state === 'empty' ? [] : projects.filter((p) => (filter === 'all' || standing(p) === filter) && (!term || `${p.name} ${p.ticker} ${p.tagline}`.toLowerCase().includes(term)))
  const nextDue = (p: (typeof projects)[number]) => {
    const m = p.covenant.milestones.find((x) => x.status !== 'proven')
    return p.covenant.state === 'active' && m ? Date.parse(p.covenant.startedAt) + m.dueDay * 864e5 : Infinity
  }
  const list = [...rows].sort((a, b) => (sort === 'mcap' ? b.market.mcapUsd - a.market.mcapUsd : sort === 'new' ? Date.parse(b.launchedAt) - Date.parse(a.launchedAt) : nextDue(a) - nextDue(b)))


  return (
    <>
      <section className="wrap grid gap-12 pt-10 pb-12 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-20 lg:pb-20 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-raised py-1 pr-3 pl-2.5 text-[12px] text-ink-2">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {stats.live} covenants live on Solana
          </p>
          <h1 className="mt-5 text-display">Launch with something at&nbsp;stake.</h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-2 sm:text-[17px]">
            Every token on Covenant ships with a bonded roadmap. Builders who deliver get paid. Builders who don’t pay their holders.
          </p>
          <div className="mt-8 flex gap-2">
            <Button variant="primary" size="lg" to="/launch" className="max-sm:flex-1">
              Launch a token
            </Button>
            <Button size="lg" to="#board" className="max-sm:flex-1">
              Explore tokens
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[12px] text-ink-3">
            <li className="whitespace-nowrap">
              <span className="text-ink">{sol(stats.atStake, 0)}</span> at stake
            </li>
            <li className="whitespace-nowrap">
              <span className="text-ink">{sol(stats.toHolders, 0)}</span> paid to holders
            </li>
            <li className="whitespace-nowrap">
              <span className="text-ink">{stats.proven}</span> milestones proven
            </li>
          </ul>
        </div>
        <LiveCovenant project={getProject('lantern')!} now={now} className="lg:col-span-7" />
      </section>

      <Ticker items={activity} now={now} />

      <section id="board" aria-labelledby="board-title" className="wrap scroll-mt-16 pt-10 pb-16 lg:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <h2 id="board-title" className="text-h2">
            {q ? `Results for “${q}”` : 'The board'}
          </h2>
          <label className="flex items-center gap-2 text-[13px] text-ink-3">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 rounded-[9px] bg-raised px-2.5 text-[13px] text-ink outline-none focus:ring-1 focus:ring-accent">
              <option value="due">Next deadline</option>
              <option value="mcap">Market cap</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
        <Tabs className="mt-5 -mx-1 px-1" label="Filter the board" value={filter} onChange={setFilter} items={filters.map((f) => ({ ...f, count: counts[f.id] ?? 0 }))} />

        <div className="mt-5">
          {state === 'loading' ? (
            <div className="grid gap-x-4 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <TokenItemSkeleton key={i} />
              ))}
            </div>
          ) : state === 'error' ? (
            <Notice kind="error" title="The board didn’t load." body="We couldn’t reach the network. Your wallet and funds aren’t affected." action="Try again" onAction={() => location.reload()} />
          ) : list.length ? (
            <ul className="-mx-3 grid gap-x-4 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
              {list.map((p) => (
                <li key={p.id} className="min-w-0">
                  <TokenItem project={p} now={now} />
                </li>
              ))}
            </ul>
          ) : (
            <Notice
              title={q ? `Nothing matches “${q}”.` : 'Nothing here yet.'}
              body={q ? 'Try a ticker, or clear the search.' : 'When a builder signs a covenant and launches, it shows up here.'}
              action={q ? 'Clear search' : undefined}
              onAction={() => setParams({})}
            />
          )}
        </div>
      </section>

      <section aria-labelledby="how" className="border-t border-line">
        <div className="wrap py-12 lg:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="how" className="text-h2">
              How a covenant works
            </h2>
            <Link to="/rules" className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink-2 hover-device:hover:text-ink">
              Read the rules <ArrowRight className="size-4" />
            </Link>
          </div>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map(([t, b], i) => (
              <li key={t}>
                <div className="flex items-center gap-2">
                  <span className={cn('grid size-6 place-items-center rounded-[6px] font-mono text-[11px] font-medium', 'bg-raised text-ink-2')}>{i + 1}</span>
                  <span aria-hidden className="h-px flex-1 bg-line-2 max-lg:hidden" />
                </div>
                <p className="mt-4 font-display text-[17px] font-semibold tracking-[-0.03em]">{t}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

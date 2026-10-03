import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { projects } from '@/data/projects'
import { cn } from '@/lib/cn'
import { standing, type Standing } from '@/lib/covenant'
import { useDemoState } from '@/lib/hooks'
import { useNow } from '@/lib/live'
import { LaunchRow } from '@/components/covenant/LaunchRow'
import { Notice } from '@/components/ui/Notice'

const filters: { id: Standing | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'review', label: 'In review' },
  { id: 'term', label: 'In term' },
  { id: 'curve', label: 'On curve' },
  { id: 'fulfilled', label: 'Fulfilled' },
  { id: 'defaulted', label: 'Defaulted' },
]

type Sort = 'due' | 'mcap' | 'new'

export function Launches() {
  const now = useNow()
  const navigate = useNavigate()
  const state = useDemoState()
  const [filter, setFilter] = useState<Standing | 'all'>('all')
  const [sort, setSort] = useState<Sort>('due')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: projects.length }
    projects.forEach((p) => (out[standing(p)] = (out[standing(p)] ?? 0) + 1))
    return out
  }, [])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const rows = state === 'empty' ? [] : projects.filter((p) => (filter === 'all' || standing(p) === filter) && (!term || `${p.name} ${p.ticker} ${p.tagline}`.toLowerCase().includes(term)))
    const nextDue = (p: (typeof projects)[number]) => {
      const m = p.covenant.milestones.find((x) => x.status !== 'proven')
      return p.covenant.state === 'active' && m ? Date.parse(p.covenant.startedAt) + m.dueDay * 864e5 : Infinity
    }
    return [...rows].sort((a, b) => (sort === 'mcap' ? b.market.mcapUsd - a.market.mcapUsd : sort === 'new' ? Date.parse(b.launchedAt) - Date.parse(a.launchedAt) : nextDue(a) - nextDue(b)))
  }, [filter, sort, q, state])

  return (
    <div className="wrap pt-10 pb-20 lg:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label">Launches</p>
          <h1 className="mt-3 text-h1">Every token, and what it owes.</h1>
        </div>
        <label className="flex h-10 w-full items-center gap-2 rounded-control border border-line-2 bg-surface px-3 focus-within:border-blue sm:w-72">
          <Search className="size-4 text-ink-3" />
          <span className="sr-only">Search launches</span>
          <input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or ticker" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <div role="tablist" aria-label="Filter launches" className="-mb-px flex gap-5 overflow-x-auto [scrollbar-width:none]">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn('flex h-11 shrink-0 items-center gap-1.5 border-b-2 text-[14px] font-medium transition-colors', filter === f.id ? 'border-ink text-ink' : 'border-transparent text-ink-3 hover-device:hover:text-ink')}
            >
              {f.label}
              <span className="font-mono text-[11px] text-ink-4">{counts[f.id] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="mb-2 flex items-center gap-2 text-[13px] text-ink-3">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-8 rounded-[7px] border border-line-2 bg-surface px-2 text-[13px] text-ink">
            <option value="due">Next deadline</option>
            <option value="mcap">Market cap</option>
            <option value="new">Newest</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        {state === 'loading' ? (
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
                <div className="skeleton size-9" />
                <div className="flex-1">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton mt-2 h-3 w-52" />
                </div>
                <div className="skeleton hidden h-1.5 w-60 md:block" />
              </div>
            ))}
          </div>
        ) : state === 'error' ? (
          <Notice kind="error" title="Launches didn’t load." body="We couldn’t reach the network. Your wallet and funds aren’t affected." action="Try again" onAction={() => location.reload()} />
        ) : list.length ? (
          <>
            <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.3fr)_90px_80px] gap-x-6 px-5 pb-2 md:grid">
              {['Launch', 'Term', 'Next', 'Mkt cap', '24h'].map((h, i) => (
                <span key={h} className={cn('label', i > 2 && 'text-right')}>
                  {h}
                </span>
              ))}
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">
              {list.map((p) => (
                <li key={p.id}>
                  <LaunchRow project={p} now={now} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Notice
            title={q ? `Nothing matches “${q}”.` : 'No launches here yet.'}
            body={q ? 'Try a ticker, or clear the search.' : 'When a builder signs a covenant and launches, it shows up here.'}
            action={q ? 'Clear search' : 'Launch a project'}
            onAction={() => (q ? setQ('') : navigate('/launch'))}
          />
        )}
      </div>
    </div>
  )
}

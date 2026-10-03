import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { usd } from '@/lib/format'
import { current, statusLabel } from '@/lib/covenant'
import type { Hit } from '@/lib/search'
import { TokenArt } from '@/components/ui/TokenArt'
import { Highlight } from './Highlight'

interface Props {
  id: string
  query: string
  hits: Hit[]
  trending: Project[]
  active: number
  onHover: (i: number) => void
  onPick: (p: Project) => void
  tooShort: boolean
}

const statusText = (p: Project) => {
  const c = p.covenant
  if (c.state === 'fulfilled') return ['bg-proven', 'Fulfilled']
  if (c.state === 'defaulted') return ['bg-default', 'Defaulted']
  const m = current(c)
  return m?.status === 'review' ? ['bg-accent', `M${m.n} in review`] : ['bg-ink-3', m ? `M${m.n} ${statusLabel[m.status].toLowerCase()}` : 'Live']
}

/** The suggestion list shared by the desktop dropdown and the phone sheet. */
export function SearchResults({ id, query, hits, trending, active, onHover, onPick, tooShort }: Props) {
  const showTrending = tooShort
  const rows: { p: Project; field?: Hit['field'] }[] = showTrending ? trending.map((p) => ({ p })) : hits.map((h) => ({ p: h.project, field: h.field }))

  return (
    <div>
      <p className="px-3 pt-3 pb-1.5 label">{showTrending ? 'Trending now' : hits.length ? `${hits.length} ${hits.length === 1 ? 'token' : 'tokens'}` : 'No matches'}</p>
      {!showTrending && !hits.length && <p className="px-3 pb-4 text-[13px] text-ink-3">Nothing matches “{query.trim()}”. Try a ticker or a builder’s name.</p>}
      <ul id={id} role="listbox" aria-label="Suggestions" className="pb-2">
        {rows.map(({ p, field }, i) => {
          const [mark, label] = statusText(p)
          return (
            <li
              key={p.id}
              id={`${id}-${i}`}
              role="option"
              aria-selected={active === i}
              onMouseEnter={() => onHover(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPick(p)}
              className={cn('mx-1.5 flex cursor-pointer items-center gap-3 rounded-[10px] px-2 py-2', active === i && 'bg-raised')}
            >
              <TokenArt seed={p.ticker} src={p.image} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">
                  <Highlight text={p.name} query={field === 'name' ? query : ''} />{' '}
                  <span className="font-mono text-[12px] font-normal text-ink-3">
                    $<Highlight text={p.ticker} query={field === 'ticker' ? query : ''} />
                  </span>
                </p>
                <p className="flex items-center gap-1.5 truncate text-[12px] text-ink-3">
                  <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', mark)} />
                  {label} · <Highlight text={p.covenant.builder.handle} query={field === 'builder' ? query : ''} />
                </p>
              </div>
              <span className="font-mono text-[12px] text-ink-2 tabular">{p.market.stage === 'curve' ? `${Math.round((p.market.curveSol / p.market.curveTargetSol) * 100)}%` : usd(p.market.mcapUsd)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { sol, usd } from '@/lib/format'
import { heldPct } from '@/lib/covenant'

/** What stands behind the token right now. Stripes are held under the covenant. */
export function Backing({ project: p, className }: { project: Project; className?: string }) {
  const c = p.covenant
  const live = c.state === 'active'
  const rows: { k: string; v: string; held: boolean }[] = [
    { k: 'Bond', v: live ? sol(c.bondSol, 0) : c.state === 'fulfilled' ? 'Returned' : 'Forfeit', held: live },
    { k: 'Escrowed supply', v: live ? `${heldPct(c)}%` : c.state === 'fulfilled' ? 'Released' : `${heldPct(c)}% for successor`, held: live || c.state === 'defaulted' },
    { k: 'Pledged fees', v: live ? sol(c.feesSol - c.feesReleasedSol) : c.state === 'fulfilled' ? 'Released' : 'To holders', held: live },
    { k: 'Liquidity', v: p.market.stage === 'curve' ? 'Locks at graduation' : `${usd(p.market.liquidityUsd)} locked forever`, held: false },
  ]
  return (
    <div className={className}>
      <p className="label">Behind ${p.ticker}</p>
      <ul className="mt-3 grid gap-2.5">
        {rows.map((r, i) => (
          <li key={r.k} className="flex items-center gap-3 text-[13px]">
            <span aria-hidden className={cn('h-3.5 w-5 shrink-0 rounded-[3px]', r.held ? 'held bg-raised' : i === 3 && p.market.stage !== 'curve' ? 'bg-ink-3' : 'bg-raised')} />
            <span className="flex-1 text-ink-2">{r.k}</span>
            <span className="font-mono text-[12px]">{r.v}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type { Project } from '@/types'
import { count, sol, usd } from '@/lib/format'
import { heldPct } from '@/lib/covenant'
import { SUPPLY } from '@/lib/rules'

/** What stands behind the token right now: held value is hatched, locked liquidity solid. */
export function Backing({ project: p }: { project: Project }) {
  const c = p.covenant
  const live = c.state === 'active'
  const rows = [
    { k: 'Bond', v: live ? sol(c.bondSol, 0) : c.state === 'fulfilled' ? 'Returned' : 'Forfeit', held: live },
    { k: 'Escrowed supply', v: live ? `${heldPct(c)}% · ${count((heldPct(c) / 100) * SUPPLY / 1e6)}M` : c.state === 'fulfilled' ? 'Released' : `${heldPct(c)}% held for successor`, held: live || c.state === 'defaulted' },
    { k: 'Pledged fees', v: live ? `${sol(c.feesSol - c.feesReleasedSol)} held` : c.state === 'fulfilled' ? 'Released' : 'To redemption', held: live },
  ]
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="label">Behind ${p.ticker}</p>
      <ul className="mt-3 grid gap-2.5">
        {rows.map((r) => (
          <li key={r.k} className="flex items-center gap-3 text-[13px]">
            <span aria-hidden className={r.held ? 'hatch h-4 w-6 shrink-0 rounded-[3px] border border-line-2' : 'h-4 w-6 shrink-0 rounded-[3px] bg-sunken'} />
            <span className="flex-1 text-ink-2">{r.k}</span>
            <span className="font-mono text-[12px]">{r.v}</span>
          </li>
        ))}
        <li className="flex items-center gap-3 text-[13px]">
          <span aria-hidden className="h-4 w-6 shrink-0 rounded-[3px] bg-ink" />
          <span className="flex-1 text-ink-2">Locked liquidity</span>
          <span className="font-mono text-[12px]">{p.market.stage === 'curve' ? 'At graduation' : `${usd(p.market.liquidityUsd)} · forever`}</span>
        </li>
      </ul>
    </div>
  )
}

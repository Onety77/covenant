import type { Market } from '@/types'
import { sol } from '@/lib/format'

/** How far the bonding curve is from graduating into a pool with locked liquidity. */
export function CurveProgress({ market: m }: { market: Market }) {
  const share = Math.min(1, m.curveSol / m.curveTargetSol)
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="flex items-baseline justify-between">
        <span className="label">Bonding curve</span>
        <span className="font-mono text-[12px] tabular">{Math.round(share * 100)}%</span>
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-sunken">
        <div className="h-full rounded-full bg-blue" style={{ width: `${share * 100}%` }} />
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
        {sol(m.curveSol)} of {sol(m.curveTargetSol, 0)}. At {sol(m.curveTargetSol, 0)} it graduates to a DAMM v2 pool and its liquidity is locked for good.
      </p>
    </div>
  )
}

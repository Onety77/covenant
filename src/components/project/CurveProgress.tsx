import type { Market } from '@/types'
import { sol } from '@/lib/format'

/** How far the bonding curve is from graduating into a pool with locked liquidity. */
export function CurveProgress({ market: m, className }: { market: Market; className?: string }) {
  const share = Math.min(1, m.curveSol / m.curveTargetSol)
  return (
    <div className={className}>
      <p className="flex items-baseline justify-between">
        <span className="label">Bonding curve</span>
        <span className="font-mono text-[13px] font-medium tabular">{Math.round(share * 100)}%</span>
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-raised">
        <div className="h-full rounded-full bg-ink-2" style={{ width: `${share * 100}%` }} />
      </div>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">
        {sol(m.curveSol)} of {sol(m.curveTargetSol, 0)}. Then it graduates to a DAMM v2 pool and the liquidity locks for good.
      </p>
    </div>
  )
}

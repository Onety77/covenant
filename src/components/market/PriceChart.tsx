import { useId, useMemo } from 'react'
import { pricePath } from '@/lib/seeded'
import { price } from '@/lib/format'
import { cn } from '@/lib/cn'

/** A seeded price line for sample data: start price on the left, now on the right. */
export function PriceChart({ seed, last, change, className }: { seed: string; last: number; change: number; className?: string }) {
  const id = useId()
  const pts = useMemo(() => pricePath(seed, last, change * 6, 96), [seed, last, change])
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const W = 600
  const H = 200
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * W, H - 8 - ((v - min) / (max - min || 1)) * (H - 24)] as const)
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
  const up = pts[pts.length - 1] >= pts[0]
  return (
    <div className={cn('relative', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" role="img" aria-label={`Price, from ${price(pts[0])} to ${price(last)}`}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={up ? 'var(--proven)' : 'var(--default)'} stopOpacity="0.16" />
            <stop offset="1" stopColor={up ? 'var(--proven)' : 'var(--default)'} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="var(--line)" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line}L${W},${H}L0,${H}Z`} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke={up ? 'var(--proven)' : 'var(--default)'} strokeWidth="1.75" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <span className="absolute top-1 left-0 font-mono text-[11px] text-ink-3">{price(pts[0])}</span>
      <span className="absolute top-1 right-0 font-mono text-[11px] text-ink-3">{price(last)} now</span>
    </div>
  )
}

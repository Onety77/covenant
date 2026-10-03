import { useMemo } from 'react'
import { candles } from '@/lib/market'
import { price } from '@/lib/format'
import { cn } from '@/lib/cn'

/** A seeded candlestick chart with volume, drawn to scale; labels sit on the right axis. */
export function Candles({ seed, last, change, className }: { seed: string; last: number; change: number; className?: string }) {
  const data = useMemo(() => candles(seed, last, change), [seed, last, change])
  const W = 640
  const H = 260
  const VH = 40
  const hi = Math.max(...data.map((d) => d.h))
  const lo = Math.min(...data.map((d) => d.l))
  const vmax = Math.max(...data.map((d) => d.v))
  const y = (v: number) => 10 + ((hi - v) / (hi - lo || 1)) * (H - VH - 24)
  const cw = W / data.length
  const ticks = [0, 0.33, 0.66, 1].map((f) => lo + (hi - lo) * (1 - f))
  return (
    <div className={cn('relative pr-16', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label={`Price chart, now ${price(last)}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1="0" x2={W} y1={y(t)} y2={y(t)} stroke="var(--line)" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
        {data.map((d, i) => {
          const up = d.c >= d.o
          const x = i * cw + cw / 2
          const col = up ? 'var(--proven)' : 'var(--default)'
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={y(d.h)} y2={y(d.l)} stroke={col} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <rect x={x - cw * 0.32} width={cw * 0.64} y={y(Math.max(d.o, d.c))} height={Math.max(1, Math.abs(y(d.o) - y(d.c)))} fill={col} />
              <rect x={x - cw * 0.32} width={cw * 0.64} y={H - (d.v / vmax) * VH} height={(d.v / vmax) * VH} fill={col} opacity="0.25" />
            </g>
          )
        })}
        <line x1="0" x2={W} y1={y(last)} y2={y(last)} stroke="var(--accent)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
      {ticks.filter((t) => Math.abs(y(t) - y(last)) > 16).map((t) => (
        <span key={t} className="absolute right-0 -translate-y-1/2 font-mono text-[10px] text-ink-4" style={{ top: `${(y(t) / H) * 100}%` }}>
          {price(t)}
        </span>
      ))}
      <span className="absolute right-0 -translate-y-1/2 rounded-[4px] bg-accent px-1 font-mono text-[10px] font-medium text-on-accent" style={{ top: `${(y(last) / H) * 100}%` }}>
        {price(last)}
      </span>
    </div>
  )
}

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { seeded } from '@/lib/seeded'

/**
 * A project's image, or (when there is none or it fails) its ticker's first letter on a
 * tinted tile. The tint is seeded from the ticker, so it never changes.
 */
export function TokenMark({ ticker, src, size = 40, className }: { ticker: string; src?: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  const r = seeded(ticker)
  const hue = Math.floor(r() * 360)
  const style = { width: size, height: size, borderRadius: Math.round(size * 0.24) }
  if (src && !failed) {
    return <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)} className={cn('shrink-0 object-cover', className)} style={style} />
  }
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center font-semibold text-white', className)}
      style={{ ...style, fontSize: size * 0.44, background: `oklch(0.42 0.09 ${hue})` }}
    >
      {ticker[0]}
    </span>
  )
}

import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import { seeded } from '@/lib/seeded'
import { projects } from '@/data/projects'

// sample launches get evenly spread marks and hues, so no two on the board look alike
const order = projects.map((p) => p.ticker)

type Motif = (fg: string, r: () => number) => React.ReactNode

/* Bold, simple marks, the kind a small team ships as a first logo. */
const motifs: Motif[] = [
  (fg) => (
    <g fill="none" stroke={fg} strokeWidth="7">
      <circle cx="50" cy="50" r="30" />
      <circle cx="50" cy="50" r="14" />
    </g>
  ),
  (fg) => <circle cx="60" cy="42" r="26" fill={fg} />,
  (fg) => (
    <g fill={fg}>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={-10 + i * 30} y="-20" width="12" height="140" transform="rotate(30 50 50)" />
      ))}
    </g>
  ),
  (fg) => (
    <g fill={fg}>
      {[0, 1, 2].flatMap((x) => [0, 1, 2].map((y) => <circle key={`${x}${y}`} cx={26 + x * 24} cy={26 + y * 24} r="7" />))}
    </g>
  ),
  (fg) => <path d="M50 18 L82 78 L18 78 Z" fill={fg} />,
  (fg) => <path d="M50 20 A30 30 0 1 0 50 80 A20 30 0 1 1 50 20 Z" fill={fg} />,
  (fg) => <path d="M42 18h16v24h24v16H58v24H42V58H18V42h24z" fill={fg} />,
  (fg) => <path d="M10 60 Q30 30 50 60 T90 60" fill="none" stroke={fg} strokeWidth="9" strokeLinecap="round" />,
  (fg) => (
    <g fill={fg}>
      <rect x="22" y="22" width="26" height="26" rx="4" />
      <rect x="52" y="52" width="26" height="26" rx="4" />
    </g>
  ),
]

interface Props {
  seed: string
  src?: string
  size?: number
  className?: string
}

/**
 * A token's logo: the uploaded image, or (when there is none, or it fails) a seeded
 * generated mark so every launch on the board is recognisable at a glance.
 */
export function TokenArt({ seed, src, size = 48, className }: Props) {
  const [failed, setFailed] = useState(false)
  // unique per instance: the same token often appears twice on a page
  const uid = useId()
  const style = { width: size, height: size, borderRadius: Math.max(6, Math.round(size * 0.22)) }
  if (src && !failed) {
    return <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)} className={cn('shrink-0 object-cover', className)} style={style} />
  }
  const r = seeded(seed)
  const idx = order.indexOf(seed)
  const hue = idx >= 0 ? Math.round((idx * 137.5 + 20) % 360) : Math.floor(r() * 360)
  const hue2 = (hue + 30 + Math.floor(r() * 60)) % 360
  const motif = motifs[idx >= 0 ? idx % motifs.length : Math.floor(r() * motifs.length)]
  const dark = r() > 0.6
  const fg = dark ? '#0a0b0d' : '#f7f7f2'
  const id = `ta${uid.replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={cn('shrink-0 overflow-hidden', className)} style={style} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`oklch(${dark ? 0.82 : 0.6} 0.17 ${hue})`} />
          <stop offset="1" stopColor={`oklch(${dark ? 0.72 : 0.45} 0.17 ${hue2})`} />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <rect width="100" height="100" />
        </clipPath>
      </defs>
      <rect width="100" height="100" fill={`url(#${id})`} />
      <g clipPath={`url(#${id}-c)`}>{motif(fg, r)}</g>
    </svg>
  )
}

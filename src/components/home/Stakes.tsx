import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'

const items = [
  {
    k: 'Bond',
    v: '10 SOL',
    body: 'Posted in SOL before launch. Returned on day 90 if all three milestones are proven. On a default it goes to holders.',
    swatch: <div className="hatch h-full rounded-[5px] border border-line-2" />,
  },
  {
    k: 'Supply',
    v: '15%',
    body: 'The builder’s allocation sits in escrow and unlocks 5% per proven milestone. Nothing unlocks on a promise.',
    swatch: (
      <div className="grid h-full grid-cols-3 gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="hatch rounded-[5px] border border-line-2" />
        ))}
      </div>
    ),
  },
  {
    k: 'Creator fees',
    v: 'All of them',
    body: 'Every trading fee the builder earns is pledged to the covenant and released alongside the milestones.',
    swatch: (
      <div className="h-full rounded-[5px] bg-sunken">
        <div className="hatch h-full w-2/3 rounded-[5px] border border-line-2 [clip-path:polygon(0_70%,100%_0,100%_100%,0_100%)]" />
      </div>
    ),
  },
] satisfies { k: string; v: string; body: string; swatch: ReactNode }[]

/** What a builder puts up, against what nobody can touch. */
export function Stakes() {
  return (
    <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.k} className="flex flex-col bg-surface p-5 sm:p-6">
          <div className="h-8 sm:h-10" aria-hidden>
            {it.swatch}
          </div>
          <p className="mt-5 label">{it.k}</p>
          <p className="mt-1 font-display text-[44px] leading-none">{it.v}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{it.body}</p>
        </div>
      ))}
      <div className="flex flex-col bg-contrast p-5 text-on-contrast sm:p-6">
        <div className="flex h-8 items-center gap-2 rounded-[5px] border border-on-contrast/25 px-3 font-mono text-[11px] opacity-80 sm:h-10" aria-hidden>
          <Lock className="size-3.5" /> Permanent
        </div>
        <p className="mt-5 font-mono text-[11px] tracking-[0.06em] uppercase opacity-60">Liquidity</p>
        <p className="mt-1 font-display text-[44px] leading-none">Locked for good</p>
        <p className="mt-3 text-[14px] leading-relaxed opacity-75">
          At graduation the curve’s liquidity moves to a Meteora DAMM v2 pool and is locked permanently. No builder, verifier or recovery path can pull it.
        </p>
      </div>
    </div>
  )
}

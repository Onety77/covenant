import { cn } from '@/lib/cn'

/** The mark is the covenant itself: a 90-day line with three gates, the last one taller. */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cn('size-7', className)} aria-hidden>
      <rect width="28" height="28" rx="7" className="fill-accent" />
      <path d="M6 16.5h16M11.5 13v7M17 13v7" className="stroke-on-accent" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 9v11" className="stroke-on-accent" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark />
      <span className="font-display text-[18px] font-[650] tracking-[-0.03em] [font-stretch:108%]">Covenant</span>
    </span>
  )
}

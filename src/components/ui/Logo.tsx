import { cn } from '@/lib/cn'

/**
 * The mark is the covenant itself: a 90-day line with three milestone gates,
 * the last one taller (the end of the term).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cn('size-7', className)} aria-hidden>
      <rect width="28" height="28" rx="7" className="fill-ink" />
      <path d="M6 16.5h16" className="stroke-bg" strokeWidth="2" strokeLinecap="round" />
      <path d="M11.5 13.5v6M17 13.5v6" className="stroke-bg" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 9.5v10" className="stroke-blue" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[25px] leading-none tracking-[-0.01em]">Covenant</span>
    </span>
  )
}

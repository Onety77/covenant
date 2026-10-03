import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Tone } from '@/lib/covenant'

const marks: Record<Tone, string> = {
  neutral: 'bg-ink-3',
  accent: 'bg-accent',
  proven: 'bg-proven',
  default: 'bg-default',
}

/** A status label: neutral text, with a small coloured mark carrying the state. */
export function Tag({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-[6px] bg-raised px-2 text-[12px] font-medium whitespace-nowrap text-ink-2', className)}>
      <span aria-hidden className={cn('size-1.5 rounded-full', marks[tone])} />
      {children}
    </span>
  )
}

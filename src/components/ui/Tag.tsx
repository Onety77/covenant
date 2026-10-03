import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Tone } from '@/lib/covenant'

const tones: Record<Tone, string> = {
  neutral: 'bg-sunken text-ink-2',
  blue: 'bg-blue-soft text-blue-text',
  proven: 'bg-proven-soft text-proven',
  review: 'bg-review-soft text-review',
  default: 'bg-default-soft text-default',
}
const dots: Record<Tone, string> = {
  neutral: 'bg-ink-4',
  blue: 'bg-blue',
  proven: 'bg-proven',
  review: 'bg-review',
  default: 'bg-default',
}

/** A small status label. */
export function Tag({ tone = 'neutral', children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-[6px] px-2 text-[12px] font-semibold whitespace-nowrap', tones[tone], className)}>
      {dot && <span aria-hidden className={cn('size-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  )
}

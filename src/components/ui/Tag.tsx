import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Tone } from '@/lib/covenant'

const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-ink-2',
  accent: 'bg-accent-soft text-accent',
  proven: 'bg-proven-soft text-proven',
  review: 'bg-review-soft text-review',
  default: 'bg-default-soft text-default',
}

/** A small status label. */
export function Tag({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex h-[22px] items-center rounded-[6px] px-1.5 font-mono text-[11px] font-medium whitespace-nowrap uppercase', tones[tone], className)}>{children}</span>
}

import type { Vote } from '@/types'
import { cn } from '@/lib/cn'
import { tally } from '@/lib/covenant'

/** A review panel as five marks: approve, reject, or still to vote. */
export function VoteDots({ panel = [], size = 10, className }: { panel?: Vote[]; size?: number; className?: string }) {
  const t = tally(panel)
  return (
    <span className={cn('inline-flex items-center gap-[3px]', className)} role="img" aria-label={`${t.approve} approve, ${t.reject} reject, ${t.pending} to vote`}>
      {panel.map((v) => (
        <span
          key={v.verifierId}
          className={cn('rounded-[2px]', v.verdict === 'approve' ? 'bg-proven' : v.verdict === 'reject' ? 'bg-default' : 'border border-line-2 bg-surface')}
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  )
}

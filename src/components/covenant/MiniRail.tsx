import type { Covenant } from '@/types'
import { cn } from '@/lib/cn'
import { dayOf } from '@/lib/covenant'

/** The term in one line: three stretches coloured by verdict, the running one filled to today. */
export function MiniRail({ covenant: c, now, className }: { covenant: Covenant; now: number; className?: string }) {
  const day = dayOf(c, now)
  return (
    <div className={cn('flex h-1.5 w-full gap-[3px]', className)} role="img" aria-label={`${c.milestones.filter((m) => m.status === 'proven').length} of 3 milestones proven`}>
      {c.milestones.map((m, i) => {
        const a = i ? c.milestones[i - 1].dueDay : 0
        const share = Math.max(0, Math.min(1, (day - a) / (m.dueDay - a)))
        const verdict = m.status === 'proven' ? 'bg-proven' : m.status === 'missed' || m.status === 'rejected' ? 'bg-default' : null
        const live = m.status === 'review' ? 'bg-review' : 'bg-ink'
        return (
          <div key={m.n} className="relative h-full overflow-hidden rounded-[2px] bg-line-2" style={{ flex: m.dueDay - a }}>
            <div className={cn('absolute inset-y-0 left-0', verdict ?? live)} style={{ width: `${(verdict ? 1 : share) * 100}%` }} />
          </div>
        )
      })}
    </div>
  )
}

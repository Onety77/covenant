import type { Covenant } from '@/types'
import { cn } from '@/lib/cn'
import { dayOf, provenCount } from '@/lib/covenant'

/**
 * The covenant in one line: three stretches sized by their deadlines, each filled with
 * its verdict, or with time spent while it's running.
 */
export function Meter({ covenant: c, now, className }: { covenant: Covenant; now: number; className?: string }) {
  const day = dayOf(c, now)
  return (
    <div className={cn('flex h-1 w-full gap-[3px]', className)} role="img" aria-label={`${provenCount(c)} of 3 milestones proven`}>
      {c.milestones.map((m, i) => {
        const a = i ? c.milestones[i - 1].dueDay : 0
        const share = Math.max(0, Math.min(1, (day - a) / (m.dueDay - a)))
        const fill =
          m.status === 'proven' ? 'bg-proven' : m.status === 'missed' || m.status === 'rejected' ? 'bg-default' : m.status === 'review' ? 'bg-review' : 'bg-accent'
        const full = m.status === 'proven' || m.status === 'missed' || m.status === 'rejected'
        return (
          <div key={m.n} className="relative h-full overflow-hidden rounded-full bg-line-2" style={{ flex: m.dueDay - a }}>
            <div className={cn('absolute inset-y-0 left-0 rounded-full', fill)} style={{ width: `${(full ? 1 : share) * 100}%` }} />
          </div>
        )
      })}
    </div>
  )
}

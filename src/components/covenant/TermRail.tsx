import { Check, Hourglass, X } from 'lucide-react'
import type { Covenant, Milestone } from '@/types'
import { cn } from '@/lib/cn'
import { date, sol } from '@/lib/format'
import { TERM_DAYS, dueAt } from '@/lib/rules'
import { dayOf, statusLabel } from '@/lib/covenant'

interface Props {
  covenant: Covenant
  now: number
  /** labels above each lane instead of beside it, for narrow columns */
  stacked?: boolean
  className?: string
}

const verdictText = (m: Milestone) =>
  m.status === 'proven'
    ? 'text-proven'
    : m.status === 'review'
      ? 'text-review'
      : m.status === 'missed' || m.status === 'rejected'
        ? 'text-default'
        : m.status === 'open'
          ? 'text-accent'
          : 'text-ink-3'

/**
 * The covenant drawn as its 90-day term: three stretches ending in gates, and under them
 * what the builder has at stake. Yellow stripes are held, green is released, red is forfeit.
 * Columns are proportional to each milestone's time.
 */
export function TermRail({ covenant: c, now, stacked = false, className }: Props) {
  const day = dayOf(c, now)
  const bounds = c.milestones.map((m, i) => [i ? c.milestones[i - 1].dueDay : 0, m.dueDay] as const)
  const cols = bounds.map(([a, b]) => `${b - a}fr`).join(' ')
  const broke = c.state === 'defaulted' || c.state === 'succeeded'
  const fill = (a: number, b: number) => Math.max(0, Math.min(1, (day - a) / (b - a)))
  const at = (d: number) => `${(d / TERM_DAYS) * 100}%`
  const side = !stacked
  const row = cn('grid gap-2', side && 'sm:grid-cols-[132px_1fr] sm:items-center sm:gap-5')
  const head = cn('flex items-baseline justify-between gap-2', side && 'sm:block')

  return (
    <div className={cn('min-w-0 pr-2.5', className)}>
      <div className={row}>
        <div className={head}>
          <p className="label">Roadmap</p>
          <p className="font-mono text-[12px] text-ink-2">
            {c.state === 'fulfilled' ? 'Fulfilled' : broke ? `Defaulted day ${Math.round(day)}` : `Day ${Math.floor(day)}/${TERM_DAYS}`}
          </p>
        </div>
        <div className="grid min-w-0 gap-x-1" style={{ gridTemplateColumns: cols }}>
          {c.milestones.map((m, i) => {
            const share = fill(...bounds[i])
            const done = m.status === 'proven' || m.status === 'missed'
            const tone =
              m.status === 'proven' ? 'bg-proven' : m.status === 'missed' || m.status === 'rejected' ? 'bg-default' : m.status === 'review' ? 'bg-review' : 'bg-accent'
            return (
              <div key={m.n} className="min-w-0">
                <p className="flex min-w-0 items-baseline gap-1.5 pr-3">
                  <span className="font-mono text-[11px] text-ink-3">M{m.n}</span>
                  <span className="truncate text-[13px] font-medium max-sm:hidden">{m.title}</span>
                </p>
                <div className="relative mt-2 h-1.5 rounded-l-full bg-line-2">
                  <div className={cn('absolute inset-y-0 left-0 rounded-l-full', tone)} style={{ width: `${(done ? 1 : share) * 100}%` }} />
                  <Gate m={m} />
                </div>
                <p className="mt-2.5 flex min-w-0 flex-wrap items-baseline gap-x-2 pr-2">
                  <span className={cn('font-mono text-[11px] font-medium uppercase', verdictText(m))}>{statusLabel[m.status]}</span>
                  <span className="font-mono text-[11px] text-ink-4 max-sm:hidden">
                    D{m.dueDay} · {date(dueAt(c.startedAt, m.dueDay))}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className={row}>
          <div className={head}>
            <p className="label">Supply</p>
            <p className="font-mono text-[12px] text-ink-2">{c.escrowPct}% escrowed</p>
          </div>
          <div className="grid h-6 gap-x-1" style={{ gridTemplateColumns: cols }}>
            {c.milestones.map((m) => {
              const released = m.status === 'proven'
              const lost = broke && !released
              return (
                <div
                  key={m.n}
                  className={cn(
                    'flex min-w-0 items-center rounded-[4px] px-1.5',
                    released ? 'bg-proven text-[#04140b]' : 'held bg-raised text-ink',
                    lost && '[--held-c:rgb(255_77_77/0.7)]',
                  )}
                >
                  <span className={cn('truncate rounded-[3px] px-1 font-mono text-[10px] font-medium', !released && 'bg-[var(--rail-bg,var(--bg))]')}>
                    {m.releasePct}%<span className="max-sm:hidden"> {released ? 'released' : lost ? 'successor' : 'held'}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={row}>
          <div className={head}>
            <p className="label">Creator fees</p>
            <p className="font-mono text-[12px] text-ink-2">{sol(c.feesSol)}</p>
          </div>
          <div className="relative h-6 overflow-hidden rounded-[4px] bg-raised">
            <div className="absolute inset-y-0 left-0 flex" style={{ width: at(Math.max(day, 2)) }}>
              <div className="h-full bg-proven" style={{ width: `${(c.feesReleasedSol / Math.max(c.feesSol, 0.0001)) * 100}%` }} />
              <div className={cn('held h-full flex-1', broke && '[--held-c:rgb(255_77_77/0.7)]')} />
            </div>
          </div>
        </div>

        <div className={row}>
          <div className={head}>
            <p className="label">Bond</p>
            <p className="font-mono text-[12px] text-ink-2">{sol(c.bondSol, 0)}</p>
          </div>
          {broke && c.default ? (
            <div className="flex h-6 gap-1">
              <div className="held h-full rounded-[4px] bg-raised" style={{ width: at(day) }} />
              <div className="flex h-full min-w-0 flex-1 items-center rounded-[4px] bg-default px-2 font-mono text-[10px] font-medium text-on-default uppercase">
                <span className="truncate">Forfeit to holders</span>
              </div>
            </div>
          ) : (
            <div className={cn('flex h-6 items-center justify-end rounded-[4px] px-1.5', c.state === 'fulfilled' ? 'bg-proven' : 'held bg-raised')}>
              <span className={cn('truncate rounded-[3px] px-1 font-mono text-[10px] font-medium', c.state === 'fulfilled' ? 'text-[#04140b]' : 'bg-[var(--rail-bg,var(--bg))]')}>
                {c.state === 'fulfilled' ? 'Returned' : `Held to day ${TERM_DAYS}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** The gate at the end of a stretch: where verifiers decide. */
function Gate({ m }: { m: Milestone }) {
  const style =
    m.status === 'proven'
      ? 'bg-proven text-[#04140b]'
      : m.status === 'review'
        ? 'bg-review text-[#0b0e24]'
        : m.status === 'missed' || m.status === 'rejected'
          ? 'bg-default text-on-default'
          : 'bg-raised text-ink-3 ring-1 ring-line-2'
  const Icon = m.status === 'proven' ? Check : m.status === 'review' ? Hourglass : m.status === 'missed' || m.status === 'rejected' ? X : null
  return (
    <span aria-hidden className={cn('absolute top-1/2 right-0 grid size-5 translate-x-1/2 -translate-y-1/2 place-items-center rounded-[5px] shadow-[0_0_0_3px_var(--rail-bg,var(--bg))]', style)}>
      {Icon ? <Icon className="size-3" strokeWidth={3} /> : <span className="size-1 rounded-full bg-ink-4" />}
    </span>
  )
}

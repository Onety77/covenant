import { Check, Hourglass, X } from 'lucide-react'
import type { Covenant, Milestone } from '@/types'
import { cn } from '@/lib/cn'
import { date, sol } from '@/lib/format'
import { TERM_DAYS, dueAt } from '@/lib/rules'
import { dayOf, statusLabel } from '@/lib/covenant'

interface Props {
  covenant: Covenant
  now: number
  /** hide the value lanes (escrow, fees, bond) and show only the milestone track */
  lanes?: boolean
  className?: string
}

/**
 * The covenant drawn as its 90-day term: three milestone stretches ending in gates,
 * and under them what the builder has put up. Held value is hatched, released value
 * solid, forfeited value red. Columns are proportional to each milestone's time.
 */
export function TermRail({ covenant: c, now, lanes = true, className }: Props) {
  const day = dayOf(c, now)
  const bounds = c.milestones.map((m, i) => [i ? c.milestones[i - 1].dueDay : 0, m.dueDay] as const)
  const cols = bounds.map(([a, b]) => `${b - a}fr`).join(' ')
  const defaulted = c.state === 'defaulted' || c.state === 'succeeded'
  const fill = (a: number, b: number) => Math.max(0, Math.min(1, (day - a) / (b - a)))
  const at = (d: number) => `${(d / TERM_DAYS) * 100}%`

  return (
    <div className={cn('min-w-0 pr-3', className)}>
      <div className="grid gap-3 sm:grid-cols-[150px_1fr] sm:gap-4">
        <div className="flex items-baseline justify-between gap-2 sm:block">
          <p className="text-[12px] font-semibold">Roadmap</p>
          <p className="font-mono text-[11px] text-ink-3">{termNote(c, day)}</p>
        </div>
        <div className="grid min-w-0 gap-x-1" style={{ gridTemplateColumns: cols }}>
          {c.milestones.map((m, i) => (
            <Stretch key={m.n} m={m} start={c.startedAt} share={fill(...bounds[i])} />
          ))}
        </div>
      </div>

      {lanes && (
        <div className="mt-6 grid gap-4 border-t border-line pt-5">
          <Lane label="Escrowed supply" value={`${c.escrowPct}% of supply`}>
            <div className="grid h-full gap-x-1" style={{ gridTemplateColumns: cols }}>
              {c.milestones.map((m) => {
                const released = m.status === 'proven'
                const lost = defaulted && !released
                return (
                  <div
                    key={m.n}
                    className={cn(
                      'flex h-full min-w-0 items-center rounded-[5px] px-2 text-[11px] font-semibold whitespace-nowrap',
                      released ? 'bg-proven text-white dark:text-[#06180e]' : 'hatch border border-line-2 bg-surface text-ink-2',
                      lost && 'border-default/40 text-default [--hatch-c:color-mix(in_srgb,var(--default)_45%,transparent)]',
                    )}
                  >
                    <span className={cn('truncate rounded-[3px] px-1', !released && 'bg-surface')}>
                      {m.releasePct}%<span className="max-sm:hidden"> {released ? 'released' : lost ? 'to successor' : 'held'}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </Lane>

          <Lane label="Creator fees" value={`${sol(c.feesSol)} · ${sol(c.feesReleasedSol)} out`}>
            <div className="relative h-full rounded-[5px] bg-sunken">
              {/* fees accrue as the term runs: released share solid, the rest hatched */}
              <div className="absolute inset-y-0 left-0 flex overflow-hidden rounded-[5px]" style={{ width: at(Math.max(day, 2)) }}>
                <div className="h-full bg-proven" style={{ width: `${(c.feesReleasedSol / Math.max(c.feesSol, 0.0001)) * 100}%` }} />
                <div
                  className={cn('hatch h-full flex-1 border border-l-0 border-line-2 bg-surface', defaulted && 'border-default/40 [--hatch-c:color-mix(in_srgb,var(--default)_45%,transparent)]')}
                />
              </div>
            </div>
          </Lane>

          <Lane label="Bond" value={sol(c.bondSol, 0)}>
            {defaulted && c.default ? (
              <div className="flex h-full gap-1">
                <div className="hatch h-full rounded-[5px] border border-line-2 bg-surface" style={{ width: at(dayOf(c, now)) }} />
                <div className="flex h-full min-w-0 flex-1 items-center rounded-[5px] bg-default px-2 text-[11px] font-semibold whitespace-nowrap text-white">
                  <span className="truncate">Forfeit to holders</span>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  'flex h-full items-center justify-end rounded-[5px] px-2 text-[11px] font-semibold whitespace-nowrap',
                  c.state === 'fulfilled' ? 'bg-proven text-white dark:text-[#06180e]' : 'hatch border border-line-2 bg-surface text-ink-2',
                )}
              >
                <span className="truncate rounded-[3px] bg-surface px-1 dark:bg-inherit">{c.state === 'fulfilled' ? 'Returned to builder' : `Held until day ${TERM_DAYS}`}</span>
              </div>
            )}
          </Lane>

          <div className="flex justify-between font-mono text-[11px] text-ink-3 sm:ml-[166px]">
            <span>Day 0 · {date(c.startedAt)}</span>
            <span>Day {TERM_DAYS} · {date(dueAt(c.startedAt, TERM_DAYS))}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function termNote(c: Covenant, day: number) {
  if (c.state === 'fulfilled') return 'Fulfilled'
  if (c.state === 'defaulted' || c.state === 'succeeded') return `Defaulted on day ${Math.round(day)}`
  return `Day ${Math.floor(day)} of ${TERM_DAYS}`
}

function Stretch({ m, start, share }: { m: Milestone; start: string; share: number }) {
  const tone =
    m.status === 'proven' ? 'bg-proven' : m.status === 'review' ? 'bg-review' : m.status === 'missed' || m.status === 'rejected' ? 'bg-default' : 'bg-blue'
  const done = m.status === 'proven' || m.status === 'missed'
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-baseline gap-1.5 pr-3">
        <span className="font-mono text-[11px] font-medium text-ink-3">M{m.n}</span>
        <span className="truncate text-[13px] font-semibold max-sm:hidden">{m.title}</span>
      </div>
      <div className="relative mt-2 h-2.5 rounded-l-full bg-sunken">
        {/* time spent in this stretch; a decided milestone fills with its verdict */}
        <div className={cn('absolute inset-y-0 left-0 rounded-l-full', done ? tone : share > 0 ? 'bg-ink' : '')} style={{ width: `${(done ? 1 : share) * 100}%` }} />
        {share > 0 && share < 1 && !done && <span aria-hidden className="absolute -top-1 -bottom-1 w-[2px] rounded-full bg-ink" style={{ left: `calc(${share * 100}% - 1px)` }} />}
        <Gate m={m} />
      </div>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pr-2 sm:pr-4">
        <span className={cn('text-[12px] font-semibold', m.status === 'proven' ? 'text-proven' : m.status === 'review' ? 'text-review' : m.status === 'missed' || m.status === 'rejected' ? 'text-default' : 'text-ink-2')}>
          {statusLabel[m.status]}
        </span>
        <span className="font-mono text-[11px] text-ink-3 max-sm:hidden">
          due day {m.dueDay} · {date(dueAt(start, m.dueDay))}
        </span>
      </div>
    </div>
  )
}

/** The gate at the end of a stretch: where verifiers decide. */
function Gate({ m }: { m: Milestone }) {
  const style =
    m.status === 'proven'
      ? 'bg-proven text-white border-proven'
      : m.status === 'review'
        ? 'bg-review text-white border-review'
        : m.status === 'missed' || m.status === 'rejected'
          ? 'bg-default text-white border-default'
          : 'bg-surface text-ink-3 border-line-2'
  const Icon = m.status === 'proven' ? Check : m.status === 'review' ? Hourglass : m.status === 'missed' || m.status === 'rejected' ? X : null
  return (
    <span
      aria-hidden
      className={cn('absolute top-1/2 right-0 grid size-[22px] translate-x-1/2 -translate-y-1/2 place-items-center rounded-[6px] border-2 shadow-[0_0_0_3px_var(--bg)]', style)}
    >
      {Icon ? <Icon className="size-3" strokeWidth={3} /> : <span className="size-1.5 rounded-[2px] bg-ink-4" />}
    </span>
  )
}

function Lane({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-4">
      <div className="flex items-baseline justify-between gap-2 sm:block">
        <p className="text-[12px] font-semibold">{label}</p>
        <p className="font-mono text-[11px] text-ink-3">{value}</p>
      </div>
      <div className="h-7 min-w-0">{children}</div>
    </div>
  )
}

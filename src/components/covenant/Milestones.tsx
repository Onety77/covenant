import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, ChevronDown, Hourglass, X } from 'lucide-react'
import type { Covenant, Milestone, Proof } from '@/types'
import { cn } from '@/lib/cn'
import { ago, date, left } from '@/lib/format'
import { due, statusLabel, tally } from '@/lib/covenant'
import { PanelVotes } from './PanelVotes'
import { VoteDots } from './VoteDots'

interface Props {
  covenant: Covenant
  now: number
  /** link for a milestone's open review, when there is one */
  reviewHref?: (m: Milestone) => string | undefined
  /** show only these milestones (default: all three) */
  only?: number[]
  className?: string
}

const textTone = { proven: 'text-proven', review: 'text-review', default: 'text-default', accent: 'text-accent', 'ink-3': 'text-ink-3' } as const

const tone = (m: Milestone): keyof typeof textTone =>
  m.status === 'proven' ? 'proven' : m.status === 'review' ? 'review' : m.status === 'missed' || m.status === 'rejected' ? 'default' : m.status === 'open' ? 'accent' : 'ink-3'

/**
 * The three milestones as a timeline: each one's test, deadline and what it releases,
 * then the builder's proof and how the verifiers voted.
 */
export function Milestones({ covenant: c, now, reviewHref, only, className }: Props) {
  const list = c.milestones.filter((m) => !only || only.includes(m.n))
  return (
    <ol className={cn('relative', className)}>
      {list.map((m, i) => (
        <Item key={m.n} c={c} m={m} now={now} last={i === list.length - 1} href={reviewHref?.(m)} />
      ))}
    </ol>
  )
}

function Item({ c, m, now, last, href }: { c: Covenant; m: Milestone; now: number; last: boolean; href?: string }) {
  const dueIso = due(c, m)
  const t = tally(m.panel)
  const [votesOpen, setVotesOpen] = useState(m.status === 'review')
  const [attemptsOpen, setAttemptsOpen] = useState(false)
  const Icon = m.status === 'proven' ? Check : m.status === 'review' ? Hourglass : m.status === 'missed' || m.status === 'rejected' ? X : null
  const k = tone(m)

  return (
    <li id={`m${m.n}`} className="relative grid scroll-mt-24 grid-cols-[28px_1fr] gap-x-4 pb-10 last:pb-0">
      {!last && <span aria-hidden className="absolute top-8 bottom-1 left-[13.5px] w-px bg-line-2" />}
      <span
        aria-hidden
        className={cn(
          'relative grid size-7 place-items-center rounded-[7px] font-mono text-[11px] font-medium',
          k === 'proven' && 'bg-proven text-[#04140b]',
          k === 'review' && 'bg-review text-[#0b0e24]',
          k === 'default' && 'bg-default text-on-default',
          k === 'accent' && 'bg-accent text-on-accent',
          k === 'ink-3' && 'bg-raised text-ink-3',
        )}
      >
        {Icon ? <Icon className="size-3.5" strokeWidth={3} /> : `M${m.n}`}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className={cn('text-[17px] font-semibold tracking-[-0.01em]', m.status === 'locked' && 'text-ink-2')}>
            <span className="mr-2 font-mono text-[12px] font-normal text-ink-3">M{m.n}</span>
            {m.title}
          </h3>
          <span className={cn('font-mono text-[11px] font-medium uppercase', textTone[k])}>{statusLabel[m.status]}</span>
        </div>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-2">{m.measure}</p>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px]">
          {[
            ['Target', m.target],
            ['Due', `D${m.dueDay} · ${date(dueIso)}`],
            ['Left', m.status === 'proven' ? 'done' : m.status === 'missed' ? 'passed' : left(dueIso, now)],
            ['Releases', `${m.releasePct}% supply`],
          ].map(([a, b]) => (
            <div key={a} className="flex gap-1.5">
              <dt className="text-ink-4 uppercase">{a}</dt>
              <dd className="text-ink">{b}</dd>
            </div>
          ))}
        </dl>

        {m.proof && <ProofBlock proof={m.proof} now={now} late={Date.parse(m.proof.submittedAt) > Date.parse(dueIso)} />}

        {m.panel && (
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <button onClick={() => setVotesOpen(!votesOpen)} aria-expanded={votesOpen} className="flex items-center gap-2.5 text-[13px] text-ink-2 hover-device:hover:text-ink">
                <VoteDots panel={m.panel} />
                {m.status === 'review' ? (
                  <span>
                    {t.approve}/{t.needed} approvals · closes <span className="font-mono tabular">{left(m.reviewClosesAt!, now)}</span>
                  </span>
                ) : m.status === 'proven' ? (
                  <span>
                    Approved {t.approve}–{t.reject} · {ago(m.decidedAt!, now)}
                  </span>
                ) : (
                  <span>
                    Rejected {t.reject}–{t.approve} · {ago(m.decidedAt!, now)}
                  </span>
                )}
                <ChevronDown className={cn('size-4 transition-transform', votesOpen && 'rotate-180')} />
              </button>
              {href && (
                <Link to={href} className="text-[13px] font-semibold text-accent hover-device:hover:underline sm:ml-auto">
                  Review as verifier
                </Link>
              )}
            </div>
            {votesOpen && <PanelVotes panel={m.panel} now={now} className="mt-4" />}
          </div>
        )}

        {m.status === 'open' && <p className="mt-4 text-[13px] text-ink-3">Waiting for proof. If none is approved by {date(dueIso)}, the covenant defaults.</p>}
        {m.status === 'missed' && <p className="mt-4 text-[13px] font-medium text-default">No approved proof by day {m.dueDay}. The covenant defaulted.</p>}

        {m.attempts && m.attempts.length > 0 && (
          <div className="mt-4">
            <button onClick={() => setAttemptsOpen(!attemptsOpen)} aria-expanded={attemptsOpen} className="flex items-center gap-1.5 text-[13px] text-ink-3 hover-device:hover:text-ink">
              <ChevronDown className={cn('size-4 transition-transform', attemptsOpen && 'rotate-180')} />
              {m.attempts.length} earlier attempt{m.attempts.length > 1 ? 's' : ''} rejected
            </button>
            {attemptsOpen &&
              m.attempts.map((a) => (
                <div key={a.decidedAt} className="mt-3 border-l-2 border-default/40 pl-4">
                  <ProofBlock proof={a.proof} now={now} />
                  <PanelVotes panel={a.panel} now={now} className="mt-4" />
                </div>
              ))}
          </div>
        )}
      </div>
    </li>
  )
}

function ProofBlock({ proof, now, late }: { proof: Proof; now: number; late?: boolean }) {
  return (
    <div className="mt-4 rounded-[12px] bg-surface p-4">
      <p className="label">
        Proof · {ago(proof.submittedAt, now)}
        {late && <span className="text-default"> · after the deadline</span>}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed">{proof.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {proof.readings.map((r) => (
          <span key={r.k} className="inline-flex items-baseline gap-2 rounded-[6px] bg-raised px-2 py-1 text-[12px]">
            <span className="text-ink-3">{r.k}</span>
            <span className="font-mono font-medium">{r.v}</span>
          </span>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {proof.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover-device:hover:underline">
              {l.label} <ArrowUpRight className="size-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

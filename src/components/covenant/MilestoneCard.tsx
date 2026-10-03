import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import type { Covenant, Milestone, Proof } from '@/types'
import { cn } from '@/lib/cn'
import { ago, date, left } from '@/lib/format'
import { due, statusLabel, statusTone, tally } from '@/lib/covenant'
import { Tag } from '@/components/ui/Tag'
import { PanelVotes } from './PanelVotes'
import { VoteDots } from './VoteDots'

interface Props {
  covenant: Covenant
  milestone: Milestone
  now: number
  /** link to the verifier's review page, when there is one */
  reviewHref?: string
  className?: string
}

/**
 * One milestone as a clause of the covenant: the measurable test, its deadline and what it
 * releases, then the builder's proof and the panel's verdicts.
 */
export function MilestoneCard({ covenant: c, milestone: m, now, reviewHref, className }: Props) {
  const dueIso = due(c, m)
  const t = tally(m.panel)
  const [showAttempts, setShowAttempts] = useState(false)
  const quiet = m.status === 'locked'
  return (
    <article id={`m${m.n}`} className={cn('scroll-mt-24 rounded-card border bg-surface', m.status === 'missed' || m.status === 'rejected' ? 'border-default/40' : 'border-line', className)}>
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-[8px] font-mono text-[13px] font-medium', quiet ? 'bg-sunken text-ink-3' : 'bg-ink text-bg')}>M{m.n}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <h3 className={cn('text-[18px] font-semibold tracking-[-0.01em]', quiet && 'text-ink-2')}>{m.title}</h3>
              <Tag tone={statusTone[m.status]}>{statusLabel[m.status]}</Tag>
            </div>
            <p className="mt-2 border-l-2 border-line-2 pl-3 text-[15px] leading-relaxed text-ink-2">{m.measure}</p>
          </div>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:ml-13 sm:grid-cols-4">
          <Fact k="Target" v={m.target} />
          <Fact k={`Due · day ${m.dueDay}`} v={date(dueIso)} />
          <Fact k="Time left" v={m.status === 'proven' ? 'Done' : m.status === 'missed' ? 'Passed' : left(dueIso, now)} mono />
          <Fact k="Releases" v={`${m.releasePct}% of supply`} />
        </dl>
      </div>

      {m.proof && (
        <ProofBlock proof={m.proof} now={now} late={Date.parse(m.proof.submittedAt) > Date.parse(dueIso)} />
      )}

      {m.panel && (
        <div className="border-t border-line px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="label">Verifier panel</p>
            <VoteDots panel={m.panel} />
            <p className="text-[13px] text-ink-2">
              {m.status === 'review' ? (
                <>
                  {t.approve} of {t.needed} approvals so far · closes in <span className="font-mono tabular">{left(m.reviewClosesAt!, now)}</span>
                </>
              ) : m.status === 'proven' ? (
                <>Approved {t.approve}–{t.reject} · {ago(m.decidedAt!, now)}</>
              ) : (
                <>Rejected {t.reject}–{t.approve} · {ago(m.decidedAt!, now)}</>
              )}
            </p>
            {reviewHref && (
              <Link to={reviewHref} className="ml-auto text-[13px] font-semibold text-blue-text hover-device:hover:underline">
                Review as verifier
              </Link>
            )}
          </div>
          <PanelVotes panel={m.panel} now={now} className="mt-2" />
        </div>
      )}

      {m.status === 'open' && (
        <p className="border-t border-line px-5 py-3.5 text-[13px] text-ink-2 sm:px-6">
          Waiting for proof. If none is approved by {date(dueIso)}, the covenant defaults.
        </p>
      )}
      {m.status === 'missed' && (
        <p className="border-t border-default/30 bg-default-soft px-5 py-3.5 text-[13px] font-medium text-default sm:px-6">
          No approved proof by day {m.dueDay}. The covenant defaulted.
        </p>
      )}

      {m.attempts && m.attempts.length > 0 && (
        <div className="border-t border-line">
          <button onClick={() => setShowAttempts(!showAttempts)} aria-expanded={showAttempts} className="flex w-full items-center gap-2 px-5 py-3 text-left text-[13px] font-medium text-ink-2 hover-device:hover:text-ink sm:px-6">
            <ChevronDown className={cn('size-4 transition-transform', showAttempts && 'rotate-180')} />
            {m.attempts.length} earlier attempt{m.attempts.length > 1 ? 's' : ''} rejected
          </button>
          {showAttempts &&
            m.attempts.map((a) => (
              <div key={a.decidedAt} className="border-t border-line bg-raised">
                <ProofBlock proof={a.proof} now={now} />
                <div className="px-5 pb-3 sm:px-6">
                  <PanelVotes panel={a.panel} now={now} />
                </div>
              </div>
            ))}
        </div>
      )}
    </article>
  )
}

function Fact({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="label">{k}</dt>
      <dd className={cn('mt-0.5 truncate text-[14px] font-medium', mono && 'font-mono text-[13px] tabular')}>{v}</dd>
    </div>
  )
}

function ProofBlock({ proof, now, late }: { proof: Proof; now: number; late?: boolean }) {
  return (
    <div className="border-t border-line px-5 py-4 sm:px-6">
      <p className="label">
        Proof · sent {ago(proof.submittedAt, now)}
        {late && <span className="text-default"> · after the deadline</span>}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed">{proof.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {proof.readings.map((r) => (
          <span key={r.k} className="inline-flex items-baseline gap-2 rounded-[6px] bg-sunken px-2.5 py-1.5 text-[12px]">
            <span className="text-ink-3">{r.k}</span>
            <span className="font-mono font-medium">{r.v}</span>
          </span>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {proof.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="inline-flex items-center gap-1 text-[13px] font-medium text-blue-text hover-device:hover:underline">
              {l.label} <ArrowUpRight className="size-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

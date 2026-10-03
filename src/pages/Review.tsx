import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { me } from '@/data/verifiers'
import { clock, date } from '@/lib/format'
import { due, tally } from '@/lib/covenant'
import { sampleNowMs, useNow } from '@/lib/live'
import { findReview, withMine } from '@/lib/reviews'
import { castVote, myVotes } from '@/lib/session'
import { Notice } from '@/components/ui/Notice'
import { TokenArt } from '@/components/ui/TokenArt'
import { Milestones } from '@/components/covenant/Milestones'
import { VerdictForm } from '@/components/verify/VerdictForm'

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/** One review: the claim and its evidence on the left, your verdict always in reach on the right. */
export function Review() {
  const { id = '' } = useParams()
  const now = useNow()
  const item = findReview(id)
  const votes = myVotes.use()

  if (!item || item.milestone.status !== 'review') {
    return (
      <div className="wrap">
        <Notice title="This review isn’t open." body="It may have been decided already, or the link is wrong.">
          <Link to="/verify" className="mt-4 text-sm font-semibold text-accent hover:underline">
            Back to the queue
          </Link>
        </Notice>
      </div>
    )
  }

  const { project: p, milestone: m } = item
  const panel = withMine(m.panel, me.id, votes[id])
  const seat = panel.find((v) => v.verifierId === me.id)
  const t = tally(panel)
  const closes = m.reviewClosesAt!
  const closed = Date.parse(closes) <= now
  const lateRisk = Date.parse(due(p.covenant, m)) < Date.parse(closes)
  const covenant = { ...p.covenant, milestones: p.covenant.milestones.map((x) => (x.n === m.n ? { ...m, panel } : x)) }

  return (
    <div className="wrap pt-5 pb-24 lg:pt-8 lg:pb-16">
      <Link to="/verify" className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-3 hover-device:hover:text-ink">
        <ChevronLeft className="size-4" /> Verify
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3.5">
          <TokenArt seed={p.ticker} size={52} />
          <div className="min-w-0">
            <p className="text-[13px] text-ink-3">
              <Link to={`/p/${p.id}`} className="font-semibold text-ink-2 hover-device:hover:text-ink">
                {p.name}
              </Link>{' '}
              · milestone {m.n} of 3
            </p>
            <h1 className="mt-1 text-h1">{m.title}</h1>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="label">Review closes in</p>
          <p className="mt-1 font-mono text-[22px] font-medium tabular">{clock(closes, now)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-8">
          {lateRisk && (
            <p className="mb-8 rounded-[14px] bg-review-soft p-4 text-[14px] leading-relaxed">
              The milestone is due {date(due(p.covenant, m))}, before this review closes. Proof was sent in time, so it counts. Judge it as if the deadline hadn’t passed.
            </p>
          )}
          <Milestones covenant={covenant} now={now} only={[m.n]} />
        </div>
        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            {seat ? (
              <VerdictForm
                cast={seat.verdict ? { verdict: seat.verdict, note: seat.note ?? '' } : undefined}
                closed={closed}
                onSubmit={async (verdict, note) => {
                  await wait(900)
                  castVote(id, { verdict, note, at: sampleNowMs() })
                }}
              />
            ) : (
              <Notice className="py-0" title="You’re not on this panel." body="Only the five drawn verifiers can vote. You can still read the evidence." />
            )}
            <p className="px-1 text-[13px] leading-relaxed text-ink-2">
              <span className="font-semibold text-ink">{t.approve}</span> approve, <span className="font-semibold text-ink">{t.reject}</span> reject, {t.pending} still to vote. {t.needed} matching verdicts decide it.
              Approval releases {m.releasePct}% of supply and this stretch’s fees to the builder.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

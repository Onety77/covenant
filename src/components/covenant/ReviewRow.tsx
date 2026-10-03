import { Link } from 'react-router-dom'
import type { ReviewItem } from '@/lib/reviews'
import { ago, left } from '@/lib/format'
import { tally } from '@/lib/covenant'
import { TokenMark } from '@/components/ui/TokenMark'
import { VoteDots } from './VoteDots'

/** A milestone waiting on verifiers: the claim, the panel so far, and the time left. */
export function ReviewRow({ item, now }: { item: ReviewItem; now: number }) {
  const { project: p, milestone: m } = item
  const t = tally(m.panel)
  return (
    <Link to={`/verify/${item.id}`} className="flex items-center gap-4 px-5 py-4 hover-device:hover:bg-hover">
      <TokenMark ticker={p.ticker} size={36} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">
          {p.name} <span className="font-mono text-[12px] font-normal text-ink-3">M{m.n}</span>
        </p>
        <p className="truncate text-[13px] text-ink-2">{m.title} <span className="text-ink-3">· proof sent {ago(m.proof!.submittedAt, now)}</span></p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <VoteDots panel={m.panel} />
        <p className="font-mono text-[11px] text-ink-3 tabular">
          {t.approve}/{t.needed} · {left(m.reviewClosesAt!, now)}
        </p>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import type { ReviewItem } from '@/lib/reviews'
import type { Vote } from '@/types'
import { ago, left } from '@/lib/format'
import { tally } from '@/lib/covenant'
import { TokenArt } from '@/components/ui/TokenArt'
import { VoteDots } from './VoteDots'

/** A milestone waiting on verifiers: the claim, the panel so far, and the time left. */
export function ReviewRow({ item, now, panel }: { item: ReviewItem; now: number; panel?: Vote[] }) {
  const { project: p, milestone: m } = item
  const votes = panel ?? m.panel
  const t = tally(votes)
  return (
    <Link to={`/verify/${item.id}`} className="flex items-center gap-3.5 rounded-[12px] p-3 hover-device:hover:bg-hover">
      <TokenArt seed={p.ticker} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">
          {p.name} <span className="font-mono text-[12px] font-normal text-ink-3">M{m.n}</span>
        </p>
        <p className="truncate text-[13px] text-ink-2">
          {m.title} <span className="text-ink-3">· proof {ago(m.proof!.submittedAt, now)}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <VoteDots panel={votes} />
        <p className="font-mono text-[11px] text-ink-3 tabular">
          {t.approve}/{t.needed} · {left(m.reviewClosesAt!, now)}
        </p>
      </div>
    </Link>
  )
}

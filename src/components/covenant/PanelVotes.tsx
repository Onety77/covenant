import type { Vote } from '@/types'
import { cn } from '@/lib/cn'
import { ago } from '@/lib/format'
import { getVerifier, me } from '@/data/verifiers'

/** Each verifier on the panel, their verdict and their reason. */
export function PanelVotes({ panel, now, className }: { panel: Vote[]; now: number; className?: string }) {
  return (
    <ul className={cn('grid gap-3', className)}>
      {panel.map((v) => {
        const who = getVerifier(v.verifierId)
        return (
          <li key={v.verifierId} className="flex gap-3">
            <span aria-hidden className={cn('mt-[5px] size-2 shrink-0 rounded-[2px]', v.verdict === 'approve' ? 'bg-proven' : v.verdict === 'reject' ? 'bg-default' : 'bg-line-2')} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
                <span className="font-semibold">{who?.handle}</span>
                {v.verifierId === me.id && <span className="text-ink-3">(you)</span>}
                <span className={cn('font-mono text-[11px] uppercase', v.verdict === 'approve' ? 'text-proven' : v.verdict === 'reject' ? 'text-default' : 'text-ink-3')}>
                  {v.verdict === 'approve' ? 'Approved' : v.verdict === 'reject' ? 'Rejected' : 'Reviewing'}
                </span>
                {v.at && <span className="ml-auto font-mono text-[11px] text-ink-4">{ago(v.at, now)}</span>}
              </p>
              {v.note && <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{v.note}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

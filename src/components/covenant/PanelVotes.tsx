import type { Vote } from '@/types'
import { cn } from '@/lib/cn'
import { ago } from '@/lib/format'
import { getVerifier } from '@/data/verifiers'
import { Tag } from '@/components/ui/Tag'

/** Each verifier on the panel, their verdict and their reason. */
export function PanelVotes({ panel, now, className }: { panel: Vote[]; now: number; className?: string }) {
  return (
    <ul className={cn('divide-y divide-line', className)}>
      {panel.map((v) => {
        const who = getVerifier(v.verifierId)
        return (
          <li key={v.verifierId} className="flex gap-3 py-3">
            <span aria-hidden className={cn('mt-1.5 size-2 shrink-0 rounded-[2px]', v.verdict === 'approve' ? 'bg-proven' : v.verdict === 'reject' ? 'bg-default' : 'border border-line-2')} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
                <span className="font-semibold">{who?.handle}</span>
                {v.verdict ? (
                  <Tag tone={v.verdict === 'approve' ? 'proven' : 'default'} dot={false} className="h-5 px-1.5 text-[11px]">
                    {v.verdict === 'approve' ? 'Approved' : 'Rejected'}
                  </Tag>
                ) : (
                  <span className="text-ink-3">Reviewing</span>
                )}
                {v.at && <span className="ml-auto font-mono text-[11px] text-ink-3">{ago(v.at, now)}</span>}
              </p>
              {v.note && <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{v.note}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

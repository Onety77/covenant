import { Link } from 'react-router-dom'
import { me } from '@/data/verifiers'
import { cn } from '@/lib/cn'
import { ago, pct, sol } from '@/lib/format'
import { tally } from '@/lib/covenant'
import { useDemoState } from '@/lib/hooks'
import { useNow } from '@/lib/live'
import { decidedReviews, openReviews, withMine } from '@/lib/reviews'
import { NEEDED, PANEL } from '@/lib/rules'
import { myVotes } from '@/lib/session'
import { ReviewRow } from '@/components/covenant/ReviewRow'
import { Notice } from '@/components/ui/Notice'
import { TokenArt } from '@/components/ui/TokenArt'
import { useTitle } from '@/lib/useTitle'

/** The verifier's desk: reviews waiting on you, ones you've voted on, and recent decisions. */
export function Verify() {
  useTitle('Verify')
  const now = useNow()
  const state = useDemoState()
  const votes = myVotes.use()
  const open = state === 'empty' ? [] : openReviews().map((r) => ({ ...r, panel: withMine(r.milestone.panel, me.id, votes[r.id]) }))
  const mine = open.filter((r) => r.panel.some((v) => v.verifierId === me.id))
  const waiting = mine.filter((r) => !r.panel.find((v) => v.verifierId === me.id)?.verdict)
  const voted = mine.filter((r) => r.panel.find((v) => v.verifierId === me.id)?.verdict)
  const decided = decidedReviews().slice(0, 8)

  return (
    <div className="wrap pt-8 pb-16 lg:pt-12">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <h1 className="text-h1">Verify</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Judge the proof against the measure as written. {PANEL} staked verifiers per review, {NEEDED} matching verdicts decide. Votes on the losing side cost agreement, and repeated ones cost stake.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-4 lg:col-span-5">
          {[
            ['Verifying as', me.handle],
            ['Agreement', pct(me.agreement, 0)],
            ['Stake', sol(me.stakeSol, 0)],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="label">{k}</dt>
              <dd className="mt-1.5 truncate font-mono text-[17px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <Group title="Waiting on you" count={waiting.length}>
            {state === 'loading' ? (
              <div className="grid gap-2">
                <div className="skeleton h-16" />
                <div className="skeleton h-16" />
              </div>
            ) : state === 'error' ? (
              <Notice kind="error" title="The queue didn’t load." body="Your stake and past verdicts are safe. Try again in a moment." action="Try again" onAction={() => location.reload()} />
            ) : waiting.length ? (
              <ul className="-mx-3">
                {waiting.map((r) => (
                  <li key={r.id}>
                    <ReviewRow item={r} now={now} panel={r.panel} />
                  </li>
                ))}
              </ul>
            ) : (
              <Notice className="py-4" title="You’re all caught up." body="New proof shows up here as soon as a builder submits it and you’re drawn for the panel." />
            )}
          </Group>

          {voted.length > 0 && (
            <Group title="Voted, still open" count={voted.length}>
              <ul className="-mx-3">
                {voted.map((r) => (
                  <li key={r.id}>
                    <ReviewRow item={r} now={now} panel={r.panel} mine={r.panel.find((x) => x.verifierId === me.id)?.verdict} />
                  </li>
                ))}
              </ul>
            </Group>
          )}
        </div>

        <div className="lg:col-span-5">
          <Group title="Recently decided" count={decided.length}>
            <ul className="-mx-3">
              {decided.map((r) => {
                const t = tally(r.milestone.panel)
                const ok = r.milestone.status === 'proven'
                return (
                  <li key={`${r.id}-${r.milestone.decidedAt}`}>
                    <Link to={`/p/${r.project.id}`} className="flex items-center gap-3 rounded-[12px] p-3 hover-device:hover:bg-hover">
                      <TokenArt seed={r.project.ticker} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium">
                          {r.project.name} · {r.milestone.title}
                        </p>
                        <p className="font-mono text-[11px] text-ink-3">{ago(r.milestone.decidedAt!, now)}</p>
                      </div>
                      <span className="flex items-center gap-1.5 text-[12px] text-ink-2"><span aria-hidden className={cn('size-1.5 rounded-full', ok ? 'bg-proven' : 'bg-default')} />
                        {ok ? 'Approved' : 'Rejected'} {ok ? t.approve : t.reject}–{ok ? t.reject : t.approve}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Group>
        </div>
      </div>
    </div>
  )
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2 text-[15px] tracking-[-0.03em]">
        {title} <span className="font-mono text-[12px] font-normal tracking-normal text-ink-3">{count}</span>
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

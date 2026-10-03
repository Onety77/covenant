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
import { VoteDots } from '@/components/covenant/VoteDots'
import { Notice } from '@/components/ui/Notice'
import { Tag } from '@/components/ui/Tag'
import { TokenMark } from '@/components/ui/TokenMark'

/** The verifier's desk: reviews waiting on you, ones you've voted on, and recent decisions. */
export function Verify() {
  const now = useNow()
  const state = useDemoState()
  const votes = myVotes.use()
  const open = state === 'empty' ? [] : openReviews().map((r) => ({ ...r, panel: withMine(r.milestone.panel, me.id, votes[r.id]) }))
  const mine = open.filter((r) => r.panel.some((v) => v.verifierId === me.id))
  const waiting = mine.filter((r) => !r.panel.find((v) => v.verifierId === me.id)?.verdict)
  const voted = mine.filter((r) => r.panel.find((v) => v.verifierId === me.id)?.verdict)
  const decided = decidedReviews().slice(0, 8)

  return (
    <div className="wrap pt-10 pb-20 lg:pt-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label">Verify</p>
          <h1 className="mt-3 text-h1">Judge the proof, not the project.</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
            Each review goes to a panel of {PANEL} staked verifiers. {NEEDED} matching verdicts decide it. Verdicts that end up on the losing side cost agreement, and repeated ones cost stake.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-card border border-line bg-line lg:col-span-5">
          {[
            ['Verifying as', me.handle],
            ['Agreement', pct(me.agreement, 0)],
            ['Stake', sol(me.stakeSol, 0)],
          ].map(([k, v]) => (
            <div key={k} className="bg-surface px-4 py-3.5">
              <dt className="label">{k}</dt>
              <dd className="mt-1 truncate font-mono text-[15px] font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <Group title="Waiting on your verdict" count={waiting.length}>
            {state === 'loading' ? (
              <Skeleton />
            ) : state === 'error' ? (
              <Notice kind="error" title="The queue didn’t load." body="Your stake and past verdicts are safe. Try again in a moment." action="Try again" onAction={() => location.reload()} />
            ) : waiting.length ? (
              <List>
                {waiting.map((r) => (
                  <li key={r.id}>
                    <ReviewRow item={r} now={now} />
                  </li>
                ))}
              </List>
            ) : (
              <Notice title="You’re all caught up." body="New proof lands here as soon as a builder submits it and you’re drawn for the panel." />
            )}
          </Group>

          {voted.length > 0 && (
            <Group title="Voted, still open" count={voted.length}>
              <List>
                {voted.map((r) => {
                  const v = r.panel.find((x) => x.verifierId === me.id)!
                  return (
                    <li key={r.id}>
                      <Link to={`/verify/${r.id}`} className="flex items-center gap-4 px-5 py-4 hover-device:hover:bg-hover">
                        <TokenMark ticker={r.project.ticker} size={36} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold">
                            {r.project.name} <span className="font-mono text-[12px] font-normal text-ink-3">M{r.milestone.n}</span>
                          </p>
                          <p className="truncate text-[13px] text-ink-2">{r.milestone.title}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <VoteDots panel={r.panel} />
                          <Tag tone={v.verdict === 'approve' ? 'proven' : 'default'} dot={false} className="h-5 px-1.5 text-[11px]">
                            You {v.verdict === 'approve' ? 'approved' : 'rejected'}
                          </Tag>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </List>
            </Group>
          )}
        </div>

        <div className="lg:col-span-5">
          <Group title="Recently decided" count={decided.length}>
            <List>
              {decided.map((r) => {
                const t = tally(r.milestone.panel)
                const ok = r.milestone.status === 'proven'
                return (
                  <li key={`${r.id}-${r.milestone.decidedAt}`}>
                    <Link to={`/p/${r.project.id}#m${r.milestone.n}`} className="flex items-center gap-3 px-5 py-3.5 hover-device:hover:bg-hover">
                      <span aria-hidden className={cn('size-2 shrink-0 rounded-[2px]', ok ? 'bg-proven' : 'bg-default')} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium">
                          {r.project.name} · {r.milestone.title}
                        </p>
                        <p className="font-mono text-[11px] text-ink-3">
                          {ok ? 'Approved' : 'Rejected'} {ok ? t.approve : t.reject}–{ok ? t.reject : t.approve} · {ago(r.milestone.decidedAt!, now)}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </List>
          </Group>
        </div>
      </div>
    </div>
  )
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2 font-sans text-[15px] font-semibold">
        {title} <span className="font-mono text-[12px] font-normal text-ink-3">{count}</span>
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

const List = ({ children }: { children: React.ReactNode }) => <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface">{children}</ul>

const Skeleton = () => (
  <div className="overflow-hidden rounded-card border border-line bg-surface">
    {[0, 1].map((i) => (
      <div key={i} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
        <div className="skeleton size-9" />
        <div className="flex-1">
          <div className="skeleton h-3.5 w-32" />
          <div className="skeleton mt-2 h-3 w-48" />
        </div>
      </div>
    ))}
  </div>
)

import { useState } from 'react'
import type { Project, Takeover } from '@/types'
import { ago, left } from '@/lib/format'
import { BOND_SOL } from '@/lib/rules'
import { myTakeovers } from '@/lib/session'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/components/layout/wallet'

interface Props {
  project: Project
  now: number
  onOffer: (plan: string, schedule: number[]) => Promise<void>
}

/**
 * Replacement builders offering to carry the roadmap: each posts a fresh bond and new
 * deadlines for the milestones still owed.
 */
export function Takeovers({ project: p, now, onOffer }: Props) {
  const d = p.covenant.default!
  const owed = p.covenant.milestones.filter((m) => m.status !== 'proven')
  const mine = myTakeovers.use()[p.id]
  const offers: (Takeover & { mine?: boolean })[] = [...d.takeovers, ...(mine ? [{ ...mine, mine: true }] : [])]
  const [open, setOpen] = useState(false)
  const closed = Date.parse(d.redemptionClosesAt) <= now

  return (
    <div>
      <ul className="grid gap-3">
        {offers.map((o) => (
          <li key={o.id} className="rounded-[14px] bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[15px] font-semibold">{o.builder.handle}</p>
              {o.mine && <span className="rounded-[5px] bg-raised px-1.5 py-0.5 text-[11px] text-ink-2">Your offer</span>}
              <span className="font-mono text-[11px] text-ink-3">{o.builder.wallet}</span>
              <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-ink-2">
                <span aria-hidden className="held h-3.5 w-5 rounded-[3px] bg-raised" /> {o.bondSol} SOL bond posted
              </span>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{o.plan}</p>
            <ol className="mt-3 flex flex-wrap gap-2">
              {owed.map((m, i) => (
                <li key={m.n} className="rounded-[6px] bg-raised px-2.5 py-1 text-[12px]">
                  <span className="font-mono text-ink-3">M{m.n}</span> {m.title} <span className="font-mono text-ink-3">· day {o.schedule[i]}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 font-mono text-[11px] text-ink-3">{ago(o.at, now)}</p>
          </li>
        ))}
      </ul>

      {!mine && !closed && (
        <div className="mt-4">
          {open ? (
            <OfferForm owed={owed.map((m) => m.title)} onCancel={() => setOpen(false)} onSubmit={onOffer} />
          ) : (
            <Button onClick={() => setOpen(true)}>Offer to take over</Button>
          )}
        </div>
      )}
      <p className="mt-4 text-[13px] text-ink-3">
        {closed ? 'The window has closed.' : `Offers close with the redemption window, in ${left(d.redemptionClosesAt, now)}.`} One offer takes the roadmap over; the other bonds are returned.
      </p>
    </div>
  )
}

function OfferForm({ owed, onCancel, onSubmit }: { owed: string[]; onCancel: () => void; onSubmit: (plan: string, schedule: number[]) => Promise<void> }) {
  const { address, connect } = useWallet()
  const [plan, setPlan] = useState('')
  const [days, setDays] = useState(owed.map((_, i) => 30 * (i + 1)))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const valid = plan.trim().length >= 20 && days.every((d, i) => d >= 7 && d <= 90 && (i === 0 || d > days[i - 1]))

  return (
    <form
      className="rounded-[14px] bg-surface p-4 sm:p-5"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!address) return connect()
        if (!valid) return setError('Write a plan of at least a sentence, and give each milestone a later day than the one before (7–90).')
        setPending(true)
        setError(null)
        try {
          await onSubmit(plan.trim(), days)
        } catch {
          setError('The offer didn’t go through. Your bond wasn’t posted. Try again.')
          setPending(false)
        }
      }}
    >
      <p className="text-[15px] font-semibold">Your offer</p>
      <label className="mt-4 block">
        <span className="label">Plan</span>
        <textarea
          name="plan"
          rows={3}
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="What you’ll do differently, and how you’ll hit the milestones still owed."
          className="mt-2 block w-full rounded-[11px] bg-raised p-3 text-[14px] outline-none ring-1 ring-transparent focus:ring-accent"
        />
      </label>
      <fieldset className="mt-4">
        <legend className="label">New deadlines, in days from takeover</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {owed.map((t, i) => (
            <label key={t} className="flex items-center gap-3 rounded-[10px] bg-raised px-3 py-2">
              <span className="min-w-0 flex-1 truncate text-[13px]">{t}</span>
              <input
                type="number"
                inputMode="numeric"
                min={7}
                max={90}
                value={days[i]}
                onChange={(e) => setDays(days.map((d, j) => (j === i ? Number(e.target.value) : d)))}
                className="w-14 bg-transparent text-right font-mono text-[14px] outline-none"
                aria-label={`Days for ${t}`}
              />
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-default">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={pending} className="disabled:opacity-100">
          {!address ? 'Connect wallet' : pending ? 'Posting bond…' : `Post ${BOND_SOL} SOL bond and offer`}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

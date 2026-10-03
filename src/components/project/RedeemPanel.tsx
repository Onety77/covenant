import { useState } from 'react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { count, left, pct, sol } from '@/lib/format'
import { redeemRate, sampleBalance } from '@/lib/redeem'
import { SOL_USD } from '@/lib/rules'
import { myRedeems } from '@/lib/session'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/components/layout/wallet'

/** After a default: burn tokens to claim a share of the forfeited bond and fees. */
export function RedeemPanel({ project: p, now, onRedeem }: { project: Project; now: number; onRedeem: (tokens: number) => Promise<void> }) {
  const d = p.covenant.default!
  const { address, connect } = useWallet()
  const mine = myRedeems.use()[p.id]
  const balance = sampleBalance - (mine?.tokens ?? 0)
  const [amount, setAmount] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')
  const rate = redeemRate(p.covenant)
  const n = Math.min(Number(amount) || 0, address ? balance : Infinity)
  const closed = Date.parse(d.redemptionClosesAt) <= now
  const marketPerM = (1e6 * p.market.priceUsd) / SOL_USD

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return connect()
    if (!n) return
    setState('pending')
    try {
      await onRedeem(n)
      setState('done')
      setAmount('')
    } catch {
      setState('error')
    }
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-default/40 bg-surface p-5" id="redeem">
      <p className="flex items-center justify-between">
        <span className="label text-default">Redemption open</span>
        <span className="font-mono text-[12px] text-ink-2 tabular">{closed ? 'Closed' : `closes in ${left(d.redemptionClosesAt, now)}`}</span>
      </p>
      <p className="mt-3 font-display text-[40px] leading-none">{sol(d.poolSol)}</p>
      <p className="mt-1.5 text-[13px] text-ink-2">Forfeited bond and pledged fees, for holders who burn ${p.ticker}. {pct(d.redeemedPct)} of supply redeemed so far.</p>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-line bg-line text-[12px]">
        <div className="bg-surface p-3">
          <dt className="text-ink-3">Redeem 1M</dt>
          <dd className="mt-0.5 font-mono text-[13px]">{sol(rate * 1e6, 3)}</dd>
        </div>
        <div className="bg-surface p-3">
          <dt className="text-ink-3">Sell 1M</dt>
          <dd className="mt-0.5 font-mono text-[13px]">{sol(marketPerM, 3)}</dd>
        </div>
      </dl>

      <label className="mt-4 block">
        <span className="flex justify-between">
          <span className="label">You burn</span>
          {address && (
            <button type="button" onClick={() => setAmount(String(balance))} className="font-mono text-[11px] text-blue-text">
              Max {count(balance)}
            </button>
          )}
        </span>
        <span className="mt-1.5 flex h-12 items-center rounded-control border border-line-2 bg-surface px-3 focus-within:border-default">
          <input
            name="burn"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/\D/g, ''))
              setState('idle')
            }}
            className="min-w-0 flex-1 bg-transparent font-mono text-[17px] outline-none"
          />
          <span className="font-mono text-[13px] text-ink-3">{p.ticker}</span>
        </span>
      </label>
      <p className="mt-3 flex justify-between text-[13px]">
        <span className="text-ink-3">You receive</span>
        <span className="font-mono tabular">{n ? sol(n * rate, 4) : '—'}</span>
      </p>
      <Button type="submit" variant="danger" size="lg" className="mt-4 w-full disabled:opacity-100" disabled={closed || state === 'pending' || (Boolean(address) && !n)}>
        {!address ? 'Connect wallet' : state === 'pending' ? 'Confirm in wallet…' : 'Burn and redeem'}
      </Button>
      <p className={cn('mt-3 text-[12px] leading-relaxed', state === 'done' ? 'text-proven' : state === 'error' ? 'text-default' : 'text-ink-3')} aria-live="polite">
        {state === 'done' && mine
          ? `Redeemed. You’ve burned ${count(mine.tokens)} ${p.ticker} for ${sol(mine.sol, 4)}.`
          : state === 'error'
            ? 'The burn didn’t go through. Nothing was burned. Try again.'
            : 'Burning is final. If a new builder takes over, unburned tokens stay in the project.'}
      </p>
    </form>
  )
}

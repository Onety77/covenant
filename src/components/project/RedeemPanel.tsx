import { useState } from 'react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { Done } from '@/components/motion/Done'
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
    <form onSubmit={submit} className="rounded-[16px] bg-surface p-4" id="redeem">
      <p className="flex items-center justify-between">
        <span className="label flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-default" />Redemption open</span>
        <span className="font-mono text-[12px] text-ink-2 tabular">{closed ? 'Closed' : `closes in ${left(d.redemptionClosesAt, now)}`}</span>
      </p>
      <p className="mt-3 font-mono text-[34px] font-medium leading-none tracking-[-0.03em]">{sol(d.poolSol)}</p>
      <p className="mt-1.5 text-[13px] text-ink-2">Forfeited bond and pledged fees, for holders who burn ${p.ticker}. {pct(d.redeemedPct)} of supply redeemed so far.</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
        <div className="rounded-[10px] bg-raised p-3">
          <dt className="text-ink-3">Redeem 1M</dt>
          <dd className="mt-0.5 font-mono text-[13px]">{sol(rate * 1e6, 3)}</dd>
        </div>
        <div className="rounded-[10px] bg-raised p-3">
          <dt className="text-ink-3">Sell 1M</dt>
          <dd className="mt-0.5 font-mono text-[13px]">{sol(marketPerM, 3)}</dd>
        </div>
      </dl>

      <label className="mt-4 block">
        <span className="flex justify-between">
          <span className="label">You burn</span>
          {address && (
            <button type="button" onClick={() => setAmount(String(balance))} className="font-mono text-[11px] text-ink-2">
              Max {count(balance)}
            </button>
          )}
        </span>
        <span className="mt-2 flex h-14 items-center rounded-[11px] bg-raised px-3.5 ring-1 ring-transparent focus-within:ring-default">
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
            className="min-w-0 flex-1 bg-transparent font-mono text-[20px] outline-none"
          />
          <span className="font-mono text-[13px] text-ink-3">{p.ticker}</span>
        </span>
      </label>
      <p className="mt-3 flex justify-between text-[13px]">
        <span className="text-ink-3">You receive</span>
        <span className="font-mono tabular">{n ? sol(n * rate, 4) : '—'}</span>
      </p>
      <Button type="submit" variant={address ? 'danger' : 'primary'} size="lg" className="mt-4 w-full disabled:opacity-100" disabled={closed || state === 'pending' || (Boolean(address) && !n)}>
        {!address ? 'Connect wallet' : state === 'pending' ? 'Confirm in wallet…' : 'Burn and redeem'}
      </Button>
      <p className={cn('mt-3 text-[12px] leading-relaxed', state === 'error' ? 'text-default' : 'text-ink-3')} aria-live="polite">
        {state === 'done' && mine
          ? <Done>Redeemed. You’ve burned {count(mine.tokens)} {p.ticker} for {sol(mine.sol, 4)}.</Done>
          : state === 'error'
            ? 'The burn didn’t go through. Nothing was burned. Try again.'
            : 'Burning is final. If a new builder takes over, unburned tokens stay in the project.'}
      </p>
    </form>
  )
}

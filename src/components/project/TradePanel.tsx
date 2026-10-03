import { useState } from 'react'
import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { count, sol } from '@/lib/format'
import { FEE_PCT, SOL_USD } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/components/layout/wallet'

type Side = 'buy' | 'sell'

/** Buy or sell the token. The trade itself is the page's `onTrade`. */
export function TradePanel({ project: p, onTrade }: { project: Project; onTrade: (side: Side, amount: number) => Promise<void> }) {
  const { address, connect } = useWallet()
  const [side, setSide] = useState<Side>('buy')
  const [amount, setAmount] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')
  const n = Number(amount) || 0
  const tokensPerSol = SOL_USD / p.market.priceUsd
  const out = side === 'buy' ? n * tokensPerSol * (1 - FEE_PCT / 100) : (n / tokensPerSol) * (1 - FEE_PCT / 100)
  const venue = p.market.stage === 'curve' ? 'Meteora bonding curve' : 'Meteora DAMM v2 pool'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return connect()
    if (!n) return
    setState('pending')
    try {
      await onTrade(side, n)
      setState('done')
      setAmount('')
    } catch {
      setState('error')
    }
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface p-5" id="trade">
      <div className="grid grid-cols-2 rounded-control bg-sunken p-1" role="tablist" aria-label="Trade side">
        {(['buy', 'sell'] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={side === s}
            onClick={() => {
              setSide(s)
              setState('idle')
            }}
            className={cn('h-8 rounded-[7px] text-[13px] font-semibold capitalize transition-colors', side === s ? 'bg-surface text-ink shadow-sm' : 'text-ink-3 hover-device:hover:text-ink')}
          >
            {s}
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="label">{side === 'buy' ? 'You pay' : 'You sell'}</span>
        <span className="mt-1.5 flex h-12 items-center rounded-control border border-line-2 bg-surface px-3 focus-within:border-blue">
          <input
            name="amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^\d.]/g, ''))
              setState('idle')
            }}
            className="min-w-0 flex-1 bg-transparent font-mono text-[17px] outline-none"
          />
          <span className="font-mono text-[13px] text-ink-3">{side === 'buy' ? 'SOL' : p.ticker}</span>
        </span>
      </label>
      {side === 'buy' && (
        <div className="mt-2 flex gap-1.5">
          {[0.5, 1, 5].map((v) => (
            <button key={v} type="button" onClick={() => setAmount(String(v))} className="h-7 rounded-[6px] border border-line px-2.5 font-mono text-[12px] text-ink-2 hover-device:hover:bg-hover">
              {v} SOL
            </button>
          ))}
        </div>
      )}
      <p className="mt-4 flex justify-between text-[13px]">
        <span className="text-ink-3">You receive about</span>
        <span className="font-mono tabular">{n ? (side === 'buy' ? `${count(Math.round(out))} ${p.ticker}` : sol(out, 3)) : '—'}</span>
      </p>
      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full disabled:opacity-100" disabled={state === 'pending' || (Boolean(address) && !n)}>
        {!address ? 'Connect wallet' : state === 'pending' ? 'Confirm in wallet…' : `${side === 'buy' ? 'Buy' : 'Sell'} $${p.ticker}`}
      </Button>
      <p className={cn('mt-3 text-[12px] leading-relaxed', state === 'done' ? 'text-proven' : state === 'error' ? 'text-default' : 'text-ink-3')} aria-live="polite">
        {state === 'done' ? 'Trade confirmed.' : state === 'error' ? 'The trade didn’t go through. Nothing was spent. Try again.' : `Trades on the ${venue}. ${FEE_PCT}% fee; the builder’s share goes into the covenant.`}
      </p>
    </form>
  )
}

import { useState } from 'react'
import type { Project } from '@/types'
import { m } from 'motion/react'
import { cn } from '@/lib/cn'
import { SPRING_UI } from '@/lib/motion'
import { Done } from '@/components/motion/Done'
import { count, sol } from '@/lib/format'
import { FEE_PCT, SOL_USD } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/components/layout/wallet'

export type Side = 'buy' | 'sell'

/** Buy or sell the token. The trade itself is the page's `onTrade`. */
export function TradePanel({ project: p, side: initial = 'buy', onTrade }: { project: Project; side?: Side; onTrade: (side: Side, amount: number) => Promise<void> }) {
  const { address, connect } = useWallet()
  const [side, setSide] = useState<Side>(initial)
  const [amount, setAmount] = useState('')
  const [state, setState] = useState<'idle' | 'pending' | 'done' | 'error'>('idle')
  const n = Number(amount) || 0
  const tokensPerSol = SOL_USD / p.market.priceUsd
  const out = side === 'buy' ? n * tokensPerSol * (1 - FEE_PCT / 100) : (n / tokensPerSol) * (1 - FEE_PCT / 100)
  const venue = p.market.stage === 'curve' ? 'bonding curve' : 'DAMM v2 pool'

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
    <form onSubmit={submit} className="rounded-[16px] bg-surface p-4" id="trade">
      <div className="grid grid-cols-2 gap-1 rounded-[11px] bg-bg p-1" role="tablist" aria-label="Trade side">
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
            className={cn('relative h-9 rounded-[8px] text-[14px] font-semibold capitalize transition-colors', side === s ? 'text-ink' : 'text-ink-3 hover-device:hover:text-ink')}
          >
            {side === s && <m.span layoutId={`side-${p.id}`} className="absolute inset-0 rounded-[8px] bg-raised" transition={SPRING_UI} />}
            <span className="relative">{s}</span>
          </button>
        ))}
      </div>
      <label className="mt-4 block">
        <span className="label">{side === 'buy' ? 'Amount' : 'Sell'}</span>
        <span className="mt-2 flex h-14 items-center rounded-[11px] bg-raised px-3.5 ring-1 ring-transparent focus-within:ring-accent">
          <input
            name="amount"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^\d.]/g, ''))
              setState('idle')
            }}
            className="min-w-0 flex-1 bg-transparent font-mono text-[20px] outline-none"
          />
          <span className="font-mono text-[13px] text-ink-3">{side === 'buy' ? 'SOL' : p.ticker}</span>
        </span>
      </label>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {(side === 'buy' ? ['0.1', '0.5', '1', '5'] : ['25%', '50%', '75%', '100%']).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setAmount(side === 'buy' ? v : String(Math.round((parseInt(v) / 100) * 2_400_000)))}
            className="h-8 rounded-[8px] bg-raised font-mono text-[12px] text-ink-2 hover-device:hover:text-ink"
          >
            {v}
          </button>
        ))}
      </div>
      <p className="mt-4 flex justify-between text-[13px]">
        <span className="text-ink-3">You get about</span>
        <span className="font-mono tabular">{n ? (side === 'buy' ? `${count(Math.round(out))} ${p.ticker}` : sol(out, 3)) : '—'}</span>
      </p>
      <Button type="submit" variant={!address ? 'primary' : side === 'buy' ? 'buy' : 'sell'} size="lg" className="mt-4 w-full disabled:opacity-100" disabled={state === 'pending' || (Boolean(address) && !n)}>
        {!address ? 'Connect wallet' : state === 'pending' ? 'Confirm in wallet…' : `${side === 'buy' ? 'Buy' : 'Sell'} $${p.ticker}`}
      </Button>
      <p className={cn('mt-3 text-[12px] leading-relaxed', state === 'error' ? 'text-default' : 'text-ink-3')} aria-live="polite">
        {state === 'done'
          ? <Done>Trade confirmed.</Done>
          : state === 'error'
            ? 'The trade didn’t go through. Nothing was spent. Try again.'
            : `On the ${venue}. ${FEE_PCT}% fee; the builder’s share goes into the covenant.`}
      </p>
    </form>
  )
}

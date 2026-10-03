import type { Project } from '@/types'
import { seeded } from './seeded'
import { SOL_USD, SUPPLY } from './rules'

export interface Candle {
  o: number
  h: number
  l: number
  c: number
  v: number
}

/** Seeded hourly candles that end at the current price, for sample charts. */
export function candles(seed: string, last: number, change: number, n = 64): Candle[] {
  const r = seeded(seed + '-c')
  const first = last / (1 + change * 4)
  const out: Candle[] = []
  let prev = first
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const target = first + (last - first) * t
    const c = i === n - 1 ? last : target * (1 + (r() - 0.5) * 0.09) + (prev - target) * 0.35
    const o = prev
    const h = Math.max(o, c) * (1 + r() * 0.035)
    const l = Math.min(o, c) * (1 - r() * 0.035)
    out.push({ o, h, l, c, v: 0.3 + r() * (Math.abs(c - o) / o) * 20 })
    prev = c
  }
  return out
}

export interface Trade {
  id: string
  side: 'buy' | 'sell'
  sol: number
  tokens: number
  wallet: string
  at: number
}

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const wallet = (r: () => number) => {
  const pick = () => B58[Math.floor(r() * B58.length)]
  return `${pick()}${pick()}${pick()}${pick()}…${pick()}${pick()}${pick()}${pick()}`
}

/** Recent sample trades, newest first. */
export function trades(p: Project, now: number, n = 14): Trade[] {
  const r = seeded(p.id + '-t')
  let at = now - Math.floor(r() * 40) * 1000
  return Array.from({ length: n }, (_, i) => {
    const side = r() > 0.42 ? 'buy' : 'sell'
    const s = Math.round((0.05 + r() ** 2 * 6) * 1000) / 1000
    const t = { id: `${p.id}-${i}`, side, sol: s, tokens: (s * SOL_USD) / p.market.priceUsd, wallet: wallet(r), at } as Trade
    at -= Math.floor(20 + r() * 400) * 1000
    return t
  })
}

export interface Holder {
  wallet: string
  pct: number
  label?: string
}

/** Sample top holders; the covenant escrow is always the first. */
export function holders(p: Project): Holder[] {
  const r = seeded(p.id + '-h')
  const escrow = p.covenant.escrowPct - p.covenant.milestones.filter((m) => m.status === 'proven').length * 5
  const list: Holder[] = []
  if (escrow > 0) list.push({ wallet: 'Covenant escrow', pct: escrow / 100, label: 'locked' })
  if (p.market.stage === 'graduated') list.push({ wallet: 'DAMM v2 pool', pct: 0.07 + r() * 0.05, label: 'liquidity' })
  else list.push({ wallet: 'Bonding curve', pct: 0.5 + r() * 0.2, label: 'curve' })
  let left = 0.06
  for (let i = 0; i < 8; i++) {
    left *= 0.62 + r() * 0.2
    list.push({ wallet: wallet(r), pct: left + r() * 0.004 })
  }
  return list
}

export const tokensFmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(Math.round(n)))
export const supply = SUPPLY

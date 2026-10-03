import { useSyncExternalStore } from 'react'
import { projects } from '@/data/projects'

/*
  Simulated live market for the sample tokens: every few seconds two or three tokens tick
  up or down a fraction of a percent. One timer for the whole app; components read a
  token's live figures through useLive(id). Swap this module for a real price feed.
*/

export interface LiveQuote {
  price: number
  change24h: number
  mcap: number
  /** increments on every tick, so charts can follow */
  tick: number
}

const base = new Map(projects.map((p) => [p.id, p.market]))
let quotes: Record<string, LiveQuote> = Object.fromEntries(projects.map((p) => [p.id, { price: p.market.priceUsd, change24h: p.market.change24h, mcap: p.market.mcapUsd, tick: 0 }]))
const subs = new Set<() => void>()
let timer: number | undefined

function step() {
  // defaulted and fulfilled tokens trade quietly; live ones move more
  const ids = projects.filter((p) => p.market.stage === 'graduated').map((p) => p.id)
  const n = 2 + Math.floor(Math.random() * 2)
  const next = { ...quotes }
  for (let i = 0; i < n; i++) {
    const id = ids[Math.floor(Math.random() * ids.length)]
    const q = next[id]
    const m = base.get(id)!
    const move = (Math.random() - 0.48) * 0.008
    const price = q.price * (1 + move)
    const open = m.priceUsd / (1 + m.change24h)
    next[id] = { price, change24h: price / open - 1, mcap: (m.mcapUsd * price) / m.priceUsd, tick: q.tick + 1 }
  }
  quotes = next
  subs.forEach((f) => f())
}

function subscribe(cb: () => void) {
  subs.add(cb)
  if (timer === undefined) {
    const loop = () => {
      step()
      timer = window.setTimeout(loop, 2200 + Math.random() * 2600)
    }
    timer = window.setTimeout(loop, 1800)
  }
  return () => {
    subs.delete(cb)
    if (!subs.size && timer !== undefined) {
      window.clearTimeout(timer)
      timer = undefined
    }
  }
}

/** A token's live figures. */
export const useLive = (id: string) => useSyncExternalStore(subscribe, () => quotes[id])

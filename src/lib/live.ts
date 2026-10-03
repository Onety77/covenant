import { useSyncExternalStore } from 'react'
import { sampleNow } from '@/data/projects'

/* One clock for the whole page, so every countdown and term marker moves together. */

const loadedAt = Date.now()
const compute = () => sampleNow + Math.floor((Date.now() - loadedAt) / 1000) * 1000
let now = compute()
const subs = new Set<() => void>()
let timer: number | undefined

function subscribe(cb: () => void) {
  subs.add(cb)
  if (timer === undefined) {
    now = compute()
    timer = window.setInterval(() => {
      now = compute()
      subs.forEach((f) => f())
    }, 1000)
  }
  return () => {
    subs.delete(cb)
    if (!subs.size && timer !== undefined) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

/** The sample clock right now, for stamping things you do. */
export const sampleNowMs = () => compute()

/** "Now" for the sample data, ticking once a second. */
export const useNow = () => useSyncExternalStore(subscribe, () => now)

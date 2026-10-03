import { projects } from '@/data/projects'

/** Protocol-wide figures for the board header, derived from the sample launches. */
export function protocolStats() {
  const live = projects.filter((p) => p.covenant.state === 'active')
  const atStake = live.reduce((s, p) => s + p.covenant.bondSol + (p.covenant.feesSol - p.covenant.feesReleasedSol), 0)
  const toHolders = projects.reduce((s, p) => s + [p.covenant, ...(p.previous ?? [])].reduce((t, c) => t + (c.default?.poolSol ?? 0), 0), 0)
  const proven = projects.reduce((s, p) => s + [p.covenant, ...(p.previous ?? [])].reduce((t, c) => t + c.milestones.filter((m) => m.status === 'proven').length, 0), 0)
  return { live: live.length, atStake, toHolders, proven }
}

import type { Covenant, Project } from '@/types'
import { BOND_SOL, CURVE_TARGET_SOL, ESCROW_PCT, TERM_DAYS, addDays } from './rules'

export interface DraftMilestone {
  title: string
  measure: string
  target: string
  dueDay: number
}

export interface Draft {
  name: string
  ticker: string
  tagline: string
  image?: string
  milestones: DraftMilestone[]
}

export const emptyDraft: Draft = {
  name: '',
  ticker: '',
  tagline: '',
  milestones: [
    { title: '', measure: '', target: '', dueDay: 30 },
    { title: '', measure: '', target: '', dueDay: 60 },
    { title: '', measure: '', target: '', dueDay: 90 },
  ],
}

/** Deadlines must leave at least two weeks per milestone and end by day 90. */
export const MIN_GAP = 14
export function dayErrors(ms: DraftMilestone[]) {
  return ms.map((m, i) => {
    const prev = i ? ms[i - 1].dueDay : 0
    if (m.dueDay - prev < MIN_GAP) return `At least ${MIN_GAP} days after ${i ? `M${i}` : 'launch'}`
    if (m.dueDay > TERM_DAYS) return `By day ${TERM_DAYS}`
    return null
  })
}

/** The draft as the covenant it would become, for the live preview. */
export function draftProject(d: Draft, now: number): Project {
  const start = new Date(now).toISOString()
  const covenant: Covenant = {
    state: 'active',
    builder: { handle: 'you', wallet: '5uGv…r2Wd' },
    startedAt: start,
    endsAt: addDays(start, TERM_DAYS),
    bondSol: BOND_SOL,
    escrowPct: ESCROW_PCT,
    feesSol: 0,
    feesReleasedSol: 0,
    milestones: d.milestones.map((m, i) => ({
      n: (i + 1) as 1 | 2 | 3,
      title: m.title || `Milestone ${i + 1}`,
      measure: m.measure,
      target: m.target,
      dueDay: m.dueDay,
      status: i === 0 ? 'open' : 'locked',
      releasePct: ESCROW_PCT / 3,
    })),
  }
  return {
    id: 'draft',
    name: d.name || 'Your project',
    ticker: d.ticker || 'TICKER',
    tagline: d.tagline || 'One line on what you’re building',
    about: '',
    image: d.image,
    launchedAt: start,
    market: { stage: 'curve', curveSol: 0, curveTargetSol: CURVE_TARGET_SOL, priceUsd: 0, change24h: 0, mcapUsd: 0, volume24hUsd: 0, holders: 0, liquidityUsd: 0 },
    covenant,
  }
}

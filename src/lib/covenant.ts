import type { Covenant, Milestone, MilestoneStatus, Project, Vote } from '@/types'
import { NEEDED, TERM_DAYS, addDays, termDay } from './rules'

/** What each status reads as, everywhere. */
export const statusLabel: Record<MilestoneStatus, string> = {
  locked: 'Not started',
  open: 'Open',
  review: 'In review',
  proven: 'Proven',
  rejected: 'Rejected',
  missed: 'Missed',
}

/** proven and default are verdicts (green, red); accent marks what awaits one; the rest is neutral */
export type Tone = 'neutral' | 'accent' | 'proven' | 'default'

export const statusTone: Record<MilestoneStatus, Tone> = {
  locked: 'neutral',
  open: 'neutral',
  review: 'accent',
  proven: 'proven',
  rejected: 'default',
  missed: 'default',
}

export const covenantLabel: Record<Covenant['state'], string> = {
  active: 'Live',
  fulfilled: 'Fulfilled',
  defaulted: 'Defaulted',
  succeeded: 'Handed over',
}

export const covenantTone: Record<Covenant['state'], Tone> = {
  active: 'neutral',
  fulfilled: 'proven',
  defaulted: 'default',
  succeeded: 'neutral',
}

export const releasedPct = (c: Covenant) => c.milestones.filter((m) => m.status === 'proven').reduce((s, m) => s + m.releasePct, 0)
export const provenCount = (c: Covenant) => c.milestones.filter((m) => m.status === 'proven').length

/** The milestone that matters now: in review, else open, else the next locked one. */
export function current(c: Covenant): Milestone | undefined {
  return c.milestones.find((m) => m.status === 'review') ?? c.milestones.find((m) => m.status === 'open' || m.status === 'rejected') ?? c.milestones.find((m) => m.status === 'locked')
}

export const due = (c: Covenant, m: Milestone) => addDays(c.startedAt, m.dueDay)

export const tally = (panel: Vote[] = []) => ({
  approve: panel.filter((v) => v.verdict === 'approve').length,
  reject: panel.filter((v) => v.verdict === 'reject').length,
  pending: panel.filter((v) => !v.verdict).length,
  needed: NEEDED,
})

export const dayOf = (c: Covenant, now: number) => (c.state === 'active' ? termDay(c.startedAt, now) : c.default ? termDay(c.startedAt, Date.parse(c.default.at)) : TERM_DAYS)

/** Grouping used by the launches list. */
export type Standing = 'curve' | 'term' | 'review' | 'fulfilled' | 'defaulted'
export function standing(p: Project): Standing {
  const c = p.covenant
  if (c.state === 'defaulted') return 'defaulted'
  if (c.state === 'fulfilled') return 'fulfilled'
  if (c.milestones.some((m) => m.status === 'review')) return 'review'
  if (p.market.stage === 'curve') return 'curve'
  return 'term'
}

/** Unreleased escrow, in % of supply */
export const heldPct = (c: Covenant) => c.escrowPct - releasedPct(c)

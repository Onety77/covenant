import type { Milestone, Project } from '@/types'
import { projects } from '@/data/projects'

export interface ReviewItem {
  id: string
  project: Project
  milestone: Milestone
}

export const reviewId = (p: Project, m: Milestone) => `${p.id}-m${m.n}`

/** Every milestone with proof waiting on verifiers, soonest closing first. */
export const openReviews = (): ReviewItem[] =>
  projects
    .flatMap((p) => p.covenant.milestones.filter((m) => m.status === 'review').map((m) => ({ id: reviewId(p, m), project: p, milestone: m })))
    .sort((a, b) => Date.parse(a.milestone.reviewClosesAt!) - Date.parse(b.milestone.reviewClosesAt!))

/** Decided reviews, newest first (including earlier rejected attempts). */
export const decidedReviews = () =>
  projects
    .flatMap((p) => [...p.covenant.milestones, ...(p.previous?.flatMap((c) => c.milestones) ?? [])].filter((m) => m.decidedAt && m.panel).map((m) => ({ id: reviewId(p, m), project: p, milestone: m })))
    .sort((a, b) => Date.parse(b.milestone.decidedAt!) - Date.parse(a.milestone.decidedAt!))

export function findReview(id: string): ReviewItem | undefined {
  const [pid, mn] = id.split('-m')
  const p = projects.find((x) => x.id === pid)
  const m = p?.covenant.milestones.find((x) => String(x.n) === mn)
  return p && m ? { id, project: p, milestone: m } : undefined
}

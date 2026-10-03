import type { Project } from '@/types'
import { projects } from '@/data/projects'

export interface Hit {
  project: Project
  /** what matched, for highlighting */
  field: 'ticker' | 'name' | 'builder' | 'tagline'
}

export const MIN_QUERY = 2

/**
 * Tokens matching a query, best first: ticker prefix, name prefix, then anywhere in the
 * ticker, name, builder or tagline. Searches from two characters.
 */
export function searchTokens(query: string, limit = 6): Hit[] {
  const q = query.trim().toLowerCase().replace(/^\$/, '')
  if (q.length < MIN_QUERY) return []
  const scored: { hit: Hit; score: number }[] = []
  for (const p of projects) {
    const t = p.ticker.toLowerCase()
    const n = p.name.toLowerCase()
    const b = p.covenant.builder.handle.toLowerCase()
    const g = p.tagline.toLowerCase()
    let hit: Hit | null = null
    let score = 0
    if (t.startsWith(q)) [hit, score] = [{ project: p, field: 'ticker' }, 100]
    else if (n.startsWith(q)) [hit, score] = [{ project: p, field: 'name' }, 90]
    else if (n.split(/\s+/).some((w) => w.startsWith(q))) [hit, score] = [{ project: p, field: 'name' }, 80]
    else if (t.includes(q)) [hit, score] = [{ project: p, field: 'ticker' }, 70]
    else if (n.includes(q)) [hit, score] = [{ project: p, field: 'name' }, 60]
    else if (b.includes(q)) [hit, score] = [{ project: p, field: 'builder' }, 50]
    else if (q.length >= 3 && g.includes(q)) [hit, score] = [{ project: p, field: 'tagline' }, 30]
    if (hit) scored.push({ hit, score: score + Math.log10(p.market.volume24hUsd + 1) })
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit)
}

/** Shown on focus before typing: the busiest tokens right now. */
export const trending = (limit = 4) => [...projects].sort((a, b) => b.market.volume24hUsd - a.market.volume24hUsd).slice(0, limit)

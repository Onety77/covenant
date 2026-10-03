import type { Covenant } from '@/types'
import { SUPPLY } from './rules'

/**
 * Redemption is pro rata: the pool (remaining bond + pledged fees) over every token outside
 * escrow. Burning any amount pays the same rate, so the rate never changes as others redeem.
 */
export const redeemRate = (c: Covenant) => (c.default ? c.default.poolSol / (SUPPLY * (1 - c.escrowPct / 100)) : 0)

/** the sample wallet's balance, once connected */
export const sampleBalance = 2_400_000

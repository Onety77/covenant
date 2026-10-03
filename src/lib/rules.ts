/** The protocol's fixed terms, as the UI presents them. */
export const TERM_DAYS = 90
export const BOND_SOL = 10
export const ESCROW_PCT = 15
/** each review is decided by a panel of five verifiers; three matching verdicts decide it */
export const PANEL = 5
export const NEEDED = 3
/** after a default, how long holders can burn-redeem and builders can bid to take over */
export const DEFAULT_WINDOW_DAYS = 14
export const REVIEW_DAYS = 3
/** SOL raised on the curve that graduates a token to its DAMM v2 pool */
export const CURVE_TARGET_SOL = 80

const DAY = 86_400_000
export const addDays = (iso: string, days: number) => new Date(Date.parse(iso) + days * DAY).toISOString()
/** day of the term (0–90, fractional) at time `now` */
export const termDay = (startIso: string, now: number) => Math.max(0, Math.min(TERM_DAYS, (now - Date.parse(startIso)) / DAY))
export const dueAt = (startIso: string, dueDay: number) => addDays(startIso, dueDay)

/** sample SOL price, for converting USD market figures in estimates */
export const SOL_USD = 150
/** total supply of every launch (Meteora DBC default config) */
export const SUPPLY = 1_000_000_000
/** trading fee on the curve and in the pool */
export const FEE_PCT = 1

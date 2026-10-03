export type ViewState = 'ready' | 'loading' | 'empty' | 'error'

/** Where the token trades: on Meteora's bonding curve, or graduated to a DAMM v2 pool with locked liquidity. */
export type MarketStage = 'curve' | 'graduated'

/**
 * The covenant's state.
 * active: the 90-day term is running. fulfilled: all three milestones proven, bond returned.
 * defaulted: a deadline was missed or proof rejected; holders can burn-redeem, builders can take over.
 * succeeded: it defaulted, and a replacement builder's new covenant now carries the roadmap.
 */
export type CovenantState = 'active' | 'fulfilled' | 'defaulted' | 'succeeded'

/**
 * locked: not yet reachable (an earlier milestone is still open). open: the builder can submit proof.
 * review: proof submitted, verifiers voting. proven: approved, its escrow share released.
 * rejected: verifiers rejected the proof (the builder may resubmit before the deadline).
 * missed: the deadline passed without approved proof; the covenant defaults.
 */
export type MilestoneStatus = 'locked' | 'open' | 'review' | 'proven' | 'rejected' | 'missed'

export type Verdict = 'approve' | 'reject'

export interface Person {
  handle: string
  /** shortened wallet, display only */
  wallet: string
}

export interface Verifier extends Person {
  id: string
  reviews: number
  /** share of their verdicts that matched the final outcome */
  agreement: number
  stakeSol: number
}

export interface Vote {
  verifierId: string
  verdict?: Verdict
  note?: string
  at?: string
}

export interface ProofLink {
  label: string
  href: string
}

export interface Proof {
  submittedAt: string
  summary: string
  /** measured values the builder claims, shown against the target */
  readings: { k: string; v: string }[]
  links: ProofLink[]
}

export interface Milestone {
  n: 1 | 2 | 3
  title: string
  /** the measurable test, in one sentence */
  measure: string
  /** short form of the target, e.g. "1,000 weekly users" */
  target: string
  /** day of the 90-day term the milestone is due */
  dueDay: number
  status: MilestoneStatus
  /** share of total supply released to the builder when proven */
  releasePct: number
  proof?: Proof
  /** votes from the assigned panel; `needed` approvals pass it */
  panel?: Vote[]
  reviewClosesAt?: string
  decidedAt?: string
  /** earlier rejected attempts, newest first */
  attempts?: { proof: Proof; panel: Vote[]; decidedAt: string }[]
}

export interface Takeover {
  id: string
  builder: Person
  bondSol: number
  plan: string
  /** new deadlines (days from takeover) for the milestones still owed */
  schedule: number[]
  at: string
}

export interface DefaultRecord {
  at: string
  milestone: 1 | 2 | 3
  reason: 'missed' | 'rejected'
  /** SOL available to holders who burn: remaining bond + pledged fees */
  poolSol: number
  /** share of circulating supply already burned for redemption */
  redeemedPct: number
  redemptionClosesAt: string
  takeovers: Takeover[]
  /** set once a replacement builder took over */
  successor?: Person & { at: string }
}

export interface Covenant {
  state: CovenantState
  builder: Person
  startedAt: string
  /** startedAt + 90 days */
  endsAt: string
  bondSol: number
  escrowPct: number
  /** creator fees pledged so far (SOL), and how much of that has been released */
  feesSol: number
  feesReleasedSol: number
  milestones: Milestone[]
  default?: DefaultRecord
  /** set when a replacement builder took this roadmap over after a default */
  takenOverFrom?: string
}

export interface Market {
  stage: MarketStage
  /** SOL raised on the curve, and the threshold that graduates it */
  curveSol: number
  curveTargetSol: number
  priceUsd: number
  change24h: number
  mcapUsd: number
  volume24hUsd: number
  holders: number
  liquidityUsd: number
}

export interface Project {
  id: string
  name: string
  ticker: string
  tagline: string
  about: string
  site?: string
  image?: string
  launchedAt: string
  market: Market
  /** the covenant in force (or the last one, if it defaulted with no successor) */
  covenant: Covenant
  /** earlier covenants on the same token, newest first */
  previous?: Covenant[]
}

export type ActivityKind = 'launch' | 'proof' | 'proven' | 'rejected' | 'default' | 'takeover' | 'redeem' | 'graduated'

export interface Activity {
  id: string
  kind: ActivityKind
  projectId: string
  at: string
  text: string
}

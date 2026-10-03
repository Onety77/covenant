import type { ReactNode } from 'react'
import { getProject } from '@/data/projects'
import { useNow } from '@/lib/live'
import { BOND_SOL, CURVE_TARGET_SOL, DEFAULT_WINDOW_DAYS, ESCROW_PCT, NEEDED, PANEL, REVIEW_DAYS, TERM_DAYS } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { TermRail } from '@/components/covenant/TermRail'

const rules: { id: string; title: string; body: ReactNode }[] = [
  {
    id: 'launch',
    title: 'Launch',
    body: (
      <>
        <p>Every token launches as a Token-2022 asset on Meteora’s Dynamic Bonding Curve and trades from the first block.</p>
        <p>At {CURVE_TARGET_SOL} SOL raised it graduates into a Meteora DAMM v2 pool, and that liquidity is locked permanently. Nobody can withdraw it: not the builder, not a verifier, not Covenant.</p>
      </>
    ),
  },
  {
    id: 'covenant',
    title: 'The covenant',
    body: (
      <>
        <p>Before the token exists, the builder signs three milestones. Each has a measurable test and a deadline, all within {TERM_DAYS} days, at least two weeks apart.</p>
        <p>Against them the builder locks a {BOND_SOL} SOL bond, {ESCROW_PCT}% of supply and every future creator fee. The covenant program holds all of it, not the builder and not us.</p>
      </>
    ),
  },
  {
    id: 'proof',
    title: 'Proof',
    body: (
      <>
        <p>
          The builder submits proof: what shipped, the measured numbers and links anyone can check. {PANEL} independent, staked verifiers are drawn for each review, and {NEEDED} matching verdicts decide it. A review
          stays open up to {REVIEW_DAYS} days.
        </p>
        <p>Proof sent before the deadline counts even if the review ends after it. Rejected proof can be fixed and resent until the deadline. Every verdict comes with a public reason.</p>
      </>
    ),
  },
  { id: 'release', title: 'Release', body: <p>Each approved milestone releases 5% of supply and the fees pledged so far. When all three are proven, the bond goes back and the covenant is fulfilled.</p> },
  {
    id: 'default',
    title: 'Default',
    body: <p>If a deadline passes without approved proof, the covenant defaults on its own. No vote, no extension. What’s left of the bond and every unreleased fee becomes a pool for holders.</p>,
  },
  {
    id: 'redemption',
    title: 'Redemption',
    body: (
      <>
        <p>For {DEFAULT_WINDOW_DAYS} days after a default, any holder can burn tokens for a share of the pool. The rate is the pool over every token outside escrow, the same on the first day as the last.</p>
        <p className="rounded-[10px] bg-surface px-4 py-3 font-mono text-[13px] text-ink">80.9 SOL ÷ 850M tokens = 0.095 SOL per 1M burned</p>
      </>
    ),
  },
  {
    id: 'takeover',
    title: 'Takeover',
    body: (
      <p>
        In the same window, other builders can bid to carry the roadmap, each posting a {BOND_SOL} SOL bond and new deadlines. One takes over when the window closes and inherits the unreleased escrow under a fresh
        covenant. The other bonds go back. Same token, same holders.
      </p>
    ),
  },
  {
    id: 'recovery',
    title: 'Fee recovery',
    body: (
      <>
        <p>If creator fees get stranded for technical reasons, such as a lost claim key, a narrow path moves them back into the covenant’s fee vault.</p>
        <p>It can only move stranded creator fees. It can’t touch locked liquidity, bonds, escrowed tokens or anything a holder owns.</p>
      </>
    ),
  },
]

/** The protocol's rules in the order a launch meets them. */
export function Rules() {
  const now = useNow()
  const kiln = getProject('kiln')!
  return (
    <div className="wrap pt-8 pb-16 lg:pt-12">
      <h1 className="text-h1">Rules</h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">Few rules, and none of them bend. In the order a launch meets them.</p>

      <figure className="mt-10">
        <TermRail covenant={kiln.covenant} now={now} />
        <figcaption className="mt-5 text-[13px] text-ink-3">Kiln on day 70: two milestones proven, 10% of supply released, the third due by day 90.</figcaption>
      </figure>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <nav aria-label="On this page" className="max-lg:hidden lg:col-span-3">
          <ol className="sticky top-24 grid gap-0.5">
            {rules.map((r, i) => (
              <li key={r.id}>
                <a href={`#${r.id}`} className="flex gap-3 rounded-[8px] px-2 py-1.5 text-[14px] text-ink-2 hover-device:hover:bg-hover hover-device:hover:text-ink">
                  <span className="font-mono text-[12px] text-ink-4">{i + 1}</span>
                  {r.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="lg:col-span-8 lg:col-start-5">
          {rules.map((r, i) => (
            <section key={r.id} id={r.id} aria-labelledby={`${r.id}-t`} className="scroll-mt-24 pb-10">
              <h2 id={`${r.id}-t`} className="flex items-baseline gap-3 text-h2">
                <span className="font-mono text-[14px] font-normal text-ink-4">{i + 1}</span>
                {r.title}
              </h2>
              <div className="mt-3 grid max-w-2xl gap-3 text-[15px] leading-relaxed text-ink-2">{r.body}</div>
            </section>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="lg" to="/launch" arrow>
              Launch a token
            </Button>
            <Button size="lg" to="/">
              Back to the board
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

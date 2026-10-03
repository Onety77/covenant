import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getProject } from '@/data/projects'
import { useNow } from '@/lib/live'
import { BOND_SOL, CURVE_TARGET_SOL, DEFAULT_WINDOW_DAYS, ESCROW_PCT, NEEDED, PANEL, REVIEW_DAYS, TERM_DAYS } from '@/lib/rules'
import { TermRail } from '@/components/covenant/TermRail'
import { Button } from '@/components/ui/Button'

interface Rule {
  id: string
  title: string
  body: ReactNode
}

const rules: Rule[] = [
  {
    id: 'launch',
    title: 'The launch',
    body: (
      <>
        <p>
          Every project launches as a Token-2022 token on Meteora’s Dynamic Bonding Curve. Anyone can buy from the first block. When {CURVE_TARGET_SOL} SOL has gone into the curve, the token graduates
          into a Meteora DAMM v2 pool.
        </p>
        <p>At graduation the pool’s liquidity is locked permanently. Nobody can withdraw it: not the builder, not a verifier, not Covenant.</p>
      </>
    ),
  },
  {
    id: 'covenant',
    title: 'The covenant',
    body: (
      <>
        <p>
          Before the token exists, the builder signs a covenant: three milestones, each with a measurable test and a deadline, all within {TERM_DAYS} days. Each one has to leave at least two weeks
          after the last.
        </p>
        <p>
          Against those milestones the builder locks a {BOND_SOL} SOL bond, {ESCROW_PCT}% of the token’s supply, and every creator fee the token earns. All of it is held onchain by the covenant
          program, not by the builder or by us.
        </p>
      </>
    ),
  },
  {
    id: 'proof',
    title: 'Proof and verification',
    body: (
      <>
        <p>
          To complete a milestone, the builder submits proof: what was delivered, the measured numbers, and links anyone can check. A panel of {PANEL} independent, staked verifiers is drawn for
          each review, and {NEEDED} matching verdicts decide it. A review stays open for up to {REVIEW_DAYS} days.
        </p>
        <p>
          Proof sent before the deadline counts even if the review ends after it. Rejected proof can be fixed and sent again, as long as the deadline hasn’t passed. Verifiers judge the measure as
          written, and every verdict comes with a public reason.
        </p>
      </>
    ),
  },
  {
    id: 'release',
    title: 'What a proven milestone releases',
    body: (
      <p>
        Each approved milestone releases 5% of supply to the builder, along with the creator fees pledged so far. When all three are proven, the bond is returned and the covenant is fulfilled.
      </p>
    ),
  },
  {
    id: 'default',
    title: 'Default',
    body: (
      <p>
        If a deadline passes without approved proof, the covenant defaults automatically. No vote, no extension, no one who can stop it. What’s left of the bond and every unreleased fee becomes a
        pool for holders. The unreleased escrow stays locked for whoever takes the roadmap on.
      </p>
    ),
  },
  {
    id: 'redemption',
    title: 'Redemption',
    body: (
      <>
        <p>
          For {DEFAULT_WINDOW_DAYS} days after a default, any holder can burn tokens for a share of the pool. The rate is the pool divided by every token outside escrow, so each token is worth the
          same whether you redeem on the first day or the last.
        </p>
        <p className="rounded-[8px] bg-sunken px-4 py-3 font-mono text-[13px]">80.9 SOL pool ÷ 850M tokens = 0.095 SOL per 1M burned</p>
      </>
    ),
  },
  {
    id: 'takeover',
    title: 'Takeover',
    body: (
      <p>
        During the same window, other builders can offer to carry the roadmap. Each offer posts its own {BOND_SOL} SOL bond and sets new deadlines for the milestones still owed. One offer takes over
        when the window closes and inherits the unreleased escrow under a fresh covenant; the other bonds go back. The token and its holders stay where they are.
      </p>
    ),
  },
  {
    id: 'recovery',
    title: 'Fee recovery',
    body: (
      <>
        <p>
          Creator fees can get stranded for technical reasons, for example if the key that claims them is lost. A narrow recovery path moves those fees back into the covenant’s fee vault.
        </p>
        <p>It can only move stranded creator fees. It cannot touch locked liquidity, bonds, escrowed tokens or anything a holder owns.</p>
      </>
    ),
  },
]

export function HowItWorks() {
  const now = useNow()
  const example = getProject('kiln')!
  return (
    <div className="wrap pt-10 pb-20 lg:pt-14">
      <div className="max-w-3xl">
        <p className="label">How it works</p>
        <h1 className="mt-3 text-h1">
          The rules, <em className="italic">in plain words.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">Covenant has few rules, and none of them bend. Here they are in the order a launch meets them.</p>
      </div>

      <figure className="mt-10 rounded-card border border-line bg-surface p-5 sm:p-6">
        <TermRail covenant={example.covenant} now={now} />
        <figcaption className="mt-5 border-t border-line pt-4 text-[13px] text-ink-3">
          Kiln on day 70: two milestones proven, 10% released, the third due by day 90.{' '}
          <Link to="/p/kiln" className="font-semibold text-blue-text hover-device:hover:underline">
            Open Kiln
          </Link>
        </figcaption>
      </figure>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <nav aria-label="On this page" className="lg:col-span-3">
          <ol className="grid gap-1 lg:sticky lg:top-24">
            {rules.map((r, i) => (
              <li key={r.id}>
                <a href={`#${r.id}`} className="flex gap-3 rounded-[7px] px-2 py-1.5 text-[14px] text-ink-2 hover-device:hover:bg-hover hover-device:hover:text-ink">
                  <span className="font-mono text-[12px] text-ink-4">{String(i + 1).padStart(2, '0')}</span>
                  {r.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="divide-y divide-line lg:col-span-8 lg:col-start-5">
          {rules.map((r, i) => (
            <section key={r.id} id={r.id} aria-labelledby={`${r.id}-t`} className="scroll-mt-24 py-8 first:pt-0">
              <p className="font-mono text-[12px] text-ink-3">{String(i + 1).padStart(2, '0')}</p>
              <h2 id={`${r.id}-t`} className="mt-2 text-[34px] leading-tight">
                {r.title}
              </h2>
              <div className="mt-4 grid max-w-2xl gap-3 text-[16px] leading-relaxed text-ink-2">{r.body}</div>
            </section>
          ))}
          <div className="flex flex-wrap gap-3 pt-8">
            <Button variant="primary" size="lg" to="/launch" arrow>
              Write a covenant
            </Button>
            <Button size="lg" to="/launches">
              See launches
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

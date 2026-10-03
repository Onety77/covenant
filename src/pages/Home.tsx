import { Link } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { activity, getProject, projects } from '@/data/projects'
import { useNow } from '@/lib/live'
import { openReviews } from '@/lib/reviews'
import { NEEDED, PANEL } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { SectionHead } from '@/components/ui/Section'
import { CovenantCard } from '@/components/covenant/CovenantCard'
import { LaunchRow } from '@/components/covenant/LaunchRow'
import { ReviewRow } from '@/components/covenant/ReviewRow'
import { ActivityStrip } from '@/components/home/ActivityStrip'
import { Outcomes } from '@/components/home/Outcomes'
import { Stakes } from '@/components/home/Stakes'

export function Home() {
  const now = useNow()
  const featured = getProject('lantern')!
  const reviews = openReviews()
  const live = projects.filter((p) => p.covenant.state === 'active' && p.id !== featured.id).slice(0, 5)

  return (
    <>
      <section className="wrap pt-8 pb-14 sm:pt-14 lg:pt-14">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="text-display lg:col-span-7">
            A roadmap you can <em className="italic">hold them to.</em>
          </h1>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="text-lead text-ink-2 max-sm:hidden">
              Covenant is a Solana launchpad where every builder bonds <span className="text-ink">10 SOL</span>, <span className="text-ink">15% of supply</span> and their{' '}
              <span className="text-ink">creator fees</span> to three milestones. Prove them and it’s released. Miss one and holders get it.
            </p>
            <p className="text-[16px] leading-normal text-ink-2 sm:hidden">
              Builders bond <span className="text-ink">10 SOL</span>, <span className="text-ink">15% of supply</span> and their <span className="text-ink">fees</span> to three milestones. Miss one and holders get it.
            </p>
            <div className="mt-5 flex gap-2 sm:mt-6 sm:gap-3">
              <Button variant="primary" size="lg" to="/launches" arrow className="max-sm:h-11 max-sm:flex-1 max-sm:px-3">
                Explore launches
              </Button>
              <Button variant="secondary" size="lg" to="/launch" className="max-sm:h-11 max-sm:flex-1 max-sm:px-3">
                Launch a project
              </Button>
            </div>
          </div>
        </div>
        <CovenantCard project={featured} now={now} className="mt-8 lg:mt-12" />
      </section>

      <ActivityStrip items={activity} now={now} />

      <section aria-labelledby="stakes" className="wrap py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead id="stakes" label="Before launch" title="The builder puts something up first." className="lg:col-span-7" />
          <p className="text-[16px] leading-relaxed text-ink-2 lg:col-span-5">
            A covenant is signed before the token exists. Three measurable milestones, due within 90 days, and everything below locked against them. Hatched means held. Solid means
            released.
          </p>
        </div>
        <div className="mt-10">
          <Stakes />
        </div>
      </section>

      <section aria-labelledby="ends" className="border-t border-line bg-raised">
        <div className="wrap py-20 lg:py-28">
          <SectionHead id="ends" label="Day 90, or sooner" title="Every covenant ends one of three ways." />
          <div className="mt-10">
            <Outcomes
              now={now}
              items={[
                {
                  project: getProject('orchard')!,
                  title: 'Fulfilled',
                  body: 'All three milestones proven. The builder has their full 15%, every pledged fee, and the bond back.',
                },
                {
                  project: getProject('meridian')!,
                  title: 'Defaulted',
                  body: 'A deadline passes without approved proof. What’s left of the bond and pledged fees opens for holders to claim by burning their tokens.',
                },
                {
                  project: getProject('wren')!,
                  title: 'Handed over',
                  body: 'After a default, another builder can post a fresh bond and take on the roadmap. Same token, same holders, new accountability.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="verify" className="wrap grid gap-10 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <SectionHead id="verify" label="Who decides" title="Proof goes to people with their own stake.">
            <p>
              Builders submit proof against the milestone’s measure. A panel of {PANEL} staked verifiers reviews it, and {NEEDED} matching verdicts decide. Proof submitted before the
              deadline counts, even if the review finishes after it.
            </p>
          </SectionHead>
          <Link to="/verify" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-text hover-device:hover:underline">
            Open the review queue <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <p className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="label">In review now</span>
              <span className="font-mono text-[11px] text-ink-3">{reviews.length} open</span>
            </p>
            <ul className="divide-y divide-line">
              {reviews.map((r) => (
                <li key={r.id}>
                  <ReviewRow item={r} now={now} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="live" className="border-t border-line">
        <div className="wrap py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead id="live" label="In term" title="Launches on the clock." />
            <Button to="/launches" arrow>
              All launches
            </Button>
          </div>
          <div className="mt-10 overflow-hidden rounded-card border border-line bg-surface">
            <ul className="divide-y divide-line">
              {live.map((p) => (
                <li key={p.id}>
                  <LaunchRow project={p} now={now} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="limits" className="wrap pb-20 lg:pb-28">
        <div className="grid gap-10 rounded-card bg-ink p-6 text-bg sm:p-10 lg:grid-cols-12 lg:p-14">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] tracking-[0.06em] uppercase opacity-60">Fee recovery</p>
            <h2 id="limits" className="mt-3 text-h2">One way in. Four doors it can’t open.</h2>
            <p className="mt-4 text-[15px] leading-relaxed opacity-75">
              If creator fees get technically stranded, say a builder loses the key that claims them, there’s a narrow path to recover those fees into the covenant. It was built so it can’t
              reach anything else.
            </p>
          </div>
          <div className="grid gap-px self-start overflow-hidden rounded-[10px] bg-bg/15 sm:grid-cols-2 lg:col-span-7">
            <div className="bg-ink p-5 sm:col-span-2">
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <Check className="size-4 text-proven" strokeWidth={3} /> Can recover
              </p>
              <p className="mt-1 text-[14px] opacity-70">Stranded creator trading fees, back into the covenant’s fee vault.</p>
            </div>
            {['Locked liquidity', 'Builder bonds', 'Escrowed tokens', 'Holder funds'].map((k) => (
              <p key={k} className="flex items-center gap-2 bg-ink p-5 text-[15px] font-semibold">
                <X className="size-4 text-default" strokeWidth={3} /> Can’t touch {k.toLowerCase()}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="start" className="border-t border-line">
        <div className="wrap flex flex-col items-start gap-8 py-20 lg:flex-row lg:items-end lg:justify-between lg:py-28">
          <h2 id="start" className="max-w-3xl text-display">
            Launch with <em className="italic">something at stake.</em>
          </h2>
          <div className="flex gap-3">
            <Button variant="primary" size="lg" to="/launch" arrow>
              Launch a project
            </Button>
            <Button size="lg" to="/how-it-works">
              How it works
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

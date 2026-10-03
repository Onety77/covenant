import { useMemo, useState } from 'react'
import { Check, ImagePlus } from 'lucide-react'
import { m } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { dayErrors, draftProject, emptyDraft, type Draft } from '@/lib/draft'
import { sol } from '@/lib/format'
import { useNow } from '@/lib/live'
import { BOND_SOL, ESCROW_PCT } from '@/lib/rules'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { TokenArt } from '@/components/ui/TokenArt'
import { Meter } from '@/components/covenant/Meter'
import { TermRail } from '@/components/covenant/TermRail'
import { MilestoneEditor } from '@/components/launch/MilestoneEditor'
import { useWallet } from '@/components/layout/wallet'
import { useTitle } from '@/lib/useTitle'

const steps = ['Token', 'Milestones', 'Stakes', 'Sign'] as const
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))
const BALANCE = 42.6

const example: Draft = {
  name: 'Lanternfish',
  ticker: 'LANTN',
  tagline: 'A wallet-activity API for Solana apps',
  milestones: [
    { title: 'Public API live', measure: 'The public API answers 99% of requests within 300 ms for 14 straight days.', target: '99% uptime · 14 days', dueDay: 30 },
    { title: '500 paying API keys', measure: 'At least 500 distinct keys pay for usage, settled onchain to the project treasury.', target: '500 paying keys', dueDay: 60 },
    { title: '$20k monthly revenue', measure: 'Treasury receives at least $20,000 in fees over any 30-day window before day 90.', target: '$20,000 / 30 days', dueDay: 90 },
  ],
}

/**
 * Write the covenant, then launch. The preview beside the form (pinned under the header on
 * phones) is the covenant exactly as holders will see it.
 */
export function Launch() {
  useTitle('Launch a token')
  const now = useNow()
  const { address, connect } = useWallet()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(emptyDraft)
  const [tried, setTried] = useState(false)
  const [acks, setAcks] = useState([false, false, false])
  const [final, setFinal] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'bond' | 'token' | 'done' | 'error'>('idle')
  const preview = useMemo(() => draftProject(d, now), [d, now])

  const tokenErrors = {
    name: !d.name.trim() ? 'Give it a name' : null,
    ticker: !/^[A-Z0-9]{2,8}$/.test(d.ticker) ? '2–8 letters or numbers' : null,
    tagline: d.tagline.trim().length < 8 ? 'One short line' : null,
  }
  const days = dayErrors(d.milestones)
  const msErrors = d.milestones.map((m, i) => ({
    title: !m.title.trim() ? 'Name it' : null,
    target: !m.target.trim() ? 'What number?' : null,
    measure: m.measure.trim().length < 30 ? 'Write the full test in a sentence' : !/\d/.test(m.measure) ? 'Include a number verifiers can check' : null,
    dueDay: days[i],
  }))
  const valid = [
    Object.values(tokenErrors).every((e) => !e),
    msErrors.every((e) => Object.values(e).every((x) => !x)),
    acks.every(Boolean),
    final,
  ]

  const next = () => {
    if (!valid[step]) return setTried(true)
    setTried(false)
    setStep(step + 1)
    window.scrollTo({ top: 0 })
  }

  const launch = async () => {
    if (!address) return connect()
    if (!final) return setTried(true)
    setPhase('bond')
    try {
      await wait(1100)
      setPhase('token')
      await wait(1300)
      setPhase('done')
      window.scrollTo({ top: 0 })
    } catch {
      setPhase('error')
    }
  }

  if (phase === 'done') {
    return (
      <div className="wrap pt-10 pb-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-[13px] text-ink-2"><span aria-hidden className="size-1.5 rounded-full bg-proven" />Covenant signed</p>
          <h1 className="mt-3 text-h1">
            ${d.ticker} is live. <span className="text-ink-3">Day 0 of 90.</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
            Your {BOND_SOL} SOL bond and {ESCROW_PCT}% of supply are held under the covenant, and every creator fee from here on is pledged to it. M1 is due on day {d.milestones[0].dueDay}.
          </p>
        </div>
        <TermRail covenant={preview.covenant} now={now} className="mt-10" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" to="/" arrow>
            See it on the board
          </Button>
          <Button
            onClick={() => {
              setD(emptyDraft)
              setStep(0)
              setAcks([false, false, false])
              setFinal(false)
              setPhase('idle')
            }}
          >
            Start another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* phones: the covenant you're writing stays in view */}
      <div className="sticky top-14 z-30 border-b border-line bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md lg:hidden">
        <div className="wrap flex items-center gap-3 py-2.5">
          <TokenArt seed={preview.ticker} src={d.image} size={32} />
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[14px] font-semibold">{preview.name}</span>
              <span className="shrink-0 font-mono text-[11px] text-ink-3">
                Step {step + 1} of {steps.length}
              </span>
            </p>
            <Meter covenant={preview.covenant} now={now} className="mt-2" />
          </div>
        </div>
      </div>

      <div className="wrap pt-6 pb-16 lg:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-h1">Launch a token</h1>
          <button type="button" onClick={() => setD(example)} className="text-[13px] font-semibold text-ink-2 underline decoration-line-2 underline-offset-4 hover-device:hover:text-ink">
            Fill with an example
          </button>
        </div>

        <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Steps">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? 'step' : undefined}
                className="group w-full text-left disabled:cursor-default"
              >
                <span className="block h-1 overflow-hidden rounded-full bg-line-2">
                  <m.span className="block h-full origin-left rounded-full bg-ink" initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE_OUT }} />
                </span>
                <span className={cn('mt-2 flex items-center gap-1.5 text-[13px] font-medium', i === step ? 'text-ink' : 'text-ink-3')}>
                  {i < step ? <Check className="size-3.5" strokeWidth={3} /> : <span className="font-mono text-[11px]">{i + 1}</span>}
                  <span className="max-sm:sr-only">{s}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 [&>*]:min-w-0">
          <form
            className="lg:col-span-7"
            onSubmit={(e) => {
              e.preventDefault()
              if (step < 3) next()
              else launch()
            }}
            noValidate
          >
            <m.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: EASE_OUT }}>
              {step === 0 && (
                <div className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <TokenArt seed={preview.ticker} src={d.image} size={72} />
                    <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-control bg-raised px-3.5 text-[14px] font-semibold has-focus-visible:outline-2 has-focus-visible:outline-accent">
                      <ImagePlus className="size-4" /> {d.image ? 'Change image' : 'Add image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) setD({ ...d, image: URL.createObjectURL(f) })
                        }}
                      />
                    </label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
                    <Field label="Name" name="name" autoComplete="off" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} maxLength={32} error={tried ? tokenErrors.name : null} />
                    <Field
                      label="Ticker"
                      name="ticker"
                      autoComplete="off"
                      autoCapitalize="characters"
                      value={d.ticker}
                      onChange={(e) => setD({ ...d, ticker: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                      maxLength={8}
                      className="[&_input]:font-mono"
                      error={tried ? tokenErrors.ticker : null}
                    />
                  </div>
                  <Field label="One line" name="tagline" value={d.tagline} onChange={(e) => setD({ ...d, tagline: e.target.value })} maxLength={60} hint="What you’re building, in the words holders will see first" error={tried ? tokenErrors.tagline : null} />
                  <p className="text-[13px] leading-relaxed text-ink-3">
                    Launches as a Token-2022 token on Meteora’s bonding curve. 1B supply, metadata fixed at launch.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4">
                  <p className="text-[15px] leading-relaxed text-ink-2">
                    Three things that will be true, each one checkable by a stranger. Verifiers judge the measure exactly as written, so write it the way you’d want it read.
                  </p>
                  {d.milestones.map((m, i) => (
                    <MilestoneEditor
                      key={i}
                      n={i + 1}
                      value={m}
                      start={preview.covenant.startedAt}
                      errors={tried ? msErrors[i] : { dueDay: days[i] }}
                      onChange={(v) => setD({ ...d, milestones: d.milestones.map((x, j) => (j === i ? v : x)) })}
                    />
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-3">
                  <p className="text-[15px] leading-relaxed text-ink-2">These terms are the same for every launch. Confirm each one; they’re locked when you sign.</p>
                  {[
                    [`${BOND_SOL} SOL bond`, `Taken from your wallet at launch. Returned on day 90 if all three milestones are proven; forfeit to holders on a default.`],
                    [`${ESCROW_PCT}% of supply in escrow`, `Your allocation unlocks 5% per proven milestone. Unproven shares pass to a replacement builder after a default.`],
                    ['Every creator fee', 'Your share of trading fees goes into the covenant and is released with your milestones. On a default, unreleased fees go to holders.'],
                  ].map(([t, b], i) => (
                    <label key={t} className={cn('flex cursor-pointer gap-4 rounded-[14px] bg-surface p-4 ring-1 transition-shadow sm:p-5', acks[i] ? 'ring-ink-3' : 'ring-transparent', tried && !acks[i] && 'ring-default')}>
                      <span aria-hidden className="held mt-0.5 h-10 w-12 shrink-0 rounded-[5px] bg-raised" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[16px] font-semibold">{t}</span>
                        <span className="mt-1 block text-[14px] leading-relaxed text-ink-2">{b}</span>
                      </span>
                      <input type="checkbox" checked={acks[i]} onChange={(e) => setAcks(acks.map((a, j) => (j === i ? e.target.checked : a)))} className="mt-1 size-5 shrink-0 accent-[var(--accent)]" />
                    </label>
                  ))}
                  <p className="mt-2 text-[13px] text-ink-3">At graduation, the curve’s liquidity moves to a DAMM v2 pool and is locked permanently. That isn’t yours to stake; it belongs to the market.</p>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4">
                  <dl className="divide-y divide-line">
                    {[
                      ['Token', `${d.name} · $${d.ticker}`],
                      ...d.milestones.map((m, i) => [`M${i + 1} · day ${m.dueDay}`, `${m.title}: ${m.target}`]),
                      ['You put up', `${BOND_SOL} SOL · ${ESCROW_PCT}% of supply · all creator fees`],
                      ['Wallet', address ? `${address} · ${sol(BALANCE)}` : 'Not connected'],
                    ].map(([k, v]) => (
                      <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[150px_1fr] sm:gap-4">
                        <dt className="label pt-0.5">{k}</dt>
                        <dd className="text-[14px]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className={cn('flex items-start gap-3 rounded-[14px] bg-surface p-4 text-[14px] leading-relaxed ring-1 sm:p-5', tried && !final ? 'ring-default' : 'ring-transparent')}>
                    <input type="checkbox" checked={final} onChange={(e) => setFinal(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--default)]" />
                    If a deadline passes without approved proof, the covenant defaults on its own. I lose what’s still held, and nobody, including me, can stop it.
                  </label>
                  {phase === 'error' && (
                    <p role="alert" className="text-[13px] text-default">
                      The launch didn’t go through. No bond was taken. Try again.
                    </p>
                  )}
                </div>
              )}

            </m.div>

            {tried && !valid[step] && (
              <p role="alert" className="mt-4 text-[13px] text-default">
                {step === 2 ? 'Confirm all three terms to continue.' : step === 3 ? 'Confirm you understand the default terms.' : 'A few fields need a look.'}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {step > 0 && phase === 'idle' && (
                <Button onClick={() => setStep(step - 1)} size="lg">
                  Back
                </Button>
              )}
              <Button type="submit" variant="primary" size="lg" className="flex-1 disabled:opacity-100 sm:flex-none" disabled={phase === 'bond' || phase === 'token'}>
                {step < 3
                  ? `Continue to ${steps[step + 1].toLowerCase()}`
                  : !address
                    ? 'Connect wallet to sign'
                    : phase === 'bond'
                      ? `Posting ${BOND_SOL} SOL bond…`
                      : phase === 'token'
                        ? 'Creating token…'
                        : `Sign and launch · ${BOND_SOL} SOL`}
              </Button>
            </div>
          </form>

          <aside className="hidden lg:col-span-5 lg:block" aria-label="Preview">
            <div className="sticky top-24 rounded-[16px] bg-surface [--rail-bg:var(--surface)]">
              <div className="flex items-center gap-3 px-5 pt-5">
                <TokenArt seed={preview.ticker} src={d.image} size={48} />
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold">
                    {preview.name} <span className="font-mono text-[12px] font-normal text-ink-3">${preview.ticker}</span>
                  </p>
                  <p className="truncate text-[13px] text-ink-3">{preview.tagline}</p>
                </div>
              </div>
              <div className="p-5">
                <TermRail covenant={preview.covenant} now={now} stacked />
              </div>
              <p className="px-5 pb-5 text-[12px] text-ink-3">This is how holders will see your covenant.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

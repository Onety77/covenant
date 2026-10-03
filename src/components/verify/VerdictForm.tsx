import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Verdict } from '@/types'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { useWallet } from '@/components/layout/wallet'

interface Props {
  /** your verdict, if you've already cast one */
  cast?: { verdict: Verdict; note: string }
  closed: boolean
  onSubmit: (verdict: Verdict, note: string) => Promise<void>
}

/** Approve or reject, with a reason the builder and holders will read. */
export function VerdictForm({ cast, closed, onSubmit }: Props) {
  const { address, connect } = useWallet()
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [note, setNote] = useState('')
  const [checked, setChecked] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (cast) {
    return (
      <div className="rounded-card border border-line bg-surface p-5" role="status">
        <p className="label">Your verdict</p>
        <p className={cn('mt-2 flex items-center gap-2 text-[20px] font-semibold', cast.verdict === 'approve' ? 'text-proven' : 'text-default')}>
          {cast.verdict === 'approve' ? <Check className="size-5" strokeWidth={3} /> : <X className="size-5" strokeWidth={3} />}
          {cast.verdict === 'approve' ? 'Approved' : 'Rejected'}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{cast.note}</p>
        <p className="mt-4 text-[12px] text-ink-3">Recorded onchain. It counts once the panel reaches three matching verdicts.</p>
      </div>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return connect()
    if (!verdict) return setError('Choose approve or reject.')
    if (note.trim().length < 20) return setError('Give a reason of at least a sentence. The builder and holders will read it.')
    if (!checked) return setError('Confirm you checked the evidence against the measure.')
    setError(null)
    setPending(true)
    try {
      await onSubmit(verdict, note.trim())
    } catch {
      setError('Your verdict wasn’t recorded. Try again.')
      setPending(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface p-5" noValidate>
      <fieldset>
        <legend className="label">Your verdict</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(['approve', 'reject'] as const).map((v) => (
            <label
              key={v}
              className={cn(
                'flex h-14 cursor-pointer items-center justify-center gap-2 rounded-control border text-[15px] font-semibold transition-colors has-focus-visible:outline-2 has-focus-visible:outline-blue',
                verdict === v ? (v === 'approve' ? 'border-proven bg-proven-soft text-proven' : 'border-default bg-default-soft text-default') : 'border-line-2 text-ink-2 hover-device:hover:bg-hover',
              )}
            >
              <input type="radio" name="verdict" value={v} checked={verdict === v} onChange={() => setVerdict(v)} className="sr-only" disabled={closed} />
              {v === 'approve' ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
              {v === 'approve' ? 'Approve' : 'Reject'}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 block">
        <span className="label">Reason</span>
        <textarea
          name="note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={closed}
          placeholder="What you checked, and whether it meets the measure as written."
          className="mt-1.5 block w-full rounded-control border border-line-2 bg-surface p-3 text-[14px] leading-relaxed outline-none focus:border-blue"
        />
      </label>
      <label className="mt-3 flex items-start gap-2.5 text-[13px] text-ink-2">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 size-4 accent-[var(--blue)]" disabled={closed} />
        I checked the evidence against the measure as written, not against what the builder meant.
      </label>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-default">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" className="mt-4 w-full disabled:opacity-100" disabled={closed || pending}>
        {closed ? 'Review closed' : !address ? 'Connect wallet' : pending ? 'Signing…' : 'Sign verdict'}
      </Button>
    </form>
  )
}

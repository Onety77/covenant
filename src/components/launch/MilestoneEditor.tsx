import type { DraftMilestone } from '@/lib/draft'
import { date } from '@/lib/format'
import { addDays } from '@/lib/rules'
import { Area, Field } from '@/components/ui/Field'

interface Props {
  n: number
  value: DraftMilestone
  start: string
  errors: Partial<Record<keyof DraftMilestone, string | null>>
  onChange: (v: DraftMilestone) => void
}

/** One milestone: what will be true, how anyone can check it, and by when. */
export function MilestoneEditor({ n, value: m, start, errors, onChange }: Props) {
  const set = <K extends keyof DraftMilestone>(k: K, v: DraftMilestone[K]) => onChange({ ...m, [k]: v })
  return (
    <fieldset className="rounded-[16px] bg-surface p-4 sm:p-5">
      <legend className="sr-only">Milestone {n}</legend>
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-[7px] bg-raised font-mono text-[12px] font-medium text-ink">M{n}</span>
        <p className="text-[13px] text-ink-3">Releases 5% of supply when proven</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Title" name={`m${n}-title`} value={m.title} onChange={(e) => set('title', e.target.value)} placeholder="Public API live" maxLength={40} error={errors.title} />
        <Field label="Target" name={`m${n}-target`} value={m.target} onChange={(e) => set('target', e.target.value)} placeholder="500 paying keys" maxLength={28} error={errors.target} hint="The number verifiers will check" />
        <Area
          className="sm:col-span-2"
          label="Measure"
          name={`m${n}-measure`}
          rows={2}
          value={m.measure}
          onChange={(e) => set('measure', e.target.value)}
          placeholder="At least 500 distinct keys pay for usage, settled onchain to the project treasury."
          error={errors.measure}
          hint="One sentence anyone can check. Name the number and where the evidence lives."
        />
      </div>
      <label className="mt-5 block">
        <span className="flex items-baseline justify-between">
          <span className="label">Due</span>
          <span className="font-mono text-[13px] tabular">
            Day {m.dueDay} · {date(addDays(start, m.dueDay))}
          </span>
        </span>
        <input type="range" name={`m${n}-due`} min={14} max={90} step={1} value={m.dueDay} onChange={(e) => set('dueDay', Number(e.target.value))} className="mt-3 w-full accent-[var(--accent)]" />
        {errors.dueDay && <span className="mt-1 block text-[12px] text-default">{errors.dueDay}</span>}
      </label>
    </fieldset>
  )
}

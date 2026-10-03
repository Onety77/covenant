import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Project } from '@/types'
import { MiniRail } from '@/components/covenant/MiniRail'
import { TokenMark } from '@/components/ui/TokenMark'

interface Outcome {
  project: Project
  title: string
  body: string
}

/** The three ways a covenant ends, each shown on a real (sample) launch that ended that way. */
export function Outcomes({ items, now }: { items: Outcome[]; now: number }) {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {items.map((o, i) => (
        <li key={o.project.id} className="flex flex-col rounded-card border border-line bg-surface">
          <div className="flex-1 p-6">
            <p className="font-mono text-[11px] text-ink-3">0{i + 1}</p>
            <h3 className="mt-3 font-display text-[30px] leading-[1.05] font-normal">{o.title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{o.body}</p>
          </div>
          <Link to={`/p/${o.project.id}`} className="group flex items-center gap-3 border-t border-line px-6 py-4 hover-device:hover:bg-hover">
            <TokenMark ticker={o.project.ticker} size={28} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center justify-between text-[13px] font-semibold">
                {o.project.name}
                <ArrowRight className="size-3.5 text-ink-3" />
              </p>
              <MiniRail covenant={o.project.previous?.[0] ?? o.project.covenant} now={now} className="mt-2" />
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}

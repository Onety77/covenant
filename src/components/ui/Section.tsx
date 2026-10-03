import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A section's small label and serif head. */
export function SectionHead({ id, label, title, children, className }: { id?: string; label: string; title: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <p className="label">{label}</p>
      <h2 id={id} className="mt-3 text-h2">
        {title}
      </h2>
      {children && <div className="mt-4 text-[16px] leading-relaxed text-ink-2">{children}</div>}
    </div>
  )
}

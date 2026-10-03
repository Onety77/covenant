import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

/** Empty and error states: a calm message and the next action. */
export function Notice({ kind = 'empty', title, body, action, onAction, children, className }: { kind?: 'empty' | 'error'; title: string; body?: string; action?: string; onAction?: () => void; children?: ReactNode; className?: string }) {
  return (
    <div role={kind === 'error' ? 'alert' : undefined} className={cn('flex flex-col items-start rounded-card border border-dashed border-line-2 px-6 py-8', className)}>
      <p className={cn('text-h3 font-semibold', kind === 'error' && 'text-default')}>{title}</p>
      {body && <p className="mt-1.5 max-w-md text-[15px] text-ink-2">{body}</p>}
      {action && (
        <Button variant={kind === 'error' ? 'secondary' : 'primary'} className="mt-5" onClick={onAction}>
          {action}
        </Button>
      )}
      {children}
    </div>
  )
}

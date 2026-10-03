import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Base {
  label: string
  hint?: ReactNode
  error?: string | null
  className?: string
}

const box = 'mt-1.5 block w-full rounded-control border bg-surface px-3 text-[15px] outline-none transition-colors focus:border-blue'

/** A labelled text input with hint and error. */
export function Field({ label, hint, error, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn('block', className)}>
      <span className="text-[13px] font-semibold">{label}</span>
      <input {...rest} aria-invalid={Boolean(error)} className={cn(box, 'h-11', error ? 'border-default' : 'border-line-2')} />
      {(error || hint) && <span className={cn('mt-1.5 block text-[12px]', error ? 'text-default' : 'text-ink-3')}>{error || hint}</span>}
    </label>
  )
}

export function Area({ label, hint, error, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className={cn('block', className)}>
      <span className="text-[13px] font-semibold">{label}</span>
      <textarea {...rest} aria-invalid={Boolean(error)} className={cn(box, 'py-2.5 leading-relaxed', error ? 'border-default' : 'border-line-2')} />
      {(error || hint) && <span className={cn('mt-1.5 block text-[12px]', error ? 'text-default' : 'text-ink-3')}>{error || hint}</span>}
    </label>
  )
}

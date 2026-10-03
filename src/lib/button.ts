import { cn } from './cn'

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'buy' | 'sell'
export type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover-device:hover:brightness-105',
  secondary: 'bg-raised text-ink hover-device:hover:bg-[#22262c]',
  ghost: 'text-ink-2 hover-device:hover:text-ink hover-device:hover:bg-hover',
  danger: 'bg-default text-on-default hover-device:hover:brightness-110',
  buy: 'bg-proven text-[#04140b] hover-device:hover:brightness-110',
  sell: 'bg-default text-on-default hover-device:hover:brightness-110',
}
const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-[15px]',
}

export const buttonClass = (variant: Variant = 'secondary', size: Size = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap transition-[background-color,filter,color] duration-150 disabled:pointer-events-none disabled:opacity-40',
    variants[variant],
    sizes[size],
    className,
  )

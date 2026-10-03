import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

/** One tap between light and dark. The new theme spreads from the button. */
export function ThemeSwitch({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  const dark = theme === 'dark'
  return (
    <button
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? 'Switch to light' : 'Switch to dark'}
      className={cn('grid size-10 place-items-center rounded-control border border-line-2 text-ink-2 transition-colors hover-device:hover:bg-hover hover-device:hover:text-ink', className)}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

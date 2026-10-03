import { NavLink } from 'react-router-dom'
import { m } from 'motion/react'
import { cn } from '@/lib/cn'
import { SPRING_UI } from '@/lib/motion'
import { nav } from './nav'

/** Phones and tablets: the app's sections stay under the thumb, with Launch in the middle. */
export function BottomNav() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {nav.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={({ isActive }) => cn('relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors', isActive ? 'text-ink' : 'text-ink-3')}>
              {({ isActive }) =>
                to === '/launch' ? (
                <span className="grid size-10 place-items-center rounded-[12px] bg-accent-strong text-on-accent transition-transform active:scale-95">
                  <Icon className="size-5" strokeWidth={2.5} />
                </span>
              ) : (
                <>
                  {isActive && <m.span layoutId="tab-indicator" className="absolute top-0 h-0.5 w-8 rounded-full bg-ink" transition={SPRING_UI} />}
                  <Icon className="size-5" />
                  {label}
                </>
              )
              }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

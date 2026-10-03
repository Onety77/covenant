import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { nav } from './nav'

/** One quiet footer for every page. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Logo />
          <p className="text-[12px] text-ink-3">Tokens are volatile. A covenant is not a promise of returns.</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2">
          {[...nav, { to: '/launch', label: 'Launch a token' }].map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="hover-device:hover:text-ink">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

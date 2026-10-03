import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { nav } from './nav'
import { useWallet } from './wallet'

export function Header() {
  const { address, connect } = useWallet()
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
      <div className="wrap flex h-14 items-center gap-6 lg:h-16">
        <Link to="/" aria-label="Covenant home" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav
              .filter((n) => n.to !== '/launch')
              .map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) => cn('flex h-9 items-center rounded-[9px] px-3 text-[14px] font-medium transition-colors', isActive ? 'bg-raised text-ink' : 'text-ink-3 hover-device:hover:text-ink')}
                  >
                    {n.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>
        <form
          role="search"
          className="ml-auto hidden h-10 w-64 items-center gap-2 rounded-control bg-raised px-3 focus-within:ring-1 focus-within:ring-accent md:flex"
          onSubmit={(e) => {
            e.preventDefault()
            const q = new FormData(e.currentTarget).get('q')
            navigate(`/?q=${encodeURIComponent(String(q ?? ''))}#board`)
          }}
        >
          <Search className="size-4 text-ink-3" />
          <label htmlFor="header-search" className="sr-only">
            Search tokens
          </label>
          <input id="header-search" name="q" type="search" placeholder="Search name or ticker" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </form>
        <div className="flex items-center gap-2 max-md:ml-auto">
          <Button variant="secondary" onClick={connect} className="max-sm:h-9 max-sm:px-3 max-sm:text-[13px]">
            {address ? <span className="font-mono text-[13px]">{address}</span> : 'Connect'}
          </Button>
          <Button variant="primary" to="/launch" className="max-lg:hidden">
            Launch a token
          </Button>
        </div>
      </div>
    </header>
  )
}

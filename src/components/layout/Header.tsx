import { Link, NavLink } from 'react-router-dom'
import { m } from 'motion/react'
import { cn } from '@/lib/cn'
import { SPRING_UI } from '@/lib/motion'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { nav } from './nav'
import { useWallet } from './wallet'
import { SearchBox } from '@/components/search/SearchBox'
import { SearchSheet } from '@/components/search/SearchSheet'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const { address, connect } = useWallet()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
      <div className="wrap flex h-14 items-center gap-6 lg:h-16">
        <Link to="/" aria-label="Covenant home" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) => cn('relative flex h-9 items-center rounded-[9px] px-3 text-[14px] font-medium transition-colors', isActive ? 'text-ink' : 'text-ink-3 hover-device:hover:text-ink')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <m.span layoutId="nav-pill" className="absolute inset-0 rounded-[9px] bg-raised" transition={SPRING_UI} />}
                      <span className="relative">{n.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <SearchBox className="ml-auto hidden w-64 md:block lg:w-72" />
        <div className="flex items-center gap-2 max-md:ml-auto">
          <SearchSheet className="grid size-9 place-items-center rounded-control bg-raised text-ink-2 md:hidden" />
          <Button variant="secondary" onClick={connect} className="max-sm:h-9 max-sm:px-3 max-sm:text-[13px]">
            {address ? <span className="font-mono text-[13px]">{address}</span> : 'Connect'}
          </Button>
          <Button variant="primary" to="/launch" className="max-lg:hidden">
            Launch a token
          </Button>
          <MobileMenu className="sm:size-10 lg:hidden" />
        </div>
      </div>
    </header>
  )
}

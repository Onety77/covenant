import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { nav } from './nav'
import { ThemeSwitch } from './ThemeSwitch'
import { useWallet } from './wallet'

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { address, connect } = useWallet()

  // close the menu on navigation; lock scroll while it's open
  const [path, setPath] = useState(pathname)
  if (path !== pathname) {
    setPath(pathname)
    setOpen(false)
  }
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-8">
        <Link to="/" aria-label="Covenant home" className="rounded-md">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    cn('flex h-9 items-center rounded-control px-3 text-sm font-medium transition-colors', isActive ? 'bg-hover text-ink' : 'text-ink-2 hover-device:hover:text-ink')
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitch className="max-sm:hidden" />
          <Button variant="secondary" onClick={connect} className="max-md:hidden">
            {address ? <span className="font-mono text-[13px]">{address}</span> : 'Connect wallet'}
          </Button>
          <Button variant="primary" to="/launch" className="max-sm:h-9 max-sm:px-3">
            <span className="sm:hidden">Launch</span>
            <span className="max-sm:hidden">Launch a project</span>
          </Button>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-control border border-line-2 max-sm:size-9 lg:hidden"
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-bg lg:hidden">
          <nav aria-label="Main" className="wrap flex-1 overflow-y-auto pt-4">
            <ul className="flex flex-col">
              {[{ to: '/', label: 'Home' }, ...nav].map((n) => (
                <li key={n.to} className="border-b border-line">
                  <NavLink to={n.to} end className={({ isActive }) => cn('flex h-16 items-center justify-between font-display text-[34px]', !isActive && 'text-ink-2')}>
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {isActive && <span className="h-1 w-6 rounded-full bg-blue" />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="wrap flex items-center gap-3 pt-4 pb-[max(20px,env(safe-area-inset-bottom))]">
            <ThemeSwitch className="size-12" />
            <Button variant="secondary" size="lg" onClick={connect} className="flex-1">
              {address ? <span className="font-mono text-[13px]">{address}</span> : 'Connect wallet'}
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

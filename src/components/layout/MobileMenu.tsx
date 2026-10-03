import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE_OUT } from '@/lib/motion'
import { Button } from '@/components/ui/Button'
import { nav } from './nav'

/** Phones and tablets: a menu button that opens the site's sections under the header. */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // close on navigation
  const [path, setPath] = useState(pathname)
  if (path !== pathname) {
    setPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={cn('grid size-9 place-items-center rounded-control bg-raised text-ink-2', className)}
      >
        {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
      </button>
      {createPortal(<AnimatePresence>{open && <Panel />}</AnimatePresence>, document.body)}
    </>
  )
}

function Panel() {
  return (
    <m.div
      id="mobile-menu"
      className="fixed inset-x-0 top-[calc(56px+env(safe-area-inset-top))] bottom-0 z-40 flex flex-col bg-bg lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
    >
      <nav aria-label="Main" className="wrap flex-1 overflow-y-auto pt-3">
        <ul>
          {nav.map((n, i) => (
            <m.li key={n.to} className="border-b border-line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.03 + i * 0.04, ease: EASE_OUT }}>
              <NavLink to={n.to} end={n.to === '/'} className="flex items-center justify-between gap-4 py-4">
                {({ isActive }) => (
                  <>
                    <span>
                      <span className={cn('block font-display text-[24px] font-[650] tracking-[-0.03em] [font-stretch:108%]', !isActive && 'text-ink-2')}>{n.label}</span>
                      <span className="mt-0.5 block text-[13px] text-ink-3">{n.hint}</span>
                    </span>
                    {isActive && <span aria-hidden className="size-2 rounded-full bg-accent" />}
                  </>
                )}
              </NavLink>
            </m.li>
          ))}
        </ul>
      </nav>
      <m.div
        className="wrap flex pt-4 pb-[max(16px,env(safe-area-inset-bottom))]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2, ease: EASE_OUT }}
      >
        <Button variant="primary" size="lg" to="/launch" className="flex-1">
          Launch a token
        </Button>
      </m.div>
    </m.div>
  )
}

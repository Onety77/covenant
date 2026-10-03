import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { m } from 'motion/react'
import { EASE_OUT } from '@/lib/motion'
import { Footer } from './Footer'
import { Header } from './Header'
import { WalletCtx } from './wallet'

export function Shell() {
  const { pathname, hash } = useLocation()
  const [address, setAddress] = useState<string | null>(null)
  const connect = () => setAddress((a) => (a ? null : '5uGv…r2Wd'))

  // new page: top, unless the link points at a section (#redeem, #m2)
  useEffect(() => {
    const el = hash ? document.getElementById(hash.slice(1)) : null
    if (el) el.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <WalletCtx.Provider value={{ address, connect }}>
      <a href="#main" className="sr-only z-50 rounded-control bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {/* each page settles in; no exit wait, so navigation never feels slow */}
        <m.div key={pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
          <Outlet />
        </m.div>
      </main>
      <Footer />
    </WalletCtx.Provider>
  )
}

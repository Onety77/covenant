import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { WalletCtx } from './wallet'

export function Shell() {
  const { pathname } = useLocation()
  const [address, setAddress] = useState<string | null>(null)
  const connect = () => setAddress((a) => (a ? null : '5uGv…r2Wd'))

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <WalletCtx.Provider value={{ address, connect }}>
      <a href="#main" className="sr-only z-50 rounded-control bg-blue px-4 py-2 text-on-blue focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer variant={pathname === '/' ? 'full' : 'compact'} />
    </WalletCtx.Provider>
  )
}

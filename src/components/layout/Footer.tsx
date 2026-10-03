import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { docsUrl } from './nav'

const legal = '© 2026 Covenant. Tokens are volatile and a covenant is not a guarantee of returns. Nothing here is investment advice.'

const cols = [
  { head: 'Protocol', links: [['Launches', '/launches'], ['Launch a project', '/launch'], ['Defaults', '/defaults'], ['How it works', '/how-it-works']] },
  { head: 'Verifiers', links: [['Review queue', '/verify'], ['Become a verifier', docsUrl], ['Review guidelines', docsUrl]] },
  { head: 'Reference', links: [['Docs', docsUrl], ['Program addresses', docsUrl], ['Audits', docsUrl]] },
]

/** Full on the home page; one quiet row everywhere else so each page's own content is the last thing seen. */
export function Footer({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <footer className="border-t border-line">
        <div className="wrap flex flex-col gap-3 py-6 text-[12px] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>{legal}</p>
          <div className="flex gap-5 text-ink-2">
            <Link to="/how-it-works" className="hover-device:hover:text-ink">How it works</Link>
            <a href={docsUrl} className="hover-device:hover:text-ink">Docs</a>
          </div>
        </div>
      </footer>
    )
  }
  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-ink-3">A Solana launchpad where the roadmap is a contract, and the builder has something to lose.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {cols.map((c) => (
            <div key={c.head}>
              <p className="label">{c.head}</p>
              <ul className="mt-4 grid gap-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link to={href} className="text-sm text-ink-2 hover-device:hover:text-ink">{label}</Link>
                    ) : (
                      <a href={href} className="text-sm text-ink-2 hover-device:hover:text-ink">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="wrap">
        <p className="border-t border-line py-6 text-[12px] text-ink-3">{legal}</p>
      </div>
    </footer>
  )
}

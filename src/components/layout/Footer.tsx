import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { docsUrl } from './nav'

/** One quiet footer for every page. */
export function Footer() {
  return (
    <footer className="border-t border-line pb-20 lg:pb-0">
      <div className="wrap flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <p className="text-[12px] text-ink-3">Tokens are volatile. A covenant is not a promise of returns.</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-2">
          <li>
            <Link to="/rules" className="hover-device:hover:text-ink">Rules</Link>
          </li>
          <li>
            <a href={docsUrl} className="hover-device:hover:text-ink">Docs</a>
          </li>
          <li>
            <a href={docsUrl} className="hover-device:hover:text-ink">Program addresses</a>
          </li>
          <li>
            <a href={docsUrl} className="hover-device:hover:text-ink">Audits</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

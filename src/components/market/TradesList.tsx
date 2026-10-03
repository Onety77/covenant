import type { Project } from '@/types'
import { cn } from '@/lib/cn'
import { ago, sol } from '@/lib/format'
import { tokensFmt, trades } from '@/lib/market'

/** Latest trades, newest first (sample data). */
export function TradesList({ project, now }: { project: Project; now: number }) {
  const list = trades(project, now)
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="text-left">
          {['Side', 'SOL', project.ticker, 'Wallet', 'Age'].map((h, i) => (
            <th key={h} className={cn('label pb-2 font-normal', i > 0 && 'text-right', i === 3 && 'max-sm:hidden')}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-mono tabular">
        {list.map((t) => (
          <tr key={t.id} className="border-t border-line">
            <td className={cn('py-2.5 text-[12px] uppercase', t.side === 'buy' ? 'text-proven' : 'text-default')}>{t.side}</td>
            <td className="py-2.5 text-right">{sol(t.sol, 3).replace(' SOL', '')}</td>
            <td className="py-2.5 text-right text-ink-2">{tokensFmt(t.tokens)}</td>
            <td className="py-2.5 text-right text-ink-3 max-sm:hidden">{t.wallet}</td>
            <td className="py-2.5 text-right text-ink-3">{ago(new Date(t.at).toISOString(), now).replace(' ago', '')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

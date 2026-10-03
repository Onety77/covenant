const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

/** $1.2M, $284K, $920 */
export const usd = (n: number) => (n >= 1000 ? `$${compact.format(n)}` : `$${n.toFixed(0)}`)
/** prices keep precision: $0.00418, $1.82 */
export const price = (n: number) => `$${n < 1 ? n.toPrecision(3) : n.toFixed(2)}`
export const sol = (n: number, d = 1) => `${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })} SOL`
export const count = (n: number) => n.toLocaleString('en-US')
export const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`
export const change = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n * 100).toFixed(1)}%`

const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
export const date = (iso: string) => dayFmt.format(new Date(iso))

/** Time until `iso`: "12d 04h", "6h 21m", "14m". */
export function left(iso: string, now: number) {
  const s = Math.max(0, Math.floor((Date.parse(iso) - now) / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (d) return `${d}d ${String(h).padStart(2, '0')}h`
  if (h) return `${h}h ${String(m).padStart(2, '0')}m`
  return `${m}m`
}

/** A full clock for the one countdown that matters on a page: 12d 04:21:09 */
export function clock(iso: string, now: number) {
  let s = Math.max(0, Math.floor((Date.parse(iso) - now) / 1000))
  const d = Math.floor(s / 86400)
  s -= d * 86400
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${d ? `${d}d ` : ''}${hh}:${mm}:${ss}`
}

export function ago(iso: string, now: number) {
  const m = Math.round((now - Date.parse(iso)) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

import { useDeferredValue, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/types'
import { MIN_QUERY, searchTokens, trending } from './search'

/**
 * Search-as-you-type: suggestions appear from the second character, the arrow keys move
 * through them, Enter opens the highlighted token (or the best match), Escape closes.
 */
export function useSearchBox(onDone?: () => void) {
  const navigate = useNavigate()
  const [query, setQueryState] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const deferred = useDeferredValue(query)
  const hits = useMemo(() => searchTokens(deferred), [deferred])
  const popular = useMemo(() => trending(), [])
  const tooShort = query.trim().replace(/^\$/, '').length < MIN_QUERY
  const options: Project[] = tooShort ? popular : hits.map((h) => h.project)

  const setQuery = (q: string) => {
    setQueryState(q)
    setActive(-1)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setActive(-1)
  }

  const pick = (p: Project) => {
    navigate(`/p/${p.id}`)
    setQueryState('')
    close()
    onDone?.()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      if (!options.length) return
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((a) => (a + step + options.length) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const target = active >= 0 ? options[active] : !tooShort ? hits[0]?.project : undefined
      if (target) pick(target)
    } else if (e.key === 'Escape') {
      if (open) close()
      else onDone?.()
      e.currentTarget.blur()
    }
  }

  return { query, setQuery, open, setOpen, close, active, setActive, hits, popular, tooShort, options, pick, onKeyDown }
}

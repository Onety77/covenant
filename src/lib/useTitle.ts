import { useEffect } from 'react'

/** Sets the browser tab title for a page: "Lanternfish · Covenant". */
export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Covenant` : 'Covenant · Launch with something at stake'
  }, [title])
}

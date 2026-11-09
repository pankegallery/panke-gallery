import { useEffect, useState } from 'react'

/**
 * The current time, refreshed every minute, for things that depend on the
 * clock, such as whether a stream is live (#74).
 *
 * It is null in the build and on the first render in the browser, so the
 * static HTML and the hydrated page agree; time-dependent parts appear right
 * after that. Without the refresh, a page left open would never notice that
 * a stream started or ended.
 *
 * @param {number} [interval] - Milliseconds between updates. Defaults to one minute.
 * @returns {Date|null}
 */
export const useNow = (interval = 60 * 1000) => {
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])

  return now
}

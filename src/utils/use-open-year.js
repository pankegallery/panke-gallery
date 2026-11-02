import { useEffect } from 'react'

/**
 * Moves to the archive year in the URL (/exhibitions/<year>/,
 * /events/<year>/): when the page is opened at that URL, when a chip in the
 * year index is picked, and on back and forward (gatsby-browser.js leaves
 * the scrolling of these URLs to this hook). The year's section has the year
 * as its id. After a pick in the year index the keyboard focus moves to the
 * year heading too, as it would with an in-page link.
 *
 * @param {string} year - The year in the URL, or `''`.
 * @param {Object} location - The page's `location` prop.
 * @param {(year: string) => void} [onOpen] - Runs when a year is opened,
 *   e.g. to load its images on /exhibitions (#68). Pass a stable function
 *   (or none), since it is an effect dependency.
 * @param {string} [hiddenFallbackId] - Where to go instead when the year's
 *   section is hidden at this width. On /exhibitions such a year has all its
 *   shows in Recent, so this is `'recent'`.
 */
export const useOpenYear = (year, location, onOpen, hiddenFallbackId) => {
  const fromYearIndex = Boolean(location.state?.fromYearIndex)

  useEffect(() => {
    const section = year && document.getElementById(year)
    if (!section) return
    onOpen?.(year)

    if (section.offsetParent === null) {
      if (hiddenFallbackId) document.getElementById(hiddenFallbackId)?.scrollIntoView()
      return
    }
    section.scrollIntoView()
    if (fromYearIndex) section.querySelector('h3')?.focus({ preventScroll: true })
    // `location.key` changes on every navigation, so picking the year that
    // is already in the URL scrolls back to it.
  }, [year, location.key, fromYearIndex, onOpen, hiddenFallbackId])
}

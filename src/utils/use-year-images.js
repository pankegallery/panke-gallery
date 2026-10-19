import { useCallback, useEffect, useRef, useState } from 'react'
import { withPrefix } from 'gatsby'
import { yearImagesPath } from './exhibition-archive.mjs'

// How far below (or above) the viewport a year starts loading: a quarter
// of a screen. Its file is small and quick, and the browser then fetches
// the images themselves ahead of the scroll (`loading="lazy"`). A larger
// margin would load the first archive years on every visit at large widths,
// where the archive starts just below the first screen.
const ROOT_MARGIN = '25% 0px'

/**
 * Loads the images of archive years that /exhibitions doesn't carry in its
 * page data, one year at a time (#68): when the year's section (its id is
 * the bare year) comes within a quarter screen of the viewport, or when
 * `load(year)` is called, e.g. for a year opened from the year index or a
 * URL. Each year is fetched once, from the JSON file gatsby-node.js writes
 * to `yearImagesPath(year)`.
 *
 * @param {number[]} years - The years whose images are not in the page data.
 * @returns {[Object<number, Object<string, Object>>, (year: number|string) => void]}
 *   The loaded `gatsbyImageData` by year and exhibition slug, and `load`.
 */
export const useYearImages = (years) => {
  const [images, setImages] = useState({})
  const requested = useRef(new Set())
  // A string, so a new array with the same years doesn't re-run the effect.
  const key = years.join()

  const load = useCallback((value) => {
    const year = Number(value)
    if (!key.split(',').includes(String(year)) || requested.current.has(year)) return
    requested.current.add(year)

    fetch(withPrefix(yearImagesPath(year)))
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((bySlug) => setImages((loaded) => ({ ...loaded, [year]: bySlug })))
      .catch(() => requested.current.delete(year))
  }, [key])

  useEffect(() => {
    if (!key) return undefined
    const sections = key
      .split(',')
      .map((year) => document.getElementById(year))
      .filter(Boolean)

    // Sections stay observed: `load` skips years already requested, and a
    // year whose fetch failed is tried again when it comes back into view.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) load(target.id)
      }),
      { rootMargin: ROOT_MARGIN }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key, load])

  return [images, load]
}

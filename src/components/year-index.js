import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { getPankeColor } from '../theme/theme'
import { Bar, Chips, ChipItem, Chip } from './year-index/YearIndex.styles'

/**
 * Returns the id of the year section the reader is in: the last visible one
 * whose top has scrolled up to where a jump to it stops (its
 * `scroll-margin-top`, just below the sticky bar). At the very bottom of the
 * page it is the last section, which may be too short to get there. Above
 * the archive it is the first visible year. `null` on the server, so the
 * server-rendered markup and the first client render agree.
 */
const useActiveYear = (ids) => {
  const [active, setActive] = useState(null)
  // A string, so a new array with the same ids doesn't re-run the effect.
  const key = ids.join()

  useEffect(() => {
    let frame = null

    const update = () => {
      frame = null
      // Hidden sections (`display: none` at this width) have no offsetParent.
      const sections = key
        .split(',')
        .map((id) => document.getElementById(id))
        .filter((section) => section && section.offsetParent !== null)
      const atEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1

      let current = sections.length > 0 ? sections[0].id : null
      sections.forEach((section) => {
        const stop = parseFloat(getComputedStyle(section).scrollMarginTop) || 0
        if (section.getBoundingClientRect().top <= stop + 1) current = section.id
      })
      if (atEnd && sections.length > 0) current = sections[sections.length - 1].id

      setActive(current)
    }

    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [key])

  return active
}

/**
 * The year index of the exhibitions archive: a line of year chips between
 * two thin lines, each linking to the section whose id is the year. The
 * line scrolls sideways on phones and sticks to the top of the viewport
 * from `breakpoints.sm`. The chip of the year in view gets a 2px border in
 * the accent colour (the colour picked in the colour swap).
 *
 * @param {Object} props
 * @param {{year: number, hideFrom?: 'md'|'xl'}[]} props.years - The years
 *   to list, newest first. `hideFrom` hides a chip from that `media`
 *   breakpoint up, for a year whose shows are all in Recent there.
 */
const YearIndex = ({ years }) => {
  const { color } = useContext(ThemeContext)
  const activeId = useActiveYear(years.map(({ year }) => String(year)))

  return (
    <Bar aria-label="Archive by year">
      <Chips>
        {years.map(({ year, hideFrom }) => {
          const isActive = String(year) === activeId
          return (
            <ChipItem key={year} $hideFrom={hideFrom}>
              <Chip
                href={`#${year}`}
                $active={isActive}
                $accent={getPankeColor(color)}
                aria-current={isActive ? 'true' : undefined}
              >
                {year}
              </Chip>
            </ChipItem>
          )
        })}
      </Chips>
    </Bar>
  )
}

export default YearIndex

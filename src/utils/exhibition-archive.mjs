import Moment from 'moment'
import { groupByOpeningYear } from './group-by-opening-year.mjs'

/**
 * Rules of /exhibitions that the page and gatsby-node.js share: whether a
 * show is current, upcoming or past, how many past shows Recent holds, and
 * which archive years load their images later (#68). gatsby-node.js uses
 * them to decide which years the page data carries images for
 * (`imagesSince`) and to write the images of every year to
 * `yearImagesPath(year)`.
 *
 * An `.mjs` file, like `group-by-opening-year.mjs`, so gatsby-node.js can
 * `import()` it: Netlify builds on Node 18, which can't `require()` an ES
 * module, and only treats a file as one by its extension.
 */

// Compare whole days in Berlin summer time, as the page always has.
const day = (date) => Moment(new Date(date)).utcOffset(120)

export const isCurrent = ({ startDate, endDate }) =>
  day(startDate).isSameOrBefore(new Date(), 'day') && day(endDate).isSameOrAfter(new Date(), 'day')
export const isUpcoming = ({ startDate }) => day(startDate).isAfter(new Date(), 'day')
export const isPast = ({ endDate }) => day(endDate).isBefore(new Date(), 'day')

// Past shows in Recent: 4 on phones (one full-width column), then two
// lines of the page grid: 6 from `breakpoints.sm`, 8 from `breakpoints.xl`.
export const RECENT_COUNT = { sm: 4, md: 6, xl: 8 }

/**
 * The first day of the oldest archive year that /exhibitions renders with
 * images in its own page data: the year in which the last Recent show
 * opened. Everything from there on (features, Recent and the archive years
 * that share shows with Recent) comes complete with the page; older years
 * load their images when they are needed (#68).
 *
 * Over time shows only move from upcoming to past, so the last Recent show
 * can only get newer between two builds, never older than this date.
 *
 * @param {{startDate: string, endDate: string}[]} exhibitions - Newest first.
 * @returns {string} An ISO date, or 1970-01-01 (all years) while there are
 *   fewer past shows than fit into Recent.
 */
export const imagesSince = (exhibitions) => {
  const lastRecent = exhibitions.filter(isPast)[RECENT_COUNT.xl - 1]
  if (!lastRecent) return '1970-01-01'
  const [{ year }] = groupByOpeningYear([lastRecent])
  return `${year}-01-01`
}

/**
 * Where the images of one archive year are published, as a JSON object of
 * `gatsbyImageData` by exhibition slug. gatsby-node.js writes the files into
 * `public/`, and /exhibitions fetches them.
 *
 * @param {number|string} year
 * @returns {string}
 */
export const yearImagesPath = (year) => `/exhibition-images/${year}.json`

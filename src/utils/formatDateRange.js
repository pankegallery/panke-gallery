import Moment from 'moment'

export const DATE_TBC = 'Date to be confirmed'

// En dash between thin spaces (U+2009), as the site has always used.
const DASH = ' – '

/**
 * Splits an exhibition's date range into the text before and after the dash.
 * The year is repeated only when it changes, and a single-day show
 * (or one without an end date) gives just one date:
 *
 *   same day     → ['23 May 2025']
 *   same year    → ['10 September', '03 October 2026']
 *   across years → ['10 December 2022', '21 January 2023']
 *
 * Use this to render each half in its own element, e.g. `white-space: nowrap`
 * spans so a long range wraps only after the dash. Otherwise use
 * `formatDateRange`, which joins the parts with the dash.
 *
 * @param {string|Date} start - Start date (anything Moment can parse).
 * @param {string|Date} [end] - End date. Missing means a single day.
 * @param {Object} [options]
 * @param {boolean} [options.short=false] - Abbreviate months ("10 Sep"), for narrow columns.
 * @param {boolean} [options.tbc=false] - The date isn't fixed yet (Contentful's `dateTbc`).
 * @returns {string[]} One or two strings.
 */
export const dateRangeParts = (start, end, { short = false, tbc = false } = {}) => {
  // Without a start date there is nothing to show but the placeholder,
  // rather than Moment's "Invalid date".
  if (tbc || !start) return [DATE_TBC]

  const startDate = Moment(start)
  const endDate = Moment(end)
  const dayMonth = short ? 'DD MMM' : 'DD MMMM'
  const dayMonthYear = `${dayMonth} YYYY`

  if (!end || startDate.isSame(endDate, 'day')) {
    return [startDate.format(dayMonthYear)]
  }

  return [
    startDate.format(startDate.isSame(endDate, 'year') ? dayMonth : dayMonthYear),
    endDate.format(dayMonthYear),
  ]
}

/**
 * Formats an exhibition's date range as one string, e.g.
 * "10 September – 03 October 2026" or "10 Dec 2022 – 21 Jan 2023" with `short`.
 * Takes the same arguments as `dateRangeParts`.
 *
 * @param {string|Date} start
 * @param {string|Date} [end]
 * @param {{short?: boolean, tbc?: boolean}} [options]
 * @returns {string}
 */
export const formatDateRange = (start, end, options) =>
  dateRangeParts(start, end, options).join(DASH)

import React from 'react'
import { Link } from 'gatsby'
import Tag from './tag'
import { formatDateRange, formatEventTime } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { ItemDate, LongDate, ShortDate, Title } from './content/Item.styles'
import { EventRow, Subline, SeriesTag } from './event-preview/EventPreview.styles'

/**
 * One upcoming event on the homepage, as a row of the page `Grid`
 * (Layout.styles.js), which must be its parent: the date and time in the
 * first column, then title, subline and series tag (#69). On phones the row
 * stacks, with abbreviated months.
 *
 * Shares its date, title and subline with the exhibition items
 * (content/Item.styles.js); `$variant="event"` gives the title the base
 * size and the subline grey Roboto, as in the Recent grid.
 * The whole row links to the event through its title link (see `Title` in
 * content/Item.styles.js); the series tag stays a link of its own, to the
 * series on /events/.
 *
 * Used on the homepage and on /events/, which can be filtered by series.
 * In a list filtered by the event's own series the tag is left out: the
 * series overview and the list heading already name it.
 *
 * @param {object} props
 * @param {object} props.event - A Contentful event node with `slug`, `title`,
 *   `date`, `endTime`, `openEnd`, `eventSeries { name slug }` and
 *   `subtitleShortDescription.childMarkdownRemark.html`.
 * @param {string} [props.activeSeries] - Slug of the series /events/ is
 *   filtered by, or empty.
 * @param {number} [props.headingLevel] - Level of the title heading: 3, or
 *   4 under a year heading in the archive on /events/.
 */
const EventPreview = ({ event, activeSeries = '', headingLevel = 3 }) => {
  const time = formatEventTime(event)
  const sublineHtml = event.subtitleShortDescription?.childMarkdownRemark?.html
  const series = event.eventSeries
  const showSeries = Boolean(series) && series.slug !== activeSeries

  return (
    <EventRow>
      <Title as={`h${headingLevel}`}>
        <Link to={`/event/${event.slug}`}>{keepSeparatorsAttached(event.title)}</Link>
      </Title>

      {sublineHtml && (
        <Subline
          $variant="event"
          dangerouslySetInnerHTML={{ __html: processExternalLinks(sublineHtml) }}
        />
      )}

      {showSeries && (
        <SeriesTag>
          <Tag
            tag={series}
            type="eventSeries"
            to={`/events/${series.slug}/`}
            label={`Show only ${series.name} events`}
          />
        </SeriesTag>
      )}

      {/* Both month formats are rendered, and CSS picks one per width. */}
      <ItemDate>
        <LongDate $hasShort>{formatDateRange(event.date)} · {time}</LongDate>
        <ShortDate>{formatDateRange(event.date, undefined, { short: true })} · {time}</ShortDate>
      </ItemDate>
    </EventRow>
  )
}

export default EventPreview

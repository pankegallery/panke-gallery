import React from 'react'
import { Link } from 'gatsby'
import Moment from 'moment'
import Tag from './tag'
import { DASH, formatDateRange } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { ItemDate, LongDate, ShortDate, Title } from './exhibition-item/ExhibitionItem.styles'
import { EventRow, Subline, SeriesTag } from './event-preview/EventPreview.styles'

/** "19:00–21:00", or "19:00 – open end". */
const eventTime = ({ date, endTime, openEnd }) => {
  const start = Moment(date).format('HH:mm')
  if (openEnd) return `${start}${DASH}open end`
  return endTime ? `${start}–${Moment(endTime).format('HH:mm')}` : start
}

/**
 * One upcoming event on the homepage, as a row of the page `Grid`
 * (Layout.styles.js), which must be its parent: the date and time in the
 * first column, then title, subline and series tag (#69). On phones the row
 * stacks, with abbreviated months.
 *
 * Shares its type with the exhibition items: the date token, the 15px
 * title, and a Roboto subline like the artist line of the Recent grid.
 * The whole row links to the event through its title link (see `Title` in
 * ExhibitionItem.styles.js); the series tag stays a link of its own, to the
 * series on /events/.
 *
 * @param {object} props
 * @param {object} props.event - A Contentful event node with `slug`, `title`,
 *   `date`, `endTime`, `openEnd`, `eventSeries { name slug }` and
 *   `subtitleShortDescription.childMarkdownRemark.html`.
 */
const EventPreview = ({ event }) => {
  const time = eventTime(event)
  const sublineHtml = event.subtitleShortDescription?.childMarkdownRemark?.html
  const series = event.eventSeries

  return (
    <EventRow>
      <Title>
        <Link to={`/event/${event.slug}`}>{event.title}</Link>
      </Title>

      {sublineHtml && (
        <Subline
          $variant="card"
          dangerouslySetInnerHTML={{ __html: processExternalLinks(sublineHtml) }}
        />
      )}

      {series && (
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

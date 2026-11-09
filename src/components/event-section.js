import React from 'react'
import EventItem from './event-item'
import { Grid } from './layout/Layout.styles'
import { Section, Headline } from './content/Content.styles'

/**
 * A labelled block of event rows (EventItem) on the page `Grid`, as on the
 * homepage, /events and /rosa, so all three list events the same way.
 * Renders nothing without events.
 *
 * @param {Object} props
 * @param {string} props.label - Section label, e.g. "Upcoming events".
 * @param {Object[]} props.events - Event nodes, in the order to show them.
 * @param {string} [props.activeSeries] - Slug of a series the list is
 *   filtered by; its tag is left out of the rows (see EventItem).
 * @param {boolean} [props.withImage] - Rows with a thumbnail (see EventItem).
 * @param {string} [props.liveSlug] - Slug of the event whose stream is
 *   running; its row gets the "Live now" label (#74).
 * @param {React.ReactNode} [props.children] - Shown next to the label, e.g.
 *   the "See all events" link on the homepage.
 */
const EventSection = ({ label, events, activeSeries = '', withImage = false, liveSlug = '', children }) => {
  if (events.length === 0) return null

  return (
    <Section>
      <Headline>
        <h2>{label}</h2>
        {children}
      </Headline>
      <Grid>
        {events.map((event) => (
          <EventItem
            key={event.slug}
            event={event}
            activeSeries={activeSeries}
            withImage={withImage}
            live={Boolean(liveSlug) && event.slug === liveSlug}
          />
        ))}
      </Grid>
    </Section>
  )
}

export default EventSection

import React from 'react';
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import EventPreview from '../components/event-preview'
import Tag from '../components/tag'
import YearIndex from '../components/year-index'
import { Grid } from '../components/layout/Layout.styles'
import { Section, SectionStack, Headline, YearSection, YearHeading } from '../components/content/Content.styles';
import { groupByOpeningYear } from '../utils/group-by-opening-year.mjs'
import { useRouteParam } from '../utils/use-route-param';
import { useOpenYear } from '../utils/use-open-year'

// Past events shown under "Recent events" before the archive (#48).
const RECENT_COUNT = 3

// A year in the URL (/events/2024/); anything else there is a series slug.
const YEAR_PARAM = /^\d{4}$/

/**
 * The event series with the number of their events, most events first:
 * the programme lines of the gallery, shown between Recent and the archive.
 *
 * @param {Object[]} events - Event nodes.
 * @returns {{slug: string, name: string, count: number}[]}
 */
const countSeries = (events) => {
  const bySlug = new Map()
  events.forEach(({ eventSeries }) => {
    if (!eventSeries) return
    const entry = bySlug.get(eventSeries.slug) || { ...eventSeries, count: 0 }
    entry.count += 1
    bySlug.set(eventSeries.slug, entry)
  })
  return [...bySlug.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/**
 * The series overview: one tag per series, with its number of events. A
 * tag filters the page by its series (/events/<slug>/); the active one is
 * filled and leads back to all events.
 *
 * @param {Object} props
 * @param {{slug: string, name: string, count: number}[]} props.series
 * @param {string} [props.activeSeries] - Slug of the active series, or empty.
 */
const SeriesOverview = ({ series, activeSeries = '' }) => {
  if (series.length === 0) return null

  return (
    <Section>
      <Headline>
        <h2>Event series at panke.gallery</h2>
      </Headline>
      <nav aria-label="Event series">
        {series.map(({ slug, name, count }) => {
          const isSelected = slug === activeSeries
          return (
            <Tag
              key={slug}
              tag={{ slug, name }}
              type="eventSeries"
              count={count}
              selected={isSelected}
              to={isSelected ? '/events/' : `/events/${slug}/`}
              label={isSelected
                ? `Show all events, not only ${name}`
                : `Show only ${name} events (${count})`}
            />
          )
        })}
      </nav>
    </Section>
  )
}

/**
 * A labelled block of event rows on the page `Grid`. Renders nothing
 * without events.
 *
 * @param {Object} props
 * @param {string} props.label - Section label, e.g. "Recent events".
 * @param {Object[]} props.events - Event nodes.
 * @param {string} [props.activeSeries] - Slug of the active series, or empty.
 */
const EventSection = ({ label, events, activeSeries = '' }) => {
  if (events.length === 0) return null

  return (
    <Section>
      <Headline>
        <h2>{label}</h2>
      </Headline>
      <Grid>
        {events.map((event) => (
          <EventPreview key={event.slug} event={event} activeSeries={activeSeries} />
        ))}
      </Grid>
    </Section>
  )
}

/**
 * /events/ (#48): upcoming events, the three most recent past events, the
 * event series, and the archive of all older events by year. Text rows only,
 * the same as on the homepage, so the page stays light and the exhibitions
 * keep the emphasis.
 *
 * The page also answers to /events/<series-slug>/ and /events/<year>/
 * (`MATCH_PATHS` in gatsby-node.js), read with `useRouteParam`:
 * - A series (#64) shows the series overview on top and, below it, all
 *   events of that series in one list, newest first, so upcoming ones lead.
 *   A series has a few dozen events at most, so Recent, the archive and the
 *   year index would only split a short list. The active tag is filled and
 *   leads back to all events.
 * - A year opens the archive at that year, as on /exhibitions (`useOpenYear`).
 *
 * The static HTML is the full, unfiltered page, so every event is indexable;
 * a filter applies right after hydration. The filter lives only in the URL,
 * so it can be shared, bookmarked and undone with the back button.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result: all events, newest first.
 * @param {Object} props.params - Route parameters; `*` is a series or year.
 * @param {Object} props.location
 */
const PankeEvents = ({ data, params, location }) => {
  const param = useRouteParam(params)
  const year = YEAR_PARAM.test(param) ? param : ''
  const activeSeries = year ? '' : param

  const events = data.allContentfulEvent.nodes
  const series = countSeries(events)

  const now = new Date()
  // The query sorts newest first; upcoming events read better soonest first.
  const upcoming = events.filter(({ date }) => new Date(date) >= now).reverse()
  const past = events.filter(({ date }) => new Date(date) < now)
  const recent = past.slice(0, RECENT_COUNT)
  const archive = groupByOpeningYear(past.slice(RECENT_COUNT), ({ date }) => date)

  useOpenYear(year, location)

  const head = (
    <Helmet
      title="Events"
      meta={[
        {
          name: 'description',
          content: 'Upcoming and past events of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
        }
      ]}
    />
  )

  if (activeSeries) {
    const active = series.find(({ slug }) => slug === activeSeries)
    const seriesEvents = events.filter(({ eventSeries }) => eventSeries?.slug === activeSeries)

    return (
      <Layout wide>
        {head}
        <SectionStack>
          <SeriesOverview series={series} activeSeries={activeSeries} />

          {active ? (
            <EventSection label={active.name} events={seriesEvents} activeSeries={activeSeries} />
          ) : (
            // A series slug that matches no event, e.g. from an old link.
            <Section>
              <p>There are no events in this series. <Link to="/events/">Show all events</Link></p>
            </Section>
          )}
        </SectionStack>
      </Layout>
    )
  }

  return (
    <Layout wide>
      {head}
      <SectionStack>
        <EventSection label="Upcoming events" events={upcoming} />
        <EventSection label="Recent events" events={recent} />

        <SeriesOverview series={series} />

        {archive.length > 0 && (
          <Section>
            <Headline>
              <h2>Event archive</h2>
            </Headline>
            <YearIndex years={archive.map(({ year }) => ({ year }))} basePath="/events/" />

            {archive.map(({ year, items }) => (
              <YearSection key={year} id={String(year)} aria-labelledby={`year-${year}`}>
                {/* Focusable by script only, for useOpenYear. */}
                <YearHeading id={`year-${year}`} tabIndex={-1}>{year}</YearHeading>
                <Grid>
                  {items.map((event) => (
                    <EventPreview key={event.slug} event={event} headingLevel={4} />
                  ))}
                </Grid>
              </YearSection>
            ))}
          </Section>
        )}
      </SectionStack>
    </Layout>
  );
}

export default PankeEvents;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PankeEventsQuery {
    allContentfulEvent(
      sort: { fields: [date], order: DESC }
    ) {
      nodes {
        title
        slug
        date
        endTime
        openEnd
        eventSeries {
          slug
          name
        }
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`

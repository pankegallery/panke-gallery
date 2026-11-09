import React, { useContext, useEffect, useRef, useState } from 'react';
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import EventItem from '../components/event-item'
import EventSection from '../components/event-section'
import Tag from '../components/tag'
import YearIndex from '../components/year-index'
import { Grid } from '../components/layout/Layout.styles'
import { Section, SectionStack, Headline, TagList, TagButton, YearSection, YearHeading } from '../components/content/Content.styles';
import { groupByOpeningYear } from '../utils/group-by-opening-year.mjs'
import { useRouteParam } from '../utils/use-route-param';
import { useOpenYear } from '../utils/use-open-year'
import { theme, getPankeColor } from '../theme/theme'
import { ThemeContext } from '../contexts/ThemeContext'

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

// Lines of tags the series overview shows before "+ N more": more on
// phones, where only one or two series fit on a line.
const SERIES_LINES = { phone: 4, wide: 2 }

/**
 * How many items of a TagList fit on `lines` lines, with the list's last
 * item (the "+ N more" button) still at the end of the last line. The
 * number depends on the screen width, so it is measured in the browser,
 * again on every resize. `null` while not measured (the server-rendered
 * HTML, which lists every tag) and when everything fits.
 *
 * It measures by showing every item, then hiding items from the end until
 * the button moves up onto the last line; React then renders the same
 * `hidden` state from the returned number.
 *
 * @param {React.RefObject<HTMLElement>} listRef - The TagList.
 * @param {{phone: number, wide: number}} lines - Lines to show below and
 *   from `breakpoints.sm`.
 * @param {boolean} enabled - Off while the list is expanded.
 * @returns {number|null}
 */
const useVisibleTags = (listRef, lines, enabled) => {
  const [visible, setVisible] = useState(null)

  useEffect(() => {
    const list = listRef.current
    if (!list || !enabled) return undefined

    const phone = window.matchMedia(`(width < ${theme.breakpoints.sm})`)

    const measure = () => {
      const maxLines = phone.matches ? lines.phone : lines.wide
      const items = [...list.children]
      const more = items.pop()
      items.forEach((item) => { item.hidden = false })
      more.hidden = false

      const lineTops = [...new Set(items.map((item) => item.offsetTop))]
      if (lineTops.length <= maxLines) {
        more.hidden = true
        setVisible(null)
        return
      }

      const lastTop = lineTops[maxLines - 1]
      let fit = items.filter((item) => item.offsetTop <= lastTop).length
      items.forEach((item, index) => { item.hidden = index >= fit })
      while (fit > 0 && more.offsetTop > lastTop) {
        fit -= 1
        items[fit].hidden = true
      }
      setVisible(fit)
    }

    measure()
    const observer = new ResizeObserver(() => requestAnimationFrame(measure))
    observer.observe(list)
    return () => observer.disconnect()
  }, [listRef, lines, enabled])

  return visible
}

/**
 * The series overview: one tag per series, with its number of events. A
 * tag filters the page by its series (/events/<slug>/); the active one is
 * filled and leads back to all events.
 *
 * It shows SERIES_LINES lines of tags (4 on phones, 2 from
 * `breakpoints.sm`) and a "+ N more" tag that opens the
 * rest (and then turns into "Show fewer"). An active series beyond the cut
 * opens the list the same way, so its tag is visible and an open list
 * always ends in "Show fewer". The open state stays when a tag is picked:
 * the page answers to /events/<slug>/ itself and isn't remounted.
 *
 * @param {Object} props
 * @param {{slug: string, name: string, count: number}[]} props.series
 * @param {string} [props.activeSeries] - Slug of the active series, or empty.
 */
const SeriesOverview = ({ series, activeSeries = '' }) => {
  const listRef = useRef(null)
  const { color } = useContext(ThemeContext)
  const [expanded, setExpanded] = useState(false)
  const visible = useVisibleTags(listRef, SERIES_LINES, !expanded)
  const activeIndex = series.findIndex(({ slug }) => slug === activeSeries)

  useEffect(() => {
    if (visible !== null && activeIndex >= visible) setExpanded(true)
  }, [activeIndex, visible])

  if (series.length === 0) return null

  const isHidden = (index) => !expanded && visible !== null && index >= visible
  // Before the first measurement the button is in the list only to be
  // measured; it is hidden until then, and when everything fits.
  const hasMore = expanded || visible !== null

  return (
    <Section>
      <Headline>
        <h2>Event series at panke.gallery</h2>
      </Headline>
      <nav aria-label="Event series">
        <TagList id="event-series" ref={listRef}>
          {series.map(({ slug, name, count }, index) => {
            const isSelected = slug === activeSeries
            return (
              <li key={slug} hidden={isHidden(index)}>
                <Tag
                  tag={{ slug, name }}
                  type="eventSeries"
                  count={count}
                  selected={isSelected}
                  to={isSelected ? '/events/' : `/events/${slug}/`}
                  label={isSelected
                    ? `Show all events, not only ${name}`
                    : `Show only ${name} events (${count})`}
                />
              </li>
            )
          })}
          <li hidden={!hasMore}>
            <TagButton
              $accent={getPankeColor(color)}
              aria-expanded={expanded}
              aria-controls="event-series"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Show fewer' : `+ ${series.length - (visible ?? 0)} more`}
            </TagButton>
          </li>
        </TagList>
      </nav>
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
                    <EventItem key={event.slug} event={event} headingLevel={4} />
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
      sort: { date: DESC }
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

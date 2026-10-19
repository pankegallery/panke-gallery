import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import Tag from '../components/tag'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Col, Row } from './layout/Layout.styles'
import { NewsArticle } from './content/Content.styles'

/**
 * One event in the list on /events/: series tag, title, short description
 * and date.
 *
 * Props:
 * - `event` – the Contentful event node.
 * - `activeSeries` – slug of the series the list is filtered by, or empty.
 *
 * The series tag links to `/events/<slug>/` to filter the list, or back to
 * `/events/` when that series is already the active filter.
 */
const EventListItem = ({ event, activeSeries }) => {
  const series = event.eventSeries
  const isSelected = Boolean(series) && series.slug === activeSeries

  return (
    <NewsArticle>
      <Row>
        <Col $md={4} $sm={4} $xs={12}>
          {series && (
            <Tag
              tag={series}
              type="eventSeries"
              selected={isSelected}
              to={isSelected ? '/events/' : `/events/${series.slug}/`}
              label={isSelected ? `Show all events, not only ${series.name}` : `Show only ${series.name} events`}
            />
          )}
        </Col>
        <Col $md={8} $sm={8} $xs={12}>
          <h3>
            <Link to={`/event/${event.slug}`}>{event.title}</Link>
          </h3>
          <div dangerouslySetInnerHTML={{
              __html: processExternalLinks(event.subtitleShortDescription.childMarkdownRemark.html)
            }} />
          <p className="meta"><EventDate event={event} /></p>
        </Col>
      </Row>
    </NewsArticle>
  )
}

export default EventListItem

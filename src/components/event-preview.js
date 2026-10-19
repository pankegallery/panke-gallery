import React from 'react'
import { Link } from 'gatsby'
import EventDate from '../components/event-date-time'
import { ContentHtml } from './content-block'
import { NewsArticle, Meta } from './content/Content.styles'

/**
 * Short event teaser on the home page: title, short description and date.
 *
 * @param {object} props
 * @param {object} props.event - The Contentful event node.
 */
const EventPreview = ({ event }) => (
  <NewsArticle>
    <h3>
      <Link to={`/event/${event.slug}`}>{event.title}</Link>
    </h3>
    <ContentHtml html={event.subtitleShortDescription.childMarkdownRemark.html} />
    <Meta><EventDate event={event} /></Meta>
  </NewsArticle>
)

export default EventPreview

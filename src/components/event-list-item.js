import React from 'react'
import Link from 'gatsby-link'
import EventDate from '../components/event-date-time'


export default ({ event }) => (
  <article className="news-item">
    <h3>
      <Link to={`/event/${event.slug}`}>{event.title}</Link>
    </h3>
    <p dangerouslySetInnerHTML={{
        __html: event.subtitleShortDescription.childMarkdownRemark.html
      }} />
    <p className="meta"><EventDate event={event} /></p>
  </article>
)


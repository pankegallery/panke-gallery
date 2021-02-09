import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'moment'

export default ({ event }) => (
  <article className="event-item">
    <Link to={`/event/${event.slug}`}>
      <Img alt="FeaturedImage" fluid={{...event.featuredImage.fluid , aspectRatio: 16/3}} />
    </Link>
    <h3>
      <Link to={`/event/${event.slug}`}>{event.title}</Link>
    </h3>
    <div dangerouslySetInnerHTML={{
        __html: event.subtitleShortDescription.childMarkdownRemark.html
      }} />
    <p className="meta">
      {Moment(event.date).format('DD MMMM')}
    </p>
  </article>
)

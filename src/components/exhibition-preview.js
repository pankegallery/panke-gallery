import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'moment'

export default ({ exhibition }) => (
  <article className="exhibition-item">
    <Link to={`/exhibition/${exhibition.slug}`}>
      <Img alt="FeaturedImage" fluid={{...exhibition.featuredImage.fluid , aspectRatio: 16/9}} />
    </Link>
    <h3>
      <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
    </h3>
    <div dangerouslySetInnerHTML={{
        __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
      }} />
    <p className="meta">
      {Moment(exhibition.startDate).format('DD MMMM')}&thinsp;&ndash;&thinsp;{Moment(exhibition.endDate).format('DD MMMM YYYY')}
      {exhibition.openingHours && ' | ' }{exhibition.openingHours}
      {exhibition.vernissageInfos && ' | ' }{exhibition.vernissageInfos}
    </p>
  </article>
)

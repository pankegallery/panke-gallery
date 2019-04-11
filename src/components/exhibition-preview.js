import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'moment'

export default ({ exhibition }) => (
  <article className="exhibition-item">
    <Link to={`/exhibition/${exhibition.slug}`}>
      <Img alt="FeaturedImage" sizes={{...exhibition.featuredImage.sizes , aspectRatio: 16/9}} />
    </Link>
    <h3>
      <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
    </h3>
    <p dangerouslySetInnerHTML={{
        __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
      }} />
    <p className="meta">{Moment(exhibition.startDate).format('DD MMMM')}&thinsp;&ndash;&thinsp;{Moment(exhibition.endDate).format('DD MMMM YYYY')} | {exhibition.openingHours}</p>
  </article>
)

import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import Moment from 'moment'

export default ({ exhibition }) => (
  <article className="exhibition-item">
    <Link to={`/exhibition/${exhibition.slug}`}>
      <Img alt="FeaturedImage" sizes={{...exhibition.featuredImage.sizes , aspectRatio: 16/9}} />
    </Link>
    <h3>
      <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
      <small>{Moment(exhibition.startDate).format('DD MMMM')}&thinsp;&ndash;&thinsp;{Moment(exhibition.endDate).format('DD MMMM YYYY')}</small>
    </h3>
    <p dangerouslySetInnerHTML={{
        __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
      }} />
  </article>
)

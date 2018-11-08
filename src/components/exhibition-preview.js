import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'

export default ({ exhibition }) => (
  <article className="exhibition-item">
    <Img alt="FeaturedImage" sizes={exhibition.featuredImage.sizes}/>
    <h3>
      <Link to={`/blog/${exhibition.slug}`}>{exhibition.title}</Link>
    </h3>
    <p dangerouslySetInnerHTML={{
        __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
      }} />
    <p className="meta">{exhibition.startDate}&thinsp;&ndash;&thinsp;{exhibition.endDate} | {exhibition.openingHours}</p>
  </article>
)

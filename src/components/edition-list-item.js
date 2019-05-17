import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

export default ({ edition }) => (
  <article className="edition-item">
    <Link to={`/edition/${edition.slug}`}>
      <Img alt="FeaturedImage" sizes={{...edition.featuredImage.sizes , aspectRatio: 16/9}} />
    </Link>
    <h3>
      <Link to={`/edition/${edition.slug}`}>{edition.title}</Link>
    </h3>
    <div dangerouslySetInnerHTML={{
        __html: edition.subtitleShortDescription.childMarkdownRemark.html
      }} />
  </article>
)

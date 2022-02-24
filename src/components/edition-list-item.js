import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'

const EditionListItem = ({ edition }) => (
  <article className="edition-item">
    <Link to={`/edition/${edition.slug}`}>
      <GatsbyImage alt="FeaturedImage" image={edition.featuredImage.gatsbyImageData} aspectratio={16/9}  />
    </Link>
    <h3>
      <Link to={`/edition/${edition.slug}`}>{edition.title}</Link>
    </h3>
    <div dangerouslySetInnerHTML={{
        __html: edition.subtitleShortDescription.childMarkdownRemark.html
      }} />
  </article>
)
export default EditionListItem

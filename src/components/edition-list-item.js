import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { processExternalLinks } from '../utils/processExternalLinks'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'

const EditionListItem = ({ edition }) => (
  <article className="edition-item">
    <Link to={`/edition/${edition.slug}`}>
      <GatsbyImage alt="FeaturedImage" image={edition.featuredImage.gatsbyImageData} aspectratio={16/9}  />
    </Link>
    <h3>
      <Link to={`/edition/${edition.slug}`}>{keepSeparatorsAttached(edition.title)}</Link>
    </h3>
    <div dangerouslySetInnerHTML={{
        __html: processExternalLinks(edition.subtitleShortDescription.childMarkdownRemark.html)
      }} />
  </article>
)
export default EditionListItem

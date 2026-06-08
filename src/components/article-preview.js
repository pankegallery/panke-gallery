import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Article } from './content/Content.styles'

export default ({ article }) => (
  <Article className="preview">
    <GatsbyImage alt="FeaturedImage" image={article.featuredImage.gatsbyImageData} />
    <h3 className="previewTitle">
      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
    </h3>
    <small>{article.startDate}</small>
    <div
      dangerouslySetInnerHTML={{
        __html: processExternalLinks(article.description.childMarkdownRemark.html)
      }}
    />
  </Article>
)

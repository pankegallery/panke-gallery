import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

export default ({ article }) => (
  <div className="preview">
    <Img alt="FeaturedImage" fluid={article.featuredImage.fluid}/>
    <h3 className="previewTitle">
      <Link to={`/blog/${article.slug}`}>{article.title}</Link>
    </h3>
    <small>{article.startDate}</small>
    <div
      dangerouslySetInnerHTML={{
        __html: article.description.childMarkdownRemark.html
      }}
    />
  </div>
)

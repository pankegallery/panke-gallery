import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'

class ExhibitionTemplate extends React.Component {
  render() {
    const exhibition = get(this.props, 'data.contentfulExhibition')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <div style={{ background: '#fff' }}>
        <Helmet title={`${exhibition.title} | ${siteTitle}`} />
        <div className="wrapper">
          <h1 className="section-headline">{exhibition.title}</h1>
          <p
            style={{
              display: 'block',
            }}
          >
            {exhibition.publishDate}
          </p>
          <div
            dangerouslySetInnerHTML={{
              __html: exhibition.subtitleShortDescription.childMarkdownRemark.html,
            }}
          />
        </div>
      </div>
    )
  }
}

export default ExhibitionTemplate

export const pageQuery = graphql`
  query ExhibitionsBySlug($slug: String!) {
    contentfulExhibition(slug: { eq: $slug }) {
      title
      startDate(formatString: "MMMM Do, YYYY")
      featuredImage {
        sizes(maxWidth: 1200) {
          ...GatsbyContentfulSizes
        }
      }
      subtitleShortDescription {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`

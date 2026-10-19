import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { formatDateRange } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Article } from './content/Content.styles'

class exhibitionListItem  extends React.Component{

  render(){

    const exhibition = this.props.exhibition

    const dateDisplayed = formatDateRange(exhibition.startDate, exhibition.endDate, { tbc: exhibition.dateTbc })

    // --- Output --

    return(
      <Article>
        <Link to={`/exhibition/${exhibition.slug}`}>
          <GatsbyImage alt="FeaturedImage" image={exhibition.featuredImage.gatsbyImageData} />
        </Link>
        <h3>
          <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
          <small>{dateDisplayed}</small>
        </h3>
        <div dangerouslySetInnerHTML={{
            __html: processExternalLinks(exhibition.subtitleShortDescription.childMarkdownRemark.html)
          }} /> 
      </Article>
      
    )
  }
}

export default exhibitionListItem

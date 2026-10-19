import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { formatDateRange } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Article, Meta } from './content/Content.styles'

class exhibitionPreview extends React.Component {

  render(){

    const exhibition = this.props.exhibition

    let dateDisplayed = formatDateRange(exhibition.startDate, exhibition.endDate, { tbc: exhibition.dateTbc })

    if (exhibition.openingHours){
      dateDisplayed = dateDisplayed + ' | ' + exhibition.openingHours
    }

    if (exhibition.vernissageInfos){
      dateDisplayed = dateDisplayed + ' | ' + exhibition.vernissageInfos
    }

    // --- Output --

    return(
      <Article className="exhibition-item">
        <Link to={`/exhibition/${exhibition.slug}`}>
          <GatsbyImage alt="FeaturedImage" image={exhibition.featuredImage.gatsbyImageData} aspectratio={16/9} />
        </Link>
        <h3>
          <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{
            __html: processExternalLinks(exhibition.subtitleShortDescription.childMarkdownRemark.html)
          }} />
        <Meta>
          {dateDisplayed}
        </Meta>
      </Article>
    )

  }

}

export default exhibitionPreview

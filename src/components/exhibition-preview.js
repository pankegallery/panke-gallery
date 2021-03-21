import React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import Moment from 'moment'

class exhibitionPreview extends React.Component {

  render(){

    const exhibition = this.props.exhibition

    // --- Date or to be confirmed --

    let dateDisplayed

    if (exhibition.dateTbc){
      dateDisplayed = "Date to be confirmed"
    }
    else{
      dateDisplayed = Moment(exhibition.startDate).format('DD MMMM') + '\u2009\u2013\u2009' + Moment(exhibition.endDate).format('DD MMMM YYYY')
    }

    if (exhibition.openingHours){
      dateDisplayed = dateDisplayed + ' | ' + exhibition.openingHours
    }

    if (exhibition.vernissageInfos){
      dateDisplayed = dateDisplayed + ' | ' + exhibition.vernissageInfos
    }

    // --- Output --

    return(
      <article className="exhibition-item">
        <Link to={`/exhibition/${exhibition.slug}`}>
          <Img alt="FeaturedImage" sizes={{...exhibition.featuredImage.fluid , aspectRatio: 16/9}} />
        </Link>
        <h3>
          <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
        </h3>
        <div dangerouslySetInnerHTML={{
            __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
          }} />
        <p className="meta">
          {dateDisplayed}
        </p>
      </article>
    )

  }

}

export default exhibitionPreview

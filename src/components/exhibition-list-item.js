import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import Moment from 'moment'

class exhibitionListItem  extends React.Component{

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

    // --- Output --

    return(
      <article className="exhibition-item">
        <Link to={`/exhibition/${exhibition.slug}`}>
          <GatsbyImage alt="FeaturedImage" image={exhibition.featuredImage.gatsbyImageData} />
        </Link>
        <h3>
          <Link to={`/exhibition/${exhibition.slug}`}>{exhibition.title}</Link>
          <small>{dateDisplayed}</small>
        </h3>
        <div dangerouslySetInnerHTML={{
            __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
          }} />
      </article>
    )
  }
}

export default exhibitionListItem

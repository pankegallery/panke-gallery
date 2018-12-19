import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import ContentBlock from '../components/content-block'
import EventDate from '../components/event-date-time'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'


class EventTemplate extends React.Component {
  render() {

    const event = get(this.props, 'data.contentfulEvent')
    console.log(event);

    {/* ––– Slideshow or featured images ––– */}

    if (event.eventImpressionsSlideshow != null){
      var ImageOrSlides =(
        <Slideshow slides={event.eventImpressionsSlideshow} length={event.eventImpressionsSlideshow.length} />
      );
    }
    else{
      var ImageOrSlides =(
        <Img alt="FeaturedImage" sizes={{...event.featuredImage.sizes , aspectRatio: 16/9}} />
      );
    }

    {/* ––– Documentation ––– */}
    console.log(event.eventDocumentationImagesBelow);
    if (event.eventDocumentationImagesBelow){
      var DocumentationImages =(
        <Documentation images={event.eventDocumentationImagesBelow} />
      );
    }
    else{
      var DocumentationImages;
    }

    return (
      <main>
        <Helmet title={`${event.title}`} />
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{event.title}</h1>
              <p dangerouslySetInnerHTML={{
                  __html: event.subtitleShortDescription.childMarkdownRemark.html
                }} />
              <p className="meta"><EventDate event={event} /> | {event.entryfee}</p>

              {/* ---- FEATURED IMAGE ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/* ---- ABOUT ---- */}

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the event</h2>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <p dangerouslySetInnerHTML={{
                __html: event.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/* ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {event.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })}

        {/* ---- DOCUMENTATION IMAGES ---- */}

        {DocumentationImages}

      </main>
    )
  }
}

export default EventTemplate

export const pageQuery = graphql`
  query EventBySlug($slug: String!) {
    contentfulEvent(slug: { eq: $slug }) {
      title
      date
      endTime
      openEnd
      entryfee
      subtitleShortDescription {
        childMarkdownRemark {
          html
        }
      }
      description {
        childMarkdownRemark {
          html
        }
      }
      furtherInformationBlocks {
        id
        title
        childContentfulContentBlockBlockContentTextNode {
          id
          childMarkdownRemark {
            html
          }
        }
      }
      featuredImage{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
      }
      eventImpressionsSlideshow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
      eventDocumentationImagesBelow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
    }
  }
`

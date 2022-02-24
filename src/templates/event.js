import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'
import EventDate from '../components/event-date-time'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'

class EventTemplate extends React.Component {
  render() {

    const event = get(this.props, 'data.contentfulEvent')
    console.log(event);
    // ––– Slideshow or featured images –––

    var ImageOrSlides;
    if (event.eventImpressionsSlideshow != null){
      ImageOrSlides =(
        <Slideshow slides={event.eventImpressionsSlideshow} length={event.eventImpressionsSlideshow.length} />
      );
    }
    else{
      ImageOrSlides =(
        <GatsbyImage alt="FeaturedImage" image={event.featuredImage.gatsbyImageData} aspectratio={16/9}  />
      );
    }

    // ––– Documentation –––
    var DocumentationImages;
    if (event.eventDocumentationImagesBelow){
      DocumentationImages =(
        <Documentation images={event.eventDocumentationImagesBelow} />
      );
    }

    // ––– Event date and fee –––
    var EventDateAndEntryFee;
    if (event.entryfee){
      EventDateAndEntryFee =(
        <p className="meta"><EventDate event={event} /> | {event.entryfee}</p>
      );
    }
    else{
      EventDateAndEntryFee =(
        <p className="meta"><EventDate event={event} /></p>
      );
    }


    // ––– Further Content Blocks –––

    var FurtherContentBlocks;
    if (event.furtherInformationBlocks){
      FurtherContentBlocks =(
        event.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }

    // ––– Event series and tags –––
    var eventCategory;
    if (event.eventSeries!=null){
      eventCategory =(
        <p className="eventSeries">
          {event.eventSeries.name}
        </p>
      );
    }

    var eventTags;
    if (event.tags!=null){
      eventTags =(
        event.tags.map(({slug, name}) => {
          return (
            <p className="tag">
              {name}
            </p>
          )
        })
      );
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
      <main>
        <Helmet title={`${event.title}`} />
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{event.title}</h1>
              <div className="subtitle" dangerouslySetInnerHTML={{
                  __html: event.subtitleShortDescription.childMarkdownRemark.html
                }} />
              {EventDateAndEntryFee}
              {eventCategory}{eventTags}

              {/*  ---- FEATURED IMAGE ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/*  ---- ABOUT ---- */}

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the event</h2>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <div dangerouslySetInnerHTML={{
                __html: event.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

        {/*  ---- DOCUMENTATION IMAGES ---- */}

        {DocumentationImages}

      </main>
      </Layout>
    )
  }
}

export default EventTemplate;



//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query EventBySlug($slug: String!) {
    contentfulEvent(slug: { eq: $slug }) {
      title
      date
      endTime
      openEnd
      entryfee
      eventSeries {
        slug
        name
      }
      tags {
        slug
        name
      }
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
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050
        )
      }
      eventImpressionsSlideshow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050
        )
        description
      }
      eventDocumentationImagesBelow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050
        )
        description
      }
    }
  }
`

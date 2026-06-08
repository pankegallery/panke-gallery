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
import RsvpForm from '../components/rsvp-form'
import { processExternalLinks } from '../utils/processExternalLinks'
import { FurtherSection, HeadSection, Meta, InfoSection, Tag } from '../components/content/Content.styles'
import { Col, Row } from '../components/layout/Layout.styles'

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
       <Meta><EventDate event={event} /> | {event.entryfee}</Meta>
      );
    }
    else{
      EventDateAndEntryFee =(
        <Meta><EventDate event={event} /></Meta>
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
        <Tag className="eventSeries tag">
          {event.eventSeries.name}
        </Tag>
      );
    }

    var eventTags;
    if (event.tags!=null){
      eventTags =(
        event.tags.map(({slug, name}) => {
          return (
            <Tag className="tag">
              {name}
            </Tag>
          )
        })
      );
    }

    // ––– RSVP Form –––
    var RsvpSection;
    if (event.rsvpEnabled) {
      const now = new Date();
      const eventDate = new Date(event.date);
      const deadline = event.rsvpDeadline ? new Date(event.rsvpDeadline) : eventDate;
      const isBeforeDeadline = now < deadline;
      const capacity = event.rsvpCapacity || 50; // Default capacity if not set
      
      if (isBeforeDeadline) {
        RsvpSection = (
          <FurtherSection className="rsvp-section">
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                <h2>RSVP</h2>
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                <RsvpForm 
                  eventId={event.contentful_id}
                  eventTitle={event.title}
                  capacity={capacity}
                  slug={event.slug}
                />
              </Col>
            </Row>
          </FurtherSection>
        );

      } else {
        RsvpSection = (
          <FurtherSection className="rsvp-section">
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                <h2>RSVP</h2>
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                <p className="rsvp-closed">Registration for this event has closed.</p>
              </Col>
            </Row>
          </FurtherSection>
        );
      }
         
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
      <main>
        <Helmet title={`${event.title}`} />
        <HeadSection>

              <h1>{event.title}</h1>
              <div className="subtitle" dangerouslySetInnerHTML={{
                  __html: processExternalLinks(event.subtitleShortDescription.childMarkdownRemark.html)
                }} />
              {EventDateAndEntryFee}
              {eventCategory}{eventTags}

              {/*  ---- FEATURED IMAGE ---- */}

              {ImageOrSlides}

        </HeadSection>

        {/*  ---- ABOUT ---- */}

        <InfoSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>About the event</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <div dangerouslySetInnerHTML={{
                __html: processExternalLinks(event.description.childMarkdownRemark.html)
              }} />
            </Col>
          </Row>
         

        </InfoSection>
       

        {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

        {/*  ---- RSVP SECTION ---- */}

        {RsvpSection}

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
      contentful_id
      title
      slug
      date
      endTime
      openEnd
      entryfee
      rsvpEnabled
      rsvpCapacity
      rsvpDeadline
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
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
      }
      eventImpressionsSlideshow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        description
      }
      eventDocumentationImagesBelow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        description
      }
    }
  }
`

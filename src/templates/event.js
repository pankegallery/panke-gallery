import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock, { ContentHtml } from '../components/content-block'
import EventDate from '../components/event-date-time'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'
import RsvpForm from '../components/rsvp-form'
import ConsentEmbed from '../components/consent-embed'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { getYouTubeEmbedUrl, getYouTubeId } from '../utils/youtube'
import Tag from '../components/tag'
import { FurtherSection, HeadSection, InfoSection } from '../components/content/Content.styles'
import { ItemDate, Subline } from '../components/content/Item.styles'
import { Col, Row } from '../components/layout/Layout.styles'

class EventTemplate extends React.Component {
  render() {

    const event = get(this.props, 'data.contentfulEvent')

    // ––– Recording (#75) –––
    // A YouTube link in Contentful. It plays here only after a click, through
    // youtube-nocookie.com (#60). Links of another form (a playlist, say)
    // give no ID and are left out.
    const recordingId = getYouTubeId(event.recordingUrl)
    const recording = recordingId && {
      src: getYouTubeEmbedUrl(recordingId),
      title: `Recording: ${event.title}`,
      provider: 'YouTube (Google)',
      buttonLabel: 'Watch recording',
      allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture',
      // YouTube's player needs to know which site embeds it, but the origin
      // is enough: it doesn't need the path of the event page.
      referrerPolicy: 'strict-origin-when-cross-origin',
      children: (
        <a href={`https://www.youtube.com/watch?v=${recordingId}`} target="_blank" rel="noopener noreferrer">
          Open on YouTube
        </a>
      ),
    }

    // ––– Slideshow or featured image, with the recording –––

    var ImageOrSlides;
    if (event.eventImpressionsSlideshow != null){
      ImageOrSlides = (
        <>
          <Slideshow slides={event.eventImpressionsSlideshow} length={event.eventImpressionsSlideshow.length} />
          {/* Below the slideshow rather than on it, clear of its arrows. */}
          {recording && <ConsentEmbed variant="pill" {...recording} />}
        </>
      );
    }
    else if (event.featuredImage?.gatsbyImageData) {
      // Without image data (e.g. a broken upload) GatsbyImage would warn on
      // every build, so the image is left out instead.
      const image = <GatsbyImage alt="FeaturedImage" image={event.featuredImage.gatsbyImageData} />
      // The image stays visible until the click; the player then takes its
      // place, always 16:9 whatever the image's shape.
      ImageOrSlides = recording
        ? <ConsentEmbed variant="pill" cover={image} {...recording} />
        : image;
    }
    else if (recording) {
      ImageOrSlides = <ConsentEmbed {...recording} />;
    }

    // ––– Documentation –––
    var DocumentationImages;
    if (event.eventDocumentationImagesBelow){
      DocumentationImages =(
        <Documentation images={event.eventDocumentationImagesBelow} />
      );
    }

    // ––– Event date and fee –––
    const EventDateAndEntryFee = (
      <ItemDate>
        <EventDate event={event} />
        {event.entryfee && ` | ${event.entryfee}`}
      </ItemDate>
    );


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
    // The series links to its events on /events/, as on the homepage.
    const series = event.eventSeries
    const eventCategory = series && (
      <Tag
        tag={series}
        type="eventSeries"
        to={`/events/${series.slug}/`}
        label={`Show only ${series.name} events`}
      />
    );

    const eventTags = event.tags && event.tags.map(({ slug, name }) => (
      <Tag key={slug} tag={{ slug, name }} />
    ));

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
                  eventDate={event.date}
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
          {/* Title and date left, subline and tags right: 4/8 like the
              "About the event" row below, 6/6 on larger screens (#70). */}
          <Row>
            <Col $md={6} $sm={4} $xs={12}>
              <h1>{keepSeparatorsAttached(event.title)}</h1>
              {EventDateAndEntryFee}
            </Col>
            <Col $md={6} $sm={8} $xs={12}>
              <Subline as={ContentHtml} $variant="page" html={event.subtitleShortDescription.childMarkdownRemark.html} />
              {eventCategory}{eventTags}
            </Col>
          </Row>

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
              <ContentHtml html={event.description.childMarkdownRemark.html} />
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
      recordingUrl
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

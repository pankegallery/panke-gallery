import React, { useRef } from 'react'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Seo, { excerptOf, shareImageOf, eventDataOfEvent } from '../components/seo'
import ContentBlock, { ContentHtml } from '../components/content-block'
import EventDate from '../components/event-date-time'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'
import RsvpForm from '../components/rsvp-form'
import ConsentEmbed from '../components/consent-embed'
import TwitchEmbed from '../components/twitch-embed'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { getYouTubeEmbedUrl, getYouTubeId } from '../utils/youtube'
import { isLiveNow } from '../utils/live-stream'
import { useNow } from '../utils/use-now'
import Tag from '../components/tag'
import { FurtherSection, HeadSection, InfoSection } from '../components/content/Content.styles'
import { ItemDate, Subline } from '../components/content/Item.styles'
import { Col, Row } from '../components/layout/Layout.styles'

/**
 * Props for the recording of an event (#75): a YouTube link in Contentful,
 * played through youtube-nocookie.com after a click (#60).
 *
 * @param {object} event - The Contentful event.
 * @returns {object|null} ConsentEmbed props, or null without a usable link
 *   (links of another form, a playlist say, give no ID and are left out).
 */
const getRecording = (event) => {
  const id = getYouTubeId(event.recordingUrl)
  if (!id) return null
  return {
    src: getYouTubeEmbedUrl(id),
    title: `Recording: ${event.title}`,
    provider: 'YouTube (Google)',
    buttonLabel: 'Watch recording',
    allow: 'autoplay; encrypted-media; fullscreen; picture-in-picture',
    // YouTube's player needs to know which site embeds it, but the origin
    // is enough: it doesn't need the path of the event page.
    referrerPolicy: 'strict-origin-when-cross-origin',
    children: (
      <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
        Open on YouTube
      </a>
    ),
  }
}

/**
 * The slideshow or featured image at the top of an event page, with what
 * can be watched: while a stream marked "Live on Twitch" runs, the live
 * player (#74); otherwise the recording, if there is one (#75). Both load
 * only after a click, in place of the image or slideshow.
 *
 * Whether the stream runs is worked out in the browser (useNow), so the
 * built page shows the recording or the bare image, and the live pill
 * appears once the page runs during the event.
 *
 * @param {object} props
 * @param {object} props.event - The Contentful event.
 */
const EventMedia = ({ event }) => {
  const now = useNow()
  const slides = event.eventImpressionsSlideshow

  let cover = null
  if (slides != null) {
    cover = <Slideshow slides={slides} alt={event.title} />
  } else if (event.featuredImage?.gatsbyImageData) {
    // Without image data (e.g. a broken upload) GatsbyImage would warn on
    // every build, so the image is left out instead.
    cover = <GatsbyImage alt={event.featuredImage.description || event.title} image={event.featuredImage.gatsbyImageData} />
  }
  // The pill goes below a slideshow rather than on it, clear of its arrows.
  const pillBelow = slides != null

  // Once live, the player stays for this page view, so a stream that runs
  // past its end time isn't cut off while someone watches.
  const wasLive = useRef(false)
  if (isLiveNow(event, now)) wasLive.current = true
  if (wasLive.current) {
    return <TwitchEmbed title={event.title} cover={cover} pillBelow={pillBelow} />
  }

  const recording = getRecording(event)
  if (!recording) return cover
  // With a cover, the player takes its place after the click, always 16:9
  // whatever the image's shape; without, a grey 16:9 placeholder.
  return cover
    ? <ConsentEmbed variant="pill" cover={cover} pillBelow={pillBelow} {...recording} />
    : <ConsentEmbed {...recording} />
}

class EventTemplate extends React.Component {
  render() {

    const event = get(this.props, 'data.contentfulEvent')

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
      <div>
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

          <EventMedia event={event} />
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

      </div>
      </Layout>
    )
  }
}

// The share preview: the entry's subtitle, or else the start of its text, and
// its featured image, or else the first slide.
// The dates and place go into event data for search engines.
export const Head = ({ data, location }) => {
  const entry = data.contentfulEvent
  return (
    <Seo
      title={entry.title}
      description={excerptOf(entry.subtitleShortDescription, entry.description)}
      path={location.pathname}
      image={shareImageOf(entry.featuredImage || entry.eventImpressionsSlideshow?.[0])}
      type="article"
      event={eventDataOfEvent(entry)}
    />
  )
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
      liveOnTwitch
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
          excerpt(pruneLength: 200)
        }
      }
      description {
        childMarkdownRemark {
          html
          excerpt(pruneLength: 200)
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
        url
        mimeType
        description
      }
      eventImpressionsSlideshow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        url
        mimeType
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

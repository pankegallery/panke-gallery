import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import Moment from 'moment';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import ExhibitionItem from '../components/exhibition-item';
import EventPreview from '../components/event-preview';
import { ContentHtml } from '../components/content-block';
import { processExternalLinks } from '../utils/processExternalLinks';
import { isCurrent, isUpcoming, isPast } from '../utils/exhibition-archive.mjs';
import { Row, Col, Grid } from '../components/layout/Layout.styles';
import {
  NewsSection,
  Section,
  Headline,
  NewsArticle,
  EventSeries,
  IntroSection,
  Intro,
  Visit,
} from '../components/content/Content.styles';

/**
 * The most recent past show, for the homepage between shows (#69), as a
 * one-item list. It comes from the page query's `latestPast`, unless a show
 * from the main query has ended since the build: that one is newer.
 * Opening hours and vernissage info are left out, as they no longer apply.
 */
const latestPast = (data, exhibitions) => {
  const shows = [...data.latestPast.nodes, ...exhibitions.filter(isPast)];
  const latest = shows.reduce((newest, show) => (!newest || show.endDate > newest.endDate ? show : newest), null);
  if (!latest) return [];
  const { openingHours, vernissageInfos, ...show } = latest;
  return [show];
};

/**
 * Up to three upcoming events, one per row of the page `Grid`, with a link
 * to all events.
 *
 * @param {Object} props
 * @param {Object[]} props.events - Event nodes, soonest first.
 */
const EventsSection = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <Section>
      <Headline>
        <h2>Upcoming events</h2>
        <Link to="/events/"><EventSeries className="eventSeries">See all events</EventSeries></Link>
      </Headline>
      <Grid>
        {events.map((event) => (
          <EventPreview key={event.slug} event={event} />
        ))}
      </Grid>
    </Section>
  );
};

/**
 * A labelled block of shows on the page `Grid`, rendered through
 * ExhibitionItem. Renders nothing without shows.
 *
 * @param {Object} props
 * @param {string} props.label - Section label, e.g. "Current".
 * @param {Object[]} props.exhibitions - Exhibition nodes.
 * @param {'feature'|'feature-small'} props.variant
 */
const ExhibitionSection = ({ label, exhibitions, variant }) => {
  if (exhibitions.length === 0) return null;

  return (
    <Section>
      <Headline>
        <h2>{label}</h2>
      </Headline>
      <Grid>
        {exhibitions.map((exhibition) => (
          <ExhibitionItem key={exhibition.slug} exhibition={exhibition} variant={variant} />
        ))}
      </Grid>
    </Section>
  );
};

/**
 * The one-line intro, with address and opening hours beside it on the page
 * `Grid`. The Visit text is the Contact page's "visitUs" block.
 *
 * @param {Object} props
 * @param {string} [props.visitHtml] - HTML of the Contentful block.
 */
const IntroVisitSection = ({ visitHtml }) => (
  <IntroSection>
    <Grid>
      <Intro>panke.gallery shows digital and net&#8209;based art in Berlin&#8209;Wedding since 2017.</Intro>
      {visitHtml && (
        <Visit>
          <ContentHtml html={visitHtml} />
        </Visit>
      )}
    </Grid>
  </IntroSection>
);

/**
 * The homepage (#69): news, if any, then up to three upcoming events, the
 * current and the upcoming shows, or the most recent past show when there is
 * neither, and the intro with the Visit block. Everything sits on the page
 * `Grid` in the wide container, as on /exhibitions.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result.
 */
const PankeIndex = ({ data }) => {
  const START_DATE = "01/08/2024";
  const END_DATE = "30/09/2024";

  const [redirectActive, setRedirectActive] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const startDate = Moment(START_DATE, 'DD/MM/YYYY').toDate();
    const endDate = Moment(END_DATE, 'DD/MM/YYYY').toDate();

    console.log("dates", startDate, currentDate, endDate);
    if (currentDate >= startDate && currentDate <= endDate) {

      setRedirectActive(true);
    }
  }, []);

  const filterUpcomingEvents = (_ev) => {
    const currentDate = new Date();
    const eventStartDate = new Date(_ev.node.date);
    return Moment(eventStartDate).isSameOrAfter(currentDate, 'day');
  };

  const exhibitions = get(data, 'allContentfulExhibition.edges', []).map(({ node }) => node);
  const events = get(data, 'allContentfulEvent.edges', []);
  const newsItems = get(data, 'allContentfulContentBlock.edges', []);

  const current = exhibitions.filter(isCurrent);
  const upcoming = exhibitions.filter(isUpcoming);
  const upcomingEvents = events.filter(filterUpcomingEvents).slice(0, 3);
  // Only between shows, so the page never looks empty.
  const past = current.length === 0 && upcoming.length === 0 ? latestPast(data, exhibitions) : [];

  return (
    <Layout redirectActive={redirectActive} wide>
      <Helmet
        title="Home"
        meta={[
          {
            name: 'description',
            content: 'News and upcoming exhibitions of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
          }
        ]}
      />

      {newsItems.length > 0 && (
        <NewsSection>
          {newsItems.map(({ node }) => (
            <NewsArticle key={node.id}>
              <Headline>
                <h2>{node.title}</h2>
              </Headline>
              <Row>
                <Col $md={12} $sm={12} $xs={12} dangerouslySetInnerHTML={{ __html: processExternalLinks(node.blockContent.childMarkdownRemark.html) }} />
              </Row>
            </NewsArticle>
          ))}
        </NewsSection>
      )}

      {/* One section per block, so later ones (an ongoing residency, the
          livestream during events) slot in between without restructuring. */}
      {!redirectActive && (
        <>
          <EventsSection events={upcomingEvents.map(({ node }) => node)} />
          <ExhibitionSection label="Current" exhibitions={current} variant="feature" />
          <ExhibitionSection label="Upcoming" exhibitions={upcoming} variant="feature-small" />
          <ExhibitionSection label="Past" exhibitions={past} variant="feature" />
          <IntroVisitSection visitHtml={data.visitUs?.blockContent?.childMarkdownRemark?.html} />
        </>
      )}
    </Layout>
  );
};

export default PankeIndex;

// `latestPast` is the most recent show that ended before the build, for the
// time between shows; the main query holds only shows that haven't ended.
// `HomeExhibition` holds the fields every show on the homepage needs (see
// ExhibitionItem). Images are cropped to 16:10, as on /exhibitions.
export const pageQuery = graphql`
  query PankeHomeQuery($today: Date!) {
    allContentfulExhibition(
      sort: { startDate: ASC },
      filter: { endDate: { gte: $today } }
    ) {
      edges {
        node {
          ...HomeExhibition
          openingHours
          vernissageInfos
        }
      }
    }
    latestPast: allContentfulExhibition(
      sort: { endDate: DESC },
      filter: { endDate: { lt: $today } },
      limit: 1
    ) {
      nodes {
        ...HomeExhibition
      }
    }
    allContentfulEvent(
      sort: { date: ASC },
      filter: { date: { gte: $today } }
    ) {
      edges {
        node {
          title
          slug
          date
          endTime
          openEnd
          eventSeries {
            name
            slug
          }
          subtitleShortDescription {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    visitUs: contentfulContentBlock(slug: { eq: "contact-visit-us" }) {
      blockContent {
        childMarkdownRemark {
          html
        }
      }
    }
    allContentfulContentBlock(
      filter: { page: { eq: "News" } },
      sort: { updatedAt: DESC }
    ) {
      edges {
        node {
          id
          title
          page
          slug
          blockContent {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }

  fragment HomeExhibition on ContentfulExhibition {
    title
    slug
    startDate
    endDate
    dateTbc
    featuredImage {
      gatsbyImageData(
        layout: CONSTRAINED,
        width: 1050,
        aspectRatio: 1.6
      )
      description
    }
    subtitleShortDescription {
      childMarkdownRemark {
        html
      }
    }
    description {
      childMarkdownRemark {
        excerpt(pruneLength: 1200)
      }
    }
  }
`;

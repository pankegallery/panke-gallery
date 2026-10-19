import React, { useSyncExternalStore } from 'react';
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import EventListItem from '../components/event-list-item'
import { Section, Headline } from '../components/content/Content.styles';

// Whether the page has hydrated never changes once it's true, so there is
// nothing to subscribe to.
const subscribeToNothing = () => () => {}

/**
 * /events/ – upcoming and past events, optionally filtered by event series.
 *
 * The filter lives only in the URL: `/events/<series-slug>/` is a client-only
 * route (see `onCreatePage` in gatsby-node.js) that renders this page with
 * `params.series` set. The series tags are links to those URLs, so a filter
 * can be shared, bookmarked and undone with the back button, and the page
 * keeps no filter state of its own that could disagree with the address bar.
 */
const PankeEvents = ({ data, params }) => {
  // The static HTML for /events/<slug>/ is built without a slug, i.e. the
  // full list. When such a URL is opened directly, React's first render must
  // match that HTML, or hydration fails (React errors #418/#423). React uses
  // the third argument while hydrating and the second otherwise, so the
  // filter applies right after hydration, and immediately on in-app clicks.
  const isHydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  const activeSeries = (isHydrated && params?.series) || ''

  const passFilter = (ev) => !activeSeries || ev.eventSeries?.slug === activeSeries

  const renderEvents = (events) => events
    .filter(({ node }) => passFilter(node))
    .map(({ node }) => (
      <EventListItem key={node.slug} event={node} activeSeries={activeSeries} />
    ))

  const posts = data.allContentfulEvent.edges
  const currentDate = new Date()
  // The query sorts newest first; upcoming events read better soonest first.
  const upcomingEvents = posts.filter(({ node }) => new Date(node.date) >= currentDate).reverse()
  const pastEvents = posts.filter(({ node }) => new Date(node.date) < currentDate)

  return (
    <Layout>
      <Helmet
        title="Events"
        meta={[
          {
            name: 'description',
            content: 'Upcoming and past events of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
          }
        ]}
      />

      {upcomingEvents.length > 0 && (
        <Section className="upcoming">
          <Headline>
            <h2>Upcoming events</h2>
          </Headline>
          {renderEvents(upcomingEvents)}
        </Section>
      )}

      {pastEvents.length > 0 && (
        <Section className="past">
          <Headline>
            <h2>Past events</h2>
          </Headline>
          {renderEvents(pastEvents)}
        </Section>
      )}
    </Layout>
  );
}

export default PankeEvents;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PankeEventsQuery {
    allContentfulEvent(
      sort: { fields: [date], order: DESC }

    ) {
      edges {
        node {
          title
          slug
          date
          endTime
          openEnd
          entryfee
          eventSeries {
            slug
            name
          }
          subtitleShortDescription {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
  }
`

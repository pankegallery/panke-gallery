import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import EventListItem from '../components/event-list-item'

class PankeEvents extends React.Component {
  render() {

    {/*Get array of exhibitions*/}
    const posts = get(this, 'props.data.allContentfulEvent.edges')

    {/*Log array of Events*/}
    console.log("Posts:");
    console.log(posts);

    {/*Filter array of exhibitions*/}
    function filterUpcoming(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate >= currentDate;
    }
    const upcomingEvents = posts.filter(filterUpcoming);

    function filterPast(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate < currentDate;
    }
    const pastEvents = posts.filter(filterPast);

    {/*Log array of upcoming Events*/}
    console.log("Upcoming Events:");
    console.log(upcomingEvents);

    {/*Log array of past Events*/}
    console.log("Past Events:");
    console.log(pastEvents);

    if (upcomingEvents.length > 0){
      var upcoming = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming events</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {upcomingEvents.map(({ node }) => {
                return (
                  <EventListItem key={node.slug} event={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }
    else{
      var upcoming;
    }

    if (pastEvents.length > 0){
      var past = (
        <section className="past">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Past events</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {pastEvents.map(({ node }) => {
                return (
                  <EventListItem key={node.slug} event={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }
    else{
      var past;
    }

    return (
      <main>
        <Helmet
          title="Events"
          meta={[
            {
              name: 'description',
              content: 'Upcoming and past events of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
            }
          ]}
        />

        {upcoming}

        {past}

      </main>




    );
  }
}

export default PankeEvents;

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
          featuredImage {
            sizes(maxWidth: 1000) {
             ...GatsbyContentfulSizes
            }
          }
          description {
            childMarkdownRemark {
              html
            }
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

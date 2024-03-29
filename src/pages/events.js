import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import EventListItem from '../components/event-list-item'

class PankeEvents extends React.Component {

  state = {
    isFilterOn: false,
    filterby: ''
  }

  handleEventsClick = (tagSlug) => {
    this.setState(state => ({
      isFilterOn: !state.isFilterOn,
      filterby: {tagSlug}
    }));
  }

  passFilter = (ev) => {
    if (!this.state.isFilterOn) {
      return true;
    }

    if (!ev.eventSeries){
      return false;
    }

    return this.state.filterby.tagSlug === ev.eventSeries.slug
  }

  returnEventListItem = (ev) => {
//    console.log('hä?')
    return (
      <EventListItem
        key={ev.slug}
        event={ev}
        handleClick={this.handleEventsClick}
        filterIsOn={this.state.isFilterOn}
      />
    )
  }

  componentDidMount = () => {
    this.props.series && this.setState({
      isFilterOn: true,
      filterby: {tagSlug: this.props.series}
    })
  }

  render() {

    // Get array of events
    const posts = get(this, 'props.data.allContentfulEvent.edges')

    // Log array of Events
//    console.log("Posts:");
//    console.log(posts);

    // Filter array of events    
    function filterUpcoming(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate >= currentDate;
    }
    const upcomingEvents = posts.filter(filterUpcoming);
    upcomingEvents.reverse();

    function filterPast(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate < currentDate;
    }
    const pastEvents = posts.filter(filterPast);

    // Log array of upcoming events
//    console.log("Upcoming events:");
//    console.log(upcomingEvents);

    // Log array of past events
//    console.log("Past events:");
//    console.log(pastEvents);

    var upcoming;
    if (upcomingEvents.length > 0){
      upcoming = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming events</h2>
            </div>
          </div>

          {upcomingEvents.map(({ node }) => {
            if (this.passFilter(node)){
              return this.returnEventListItem(node);
            }
            return null
          })}
        </section>
      );
    }

    var past;
    if (pastEvents.length > 0) {
      past = (
        <section className="past">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Past events</h2>
            </div>
          </div>

          {pastEvents.map(({ node }) => {
            if (this.passFilter(node)){
              return this.returnEventListItem(node);
            }
            return null
          })}
        </section>
      );
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================


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

        {upcoming}

        {past}

      </Layout>


    );
  }
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

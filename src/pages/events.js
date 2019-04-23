import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import EventListItem from '../components/event-list-item'

class PankeEvents extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isFilterOn: false,
                 filterby: ''};

    // This binding is necessary to make `this` work in the callback
    this.handleEventsClick = this.handleEventsClick.bind(this);
  }

  handleEventsClick(tagSlug) {
    this.setState(state => ({
      isFilterOn: !state.isFilterOn
    }));
    this.setState(state => ({
      filterby: {tagSlug}
    }));
  }

  passFilter(ev){
    if (!this.state.isFilterOn) {
      return true;
    }

    if (!ev.eventSeries){
      return false;
    }

    return this.state.filterby.tagSlug === ev.eventSeries.slug
  }

  returnEventListItem(ev){
    console.log('hä?')
    return (
      <EventListItem
        key={ev.slug}
        event={ev}
        handleClick={this.handleEventsClick}
        filterIsOn={this.state.isFilterOn}
      />
    )
  }

  render() {

    {/*Get array of events*/}
    const posts = get(this, 'props.data.allContentfulEvent.edges')

    {/*Log array of Events*/}
//    console.log("Posts:");
//    console.log(posts);

    {/*Filter array of events*/}
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

    {/*Log array of upcoming events*/}
//    console.log("Upcoming events:");
//    console.log(upcomingEvents);

    {/*Log array of past events*/}
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
          })}
        </section>
      );
    }

    return (
      <Layout>
<<<<<<< HEAD
      <main>
=======
>>>>>>> development
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

<<<<<<< HEAD
      </main>
=======
>>>>>>> development
      </Layout>



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

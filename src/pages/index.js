import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Moment from 'moment'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import ExhibitionPreview from '../components/exhibition-preview'
import EventPreview from '../components/event-preview'


class PankeIndex extends React.Component {


  filterCurrent = (_ex) => {
    var currentDate = new Date();
    var exhibtionStartDate = new Date(_ex.node.startDate);
    var exhibtionEndDate = new Date(_ex.node.endDate);
    return Moment(exhibtionStartDate, 'day').utcOffset(120).isSameOrBefore(currentDate, 'day') && Moment(exhibtionEndDate, 'day').utcOffset(120).isSameOrAfter(currentDate, 'day');
  }

  filterUpcoming = (_ex) => {
    var currentDate = new Date();
    var exhibtionStartDate = new Date(_ex.node.startDate);
//    return Moment(exhibtionStartDate, 'day').utcOffset(120).isAfter(currentDate, 'day') && !_ex.node.dateTbc;
    return Moment(exhibtionStartDate, 'day').utcOffset(120).isAfter(currentDate, 'day');
  }

  filterUpcomingEvents = (_ev) => {
    var currentDate = new Date();
    var eventStartDate = new Date(_ev.node.date);
    return Moment(eventStartDate, 'day').utcOffset(120).isSameOrAfter(currentDate, 'day');
  }

  render() {

    console.log('Context: ', get(this.props, 'pageContext'))
    // Get array of exhibitions
    const exhibitions = get(this, 'props.data.allContentfulExhibition.edges')

    // Get array of events
    const events = get(this, 'props.data.allContentfulEvent.edges')
    
    // Get array of news
    const newsItems = get(this, 'props.data.allContentfulContentBlock.edges')

//    console.log("Exhibitions:", posts);
//    console.log("Events:", posts);
//    console.log("news:", newsItems);
    
    // Filter array of exhibitions
    const currentExhibitions = exhibitions.filter(this.filterCurrent);
    const upcomingExhibitions = exhibitions.filter(this.filterUpcoming);

    // Filter array of events and slice to first 2
    const upcomingEvents = events.filter(this.filterUpcomingEvents).slice(0,2);
    // Filter by GraphQL (not working, only updated on rebuild)
//    const upcomingEvents = events

    // Log exhibitions
//    console.log("Current Exhibitions:", currentExhibitions);
//    console.log("Upcoming Exhibitions:", upcomingExhibitions);
//    console.log("Upcoming Events:", upcomingEvents);

    // Create news code
    var news;
    if (newsItems.length > 0){
      news = (
        <section className="news">
          {newsItems.map(({node}) => {
            return (
              <article key={node.id} className="news-item">
                <div className="row headline">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <h2>{node.title}</h2>
                  </div>
                </div>
                <div className="row">
                  {<div className="col-md-12 col-sm-12 col-xs-12" dangerouslySetInnerHTML={{
                      __html: node.blockContent.childMarkdownRemark.html
                    }} />}
                </div>
              </article>
            )
          })}

        </section>
      );
    }

    // Create upcoming events code if there are
    var upcomingEv;
    if (upcomingEvents.length > 1){
      upcomingEv = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-8 col-sm-8 col-xs-12">
              <h2>Upcoming events</h2>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12 text-sm-right d-none d-sm-block pt-4">
              <Link to={'events'}><button className="eventSeries">See all events</button></Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {upcomingEvents.map(({ node }) => {
                return (
                    <EventPreview key={node.id} event={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    // Create current exhibitions code if there are
    var current;
    if (currentExhibitions.length > 0){
      current = (
        <section className="currently">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Current exhibitions</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {currentExhibitions.map(({ node }) => {
                return (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    // Create upcoming exhibitions code if there are
    var upcoming;
    if (upcomingExhibitions.length > 0){
      upcoming = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming exhibitions</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {upcomingExhibitions.map(({ node }) => {
                return (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    return (
      <Layout>
        <Helmet
          title= '  Home'
          meta={[
            {
              name: 'description',
              content: 'News and upcoming exhibitions of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
            }
          ]}
        />

        {news}

        {upcomingEv}

        {current}

        {upcoming}

      </Layout>

    );
  }
}

export default PankeIndex

export const pageQuery = graphql`
  query PankeHomeQuery($today: Date!) {
    allContentfulExhibition(
      sort: { fields: [startDate], order: ASC },
      # limit: 3,
      filter: {endDate: {gte: $today}}
      )
     {
      edges {
        node {
          title
          slug
          startDate
          endDate
          dateTbc
          featuredImage {
            gatsbyImageData(
              layout: CONSTRAINED,
              width: 1050
            )
          }
          openingHours
          vernissageInfos
          subtitleShortDescription {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulEvent(
        sort: { fields: [date], order: ASC },
        # limit: 2,
        filter: {date: {gte: $today}}
      ){
      edges {
        node {
          title
          slug
          date
          tags {
            name
            slug
          }
          eventSeries {
            name
            slug
          }
          subtitleShortDescription {
            childMarkdownRemark{
              html
            }
          }
        }
      }
    }
    allContentfulContentBlock (
        filter: {page: {eq: "News"}},
        sort: { fields: [updatedAt], order: DESC}
      ){
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
`

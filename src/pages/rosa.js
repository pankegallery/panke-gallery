import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'


import EventDate from '../components/event-date-time'
import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import EventListItem from '../components/event-list-item'

class PankeRosa extends React.Component{
  
  returnEventListItem = (ev) => {
    console.log('hä?')
    return (
      <EventListItem
        key={ev.slug}
        event={ev}
      />
    )
  }

  render() {

    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');
    
    const events = get(this, 'props.data.allContentfulEvent.edges');
    console.log('Events from query', events)
    
    // Filter array of events    
    function filterUpcoming(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate >= currentDate;
    }
    const upcomingEvents = events.filter(filterUpcoming);
    upcomingEvents.reverse();
    
    function filterPast(_ev) {
      var currentDate = new Date();
      var eventDate = new Date(_ev.node.date);
      return eventDate < currentDate;
    }
    const pastEvents = events.filter(filterPast);
    
    var upcoming;
    if (upcomingEvents.length > 0){
      upcoming = (
        <section className="upcoming">
          
          <div className="row headline">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>Upcoming at /rosa</h2>  
            </div>
            
            <div className="col-md-8 col-sm-8 col-xs-12">
              {upcomingEvents.map(({ node }) => (
                <>
                  <Link to={`/event/${node.slug}`}>
                    <GatsbyImage alt="FeaturedImage" image={node.featuredImage.gatsbyImageData} aspectratio={16/9} />
                  </Link>
                  <h3 className="mt-3">
                    <Link to={`/event/${node.slug}`}>{node.title}</Link>
                  </h3>
                  <div dangerouslySetInnerHTML={{
                      __html: node.subtitleShortDescription.childMarkdownRemark.html
                    }} />
                  <p className="meta mb-5"><EventDate event={node} /></p>
                </>
              ))}
            </div>
          </div>
        </section>
      );
    }

    var past;
    if (pastEvents.length > 0) {
      console.log('past', pastEvents)
      past = (
        <section className="past">
          
          <div className="row headline">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>Past events at rosa</h2>
            </div>
            
            <div className="col-md-8 col-sm-8 col-xs-12">
              {pastEvents.map(({ node }) => (
                <>
                  <h3>
                    <Link to={`/event/${node.slug}`}>{node.title}</Link>
                  </h3>
                  <div dangerouslySetInnerHTML={{
                      __html: node.subtitleShortDescription.childMarkdownRemark.html
                    }} />
                  <p c  lassName="meta mb-5"><EventDate event={node} /></p>
                </>
              ))}
            </div>
          </div>
        </section>
      );
    }
    

    

    let infoBlock = {
      title: 'About',
      content: '<strong>/rosa is a project space in Berlin. It is jointly run by <a href="https://netzkunst.berlin">Zentrum für Netzkunst (ZfN)</a> and panke.gallery and focuses on researching and exhibiting net art and net culture.</strong>'
    }

    let moreBlock = {
      title: 'More',
      content: `/rosa offers a site for local and international dialogues between researchers, students, net art enthusiasts, and established and emerging artists. In addition to showing artworks, /rosa proposes experimental formats of art mediation, with public lectures and a workspace, as well as a growing research library for self-study. It also  functions as a venue for community events such as reading groups and workshops.`
    }

    let address = `
      <strong>/rosa</strong><br>
      Heidelberger Str. 28><br>
      12059 Berlin
    `


    return(
      <Layout>
        <main>
        <Helmet
          title="/rosa"
          meta={[
            {
              name: 'description',
              content: '/rosa is a project space jointly run by Zentrum für Netzkunst (ZfN) and panke.gallery focused on representing net art and net culture in Berlin.'
            }
          ]}
        />

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>{infoBlock.title}</h2>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<div dangerouslySetInnerHTML={{
                __html: infoBlock.content
              }} />}
          </div>
          </div>
        </section>

        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12 address">
               {<div dangerouslySetInnerHTML={{
                __html: address
              }} />}
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<div dangerouslySetInnerHTML={{
                __html: moreBlock.content
              }} />}
          </div>
          </div>
        </section>

        {blocks.map(({node}) => {
          return (
              <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}
          
        {upcoming}
          
        {past}

        </main>
      </Layout>
    );
  }
}

export default PankeRosa;

export const pageQuery = graphql`
  query PankeRosaQuery {
    allContentfulContentBlock (filter: {page: {eq: "/rosa"}}, sort: { fields: [slug], order: ASC}){
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
    allContentfulEvent(
      sort: { fields: [date], order: DESC }
			filter: {eventSeries: {slug: {eq: "rosa"}}}
    ) {
      edges {
        node {
          title
          slug
          date
          endTime
          openEnd
          subtitleShortDescription {
            childMarkdownRemark {
              html
            }
          }
          featuredImage {
            gatsbyImageData(
              layout: CONSTRAINED,
              width: 1050,
              placeholder: BLURRED
            )
          }
        }
      }
    }
  }
`

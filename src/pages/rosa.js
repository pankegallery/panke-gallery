import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql, Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'


import EventDate from '../components/event-date-time'
import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import EventListItem from '../components/event-list-item'
import { processExternalLinks } from '../utils/processExternalLinks'
import { InfoSection, FurtherSection, Meta } from '../components/content/Content.styles';
import { Row, Col } from '../components/layout/Layout.styles';

class PankeRosa extends React.Component {

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
    if (upcomingEvents.length > 0) {
      upcoming = (

        <FurtherSection className="upcoming">
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>Upcoming at /rosa</h2>
            </Col>

            <Col $md={8} $sm={8} $xs={12}>
              {upcomingEvents.map(({ node }) => (
                <>
                  <Link to={`/event/${node.slug}`}>
                    <GatsbyImage alt="FeaturedImage" image={node.featuredImage.gatsbyImageData} aspectratio={16 / 9} />
                  </Link>
                  <h3 className="mt-3">
                    <Link to={`/event/${node.slug}`}>{node.title}</Link>
                  </h3>
                  <div dangerouslySetInnerHTML={{
                    __html: processExternalLinks(node.subtitleShortDescription.childMarkdownRemark.html)
                  }} />
                  <Meta style={{
                    marginBottom: '3em'
                  }}><EventDate event={node} /></Meta>                </>
              ))}
            </Col>
          </Row>
        </FurtherSection>
      );
    }

    var past;
    if (pastEvents.length > 0) {
      console.log('past', pastEvents)
      past = (
        <FurtherSection className="past">
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>Past events at rosa</h2>

            </Col>

            <Col $md={8} $sm={8} $xs={12}>
              {pastEvents.map(({ node }) => (
                <>
                  <h3>
                    <Link to={`/event/${node.slug}`}>{node.title}</Link>
                  </h3>
                  <div dangerouslySetInnerHTML={{
                    __html: processExternalLinks(node.subtitleShortDescription.childMarkdownRemark.html)
                  }} />
                  <Meta style={{
                    marginBottom: '3em'
                  }}><EventDate event={node} /></Meta>
                </>
              ))}
            </Col>
          </Row>
        </FurtherSection>
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
      Heidelberger Str. 28<br>
      12059 Berlin
    `


    return (
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

          <InfoSection>
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                <h2>{infoBlock.title}</h2>
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                {<div dangerouslySetInnerHTML={{
                  __html: processExternalLinks(infoBlock.content)
                }} />}
              </Col>
            </Row>
          </InfoSection>

          <FurtherSection>
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                {<div dangerouslySetInnerHTML={{
                  __html: processExternalLinks(address)
                }}
                  style={{
                    background: '#00ef00',
                    display: 'inline'
                  }} />}
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                {<div dangerouslySetInnerHTML={{
                  __html: processExternalLinks(moreBlock.content)
                }} />}
              </Col>
            </Row>
          </FurtherSection>


          {blocks.map(({ node }) => {
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

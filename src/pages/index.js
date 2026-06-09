import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import Moment from 'moment';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import ExhibitionPreview from '../components/exhibition-preview';
import EventPreview from '../components/event-preview';
import { processExternalLinks } from '../utils/processExternalLinks';
import { Row, Col } from '../components/layout/Layout.styles';
import { NewsSection, Section, Headline, NewsArticle } from '../components/content/Content.styles';
import { EventSeries } from '../components/content/Content.styles';

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

  const filterCurrent = (_ex) => {
    const currentDate = new Date();
    const exhibitionStartDate = new Date(_ex.node.startDate);
    const exhibitionEndDate = new Date(_ex.node.endDate);
    return Moment(exhibitionStartDate).isSameOrBefore(currentDate, 'day') &&
      Moment(exhibitionEndDate).isSameOrAfter(currentDate, 'day');
  };

  const filterUpcoming = (_ex) => {
    const currentDate = new Date();
    const exhibitionStartDate = new Date(_ex.node.startDate);
    return Moment(exhibitionStartDate).isAfter(currentDate, 'day');
  };

  const filterUpcomingEvents = (_ev) => {
    const currentDate = new Date();
    const eventStartDate = new Date(_ev.node.date);
    return Moment(eventStartDate).isSameOrAfter(currentDate, 'day');
  };

  const exhibitions = get(data, 'allContentfulExhibition.edges', []);
  const events = get(data, 'allContentfulEvent.edges', []);
  const newsItems = get(data, 'allContentfulContentBlock.edges', []);

  const currentExhibitions = exhibitions.filter(filterCurrent);
  const upcomingExhibitions = exhibitions.filter(filterUpcoming);
  const upcomingEvents = events.filter(filterUpcomingEvents).slice(0, 2);

  return (
    <Layout redirectActive={redirectActive}>
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

      {!redirectActive && (
        <>
          {upcomingEvents.length > 0 && (
            <Section>
              <Headline style={{paddingTop: '2em'}}>


                <h2>Upcoming events</h2>

                <Link to={'/events'}><EventSeries className='eventSeries'>See all events</EventSeries></Link>


              </Headline>
              {upcomingEvents.map(({ node }) => (
                    <EventPreview key={node.id} event={node} />
                  ))}
            </Section>
          )}

          {currentExhibitions.length > 0 && (
            <Section>
              <Headline>
                <h2>Current exhibitions</h2>
              </Headline>
               {currentExhibitions.map(({ node }) => (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                  ))}
            </Section>
          )}

          {upcomingExhibitions.length > 0 && (
            <Section>
              <Headline>
               <h2>Upcoming exhibitions</h2>
              </Headline>
               {upcomingExhibitions.map(({ node }) => (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                  ))}
            </Section>
          )}
        </>
      )}
    </Layout>
  );
};

export default PankeIndex;

export const pageQuery = graphql`
  query PankeHomeQuery($today: Date!) {
    allContentfulExhibition(
      sort: { fields: [startDate], order: ASC },
      filter: { endDate: { gte: $today } }
    ) {
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
      filter: { date: { gte: $today } }
    ) {
      edges {
        node {
          title
          slug
          date
          endTime
          openEnd
          tags {
            name
            slug
          }
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
    allContentfulContentBlock(
      filter: { page: { eq: "News" } },
      sort: { fields: [updatedAt], order: DESC }
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
`;

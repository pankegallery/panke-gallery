import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import Moment from 'moment';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import ExhibitionPreview from '../components/exhibition-preview';
import EventPreview from '../components/event-preview';

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
        <section className="news">
          {newsItems.map(({ node }) => (
            <article key={node.id} className="news-item">
              <div className="row headline">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <h2>{node.title}</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12" dangerouslySetInnerHTML={{ __html: node.blockContent.childMarkdownRemark.html }} />
              </div>
            </article>
          ))}
        </section>
      )}

      {!redirectActive && (
        <>
          {upcomingEvents.length > 0 && (
            <section className="upcoming">
              <div className="row headline">
                <div className="col-md-8 col-sm-8 col-xs-12">
                  <h2>Upcoming events</h2>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12 text-sm-right d-none d-sm-block pt-4">
                  <Link to={'/events'}><button className="eventSeries">See all events</button></Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-8 col-xs-12">
                  {upcomingEvents.map(({ node }) => (
                    <EventPreview key={node.id} event={node} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {currentExhibitions.length > 0 && (
            <section className="currently">
              <div className="row headline">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <h2>Current exhibitions</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-8 col-xs-12">
                  {currentExhibitions.map(({ node }) => (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {upcomingExhibitions.length > 0 && (
            <section className="upcoming">
              <div className="row headline">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <h2>Upcoming exhibitions</h2>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-8 col-xs-12">
                  {upcomingExhibitions.map(({ node }) => (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                  ))}
                </div>
              </div>
            </section>
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

import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Moment from 'moment'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ExhibitionListItem from '../components/exhibition-list-item'

class PankeExhibitions extends React.Component {

  filterCurrent = (_ex) => {
    var currentDate = new Date();
    var exhibtionStartDate = new Date(_ex.node.startDate);
    var exhibtionEndDate = new Date(_ex.node.endDate);
    return Moment(exhibtionStartDate, 'day').utcOffset(120).isSameOrBefore(currentDate, 'day') && Moment(exhibtionEndDate, 'day').utcOffset(120).isSameOrAfter(currentDate, 'day');
  }

  filterUpcoming = (_ex) => {
    var currentDate = new Date();
    var exhibtionStartDate = new Date(_ex.node.startDate);
    return Moment(exhibtionStartDate, 'day').utcOffset(120).isAfter(currentDate, 'day');
  }

  filterPast = (_ex) => {
    var currentDate = new Date();
    var exhibtionEndDate = new Date(_ex.node.endDate);
    return Moment(exhibtionEndDate, 'day').utcOffset(120).isBefore(currentDate, 'day');
  }

  render() {

    // Get array of exhibitions
    const posts = get(this, 'props.data.allContentfulExhibition.edges')

    // Log array of exhibitions
    console.log("Posts:", posts);

    // Filter array of exhibitions

    const currentExhibitions = posts.filter(this.filterCurrent);
    currentExhibitions.reverse();

    const upcomingExhibitions = posts.filter(this.filterUpcoming);
    upcomingExhibitions.reverse();

    const pastExhibitions = posts.filter(this.filterPast);

    // Log array of current exhibitions
    console.log("Current Exhibitions:");
    console.log(currentExhibitions);

    // Log array of upcoming exhibitions
    console.log("Upcoming Exhibitions:");
    console.log(upcomingExhibitions);

    // Log array of past exhibitions
    console.log("Past Exhibitions:");
    console.log(pastExhibitions);

    var current;
    if (currentExhibitions.length > 0){
      current = (
        <section className="currently">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Current</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {currentExhibitions.map(({ node }) => {
                return (
                  <ExhibitionListItem key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    var upcoming;
    if (upcomingExhibitions.length > 0){
      upcoming = (
        <section className="upcoming">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {upcomingExhibitions.map(({ node }) => {
                return (
                  <ExhibitionListItem key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    var past;
    if (pastExhibitions.length > 0){
      past = (
        <section className="past">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Past</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {pastExhibitions.map(({ node }) => {
                return (
                  <ExhibitionListItem key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
        <Helmet
          title="Exhibitions"
          meta={[
            {
              name: 'description',
              content: 'Upcoming and past exhibitions of panke.gallery in Berlin-Wedding. The gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture.'
            }
          ]}
        />

        {current}

        {upcoming}

        {past}

      </Layout>
    );
  }
}

export default PankeExhibitions;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PankeExhibitionsQuery {
    allContentfulExhibition(
      sort: { fields: [startDate], order: DESC }

    ) {
      edges {
        node {
          title
          slug
          startDate
          endDate
          dateTbc
          #startDate(formatString: "DD MMMM YYYY")
          #endDate(formatString: "DD MMMM YYYY")
          featuredImage {
            gatsbyImageData(
              layout: CONSTRAINED,
              width: 1050,
              placeholder: BLURRED
            )
          }
          description {
            childMarkdownRemark {
              html
            }
          }
          #openingHours
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


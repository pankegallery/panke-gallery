import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import ExhibitionPreview from '../components/exhibition-preview'


class PankeIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')

    {/*Get array of exhibitions*/}
    const posts = get(this, 'props.data.allContentfulExhibition.edges')

    {/*Log array of exhibitions*/}
    console.log("Posts:");
    console.log(posts);
    
    {/*Filter array of exhibitions*/}
    function filterCurrent(_ex) {
      var currentDate = new Date();
      var exhibtionStartDate = new Date(_ex.node.startDate);
      var exhibtionEndDate = new Date(_ex.node.endDate);
      return exhibtionEndDate > currentDate && currentDate > exhibtionStartDate;
    }
    const currentExhibitions = posts.filter(filterCurrent);

    function filterUpcoming(_ex) {
      var currentDate = new Date();
      var exhibtionStartDate = new Date(_ex.node.startDate);
      var exhibtionEndDate = new Date(_ex.node.endDate);
      return exhibtionStartDate > currentDate;
    }
    const upcomingExhibitions = posts.filter(filterUpcoming);

    {/*Log array of current exhibitions*/}
    console.log("Current Exhibitions:");
    console.log(currentExhibitions);

    {/*Log array of upcoming exhibitions*/}
    console.log("Upcoming Exhibitions:");
    console.log(upcomingExhibitions);

    {/*Create news code*/}
    var news = (
        <section className="news">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Upcoming events of panke.gallery</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <article className="news-item">
                <a href="https://netzkunst.berlin">
                  <h3>berlin infrastructure</h3>
                  <p>15:00&thinsp;-&thinsp;17:00 workshop<br />
                  Nadja Buttendorf<br />
                  17:00&thinsp;-&thinsp;19:00 panel<br />
                  Diana MacCarty, Pit Schulz (Moderation: Sakrowski)<br />
                  19:00&thinsp;-&thinsp;21:00 discussion<br />
                  Joachim Blank, tba</p>
                  <p className="meta">27 October 2018</p>
                </a>
              </article>
            </div>
          </div>
        </section>
    );

    {/*Create current exhibitions code if there are*/}
    if (currentExhibitions.length > 0){
      var current = (
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
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>
        </section>
      );
    }
    else{
      var current;
    }

    {/*Create upcoming exhibitions code if there are*/}
    if (upcomingExhibitions.length > 0){
      var upcoming = (
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
                    <ExhibitionPreview key={node.slug} exhibition={node} />
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

    return (
      <main>
        <Helmet title={siteTitle} />

        {news}

        {current}

        {upcoming}
        
      </main>

    );
  }
}

export default PankeIndex

export const pageQuery = graphql`
  query PankeHomeQuery {
    allContentfulExhibition(
      sort: { fields: [startDate], order: ASC }

    ) {
      edges {
        node {
          title
          slug
          startDate
          endDate
          #startDate(formatString: "DD MMMM YYYY")
          #endDate(formatString: "DD MMMM YYYY")
          featuredImage {
            sizes(maxWidth: 1000) {
             ...GatsbyContentfulSizes
            }
          }
          openingHours
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

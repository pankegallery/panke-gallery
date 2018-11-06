import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import ArticlePreview from '../components/article-preview'
import ExhibitionPreview from '../components/exhibition-preview'


class PankeIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulExhibition.edges')
    console.log("Posts:");
    console.log(posts);
    
    return (
      <main>
        <Helmet title={siteTitle} />
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

        <section className="currently">

          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h2>Current</h2>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 col-sm-8 col-xs-12">
              {posts.map(({ node }) => {
                return (
                    <ExhibitionPreview key={node.slug} exhibition={node} />
                )
              })}
            </div>
          </div>

        </section>
        
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
          startDate(formatString: "DD MMMM YYYY")
          endDate(formatString: "DD MMMM YYYY")
          featuredImage {
            sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
             ...GatsbyContentfulSizes_withWebp
            }
          }
          description {
            childMarkdownRemark {
              html
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

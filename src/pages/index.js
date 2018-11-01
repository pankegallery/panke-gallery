import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import ArticlePreview from '../components/article-preview'


class PankeIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allContentfulBlogPost.edges')
    const [author] = get(this, 'props.data.allContentfulPerson.edges')
    
    
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

          <article className="exhibition-item">
            <div className="row">
              <div className="col-md-12 col-sm-8 col-xs-12">
                <a href="<?php get_url('exhibition','zentrum-netzkunst'); ?>">
                  <div className="image-wrapper">
                    <img src="../img/netzkunst/ZentrumNetzkunst_2048.jpg" alt="Berlin, Zentrum der Netzkunst - damals und heute"  />
                  </div>
                </a>
                <h3>Berlin, Zentrum der Netzkunst – damals und heute</h3>

                <p className="meta">Group Show with <a href="http://www.nadjabuttendorf.com"> Nadja Buttendorf</a> | <a href="http://simondenny.net"> Simon Denny</a> | <a href="https://harmvandendorpel.com/">Harm van den Dorpel</a> | <a href="http://www.constantdullaart.com">Constant Dullaart</a> | <a href="http://www.fuenfnullzwei.de">Holger Friese</a> | <a href="https://www.evagrubinger.com/">Eva Grubinger</a> | <a href="https://web.archive.org/web/19990429102029/http://www.icf.de:80/overview.html">Internationale Stadt Berlin</a> | <a href="https://web.archive.org/web/19990218073155/http://www.icf.de:80/jodi/message.html">Jodi</a> | <a href="https://jonaslund.biz/">Jonas Lund</a> | <a href="http://www.rolux.org">Sebastian L&uuml;tgert</a> | <a href="http://katjanovi.net/">Katja Novitskova</a> | <a href="http://www.sebastianschmieg.com">Sebastian Schmieg</a> | <a href="http://artwarez.org/">Cornelia Sollfrank</a> and t.b.a.</p>

                <p className="meta">4 October&thinsp;–&thinsp;23 November 2018 | opening times: Wed, Thu, Fri, Sat 15:00&thinsp;-&thinsp;19:00 and for special events</p>
              </div>
            </div>

          </article>
        </section>
        
        {/*Test from old gatsby starter*/}
        <div style={{ background: '#fff' }}>
          <div className="wrapper">
            <h2 className="section-headline">Recent articles</h2>
            <ul className="article-list">
              {posts.map(({ node }) => {
                return (
                  <li key={node.slug}>
                    <ArticlePreview article={node} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        
      </main>

    );
  }
}

export default PankeIndex

export const pageQuery = graphql`
  query PankeHomeQuery {
    allContentfulBlogPost(sort: { fields: [publishDate], order: DESC }) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "D MMMM YYYY")
          tags
          heroImage {
            sizes(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
             ...GatsbyContentfulSizes_withWebp
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulPerson(filter: { id: { eq: "c15jwOBqpxqSAOy2eOO4S0m" } }) {
      edges {
        node {
          name
          shortBio {
            shortBio
          }
          title
          heroImage: image {
            sizes(
              maxWidth: 1180
              maxHeight: 480
              resizingBehavior: PAD
              background: "rgb:000000"
            ) {
              ...GatsbyContentfulSizes_withWebp
            }
          }
        }
      }
    }
  }
`

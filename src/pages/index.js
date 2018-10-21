import React from 'react';
import Link from 'gatsby-link';

export default function Index({
  data
}) {
  return (
    <main>
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
    </main>
  );
}

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
          }
        }
      }
    }
    archive: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            path: date(formatString: "Y-MM")
            title: date(formatString: "MMMM Y")
          }
        }
      }
    }
  }
`;

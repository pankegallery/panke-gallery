import React from 'react';
import Link from 'gatsby-link';

export default function Exhibitions({
  data
}) {
  return (
    <main>
      <section className="currently">

        <div className="row headline">
          <div className="col-sm-12 col-xs-12">
              <h2>Current</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-xs-12">
              <article className="exhibition-item">
                <a href="#">
                  <img src="../img/netzkunst/ZentrumNetzkunst_2048.jpg" alt="Zentrum der Netzkunst – Flyer" class="img-fluid"/>
                  <h3>Berlin, Zentrum der Netzkunst – damals und heute <small>4 October&thinsp;–&thinsp;23 November 2018</small></h3>
                </a>
              </article>
          </div>
        </div>
      </section>

      <section className="past">

        <div className="row headline">
          <div className="col-sm-12 col-xs-12">
              <h2>Past</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 col-xs-12">
              <article className="exhibition-item">
                <a href="<?php get_url('exhibition','medienkoerper'); ?>">
                    <img src="../img/medienK/grass_gross.jpg" alt="Flyer" className="img-fluid"/>
                    <h3>Medienk&ouml;rper<strong> &mdash; Yvon Chabrowski</strong> &amp; <strong>Dani Ploeger</strong> <small>9 Juni&thinsp;–&thinsp;21 Juni 2018</small></h3>
                </a>
              </article>
          </div>
        </div>
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

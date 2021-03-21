import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import EditionListItem from '../components/edition-list-item'


class PankeEdition extends React.Component{
  render() {
    // Get array of content blocks
    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');

    // Get array of editions
    const posts = get(this, 'props.data.allContentfulEdition.edges');

    // Log array of Content Blocks
    console.log("Blocks:");
    console.log(blocks);

    // Log array of Editions
    console.log("Editions:");
    console.log(posts);

    return(
      <Layout>
        <Helmet
          title="Edition"
          meta={[
            {
              name: 'description',
              content: 'The edition of panke.gallery is published as a limited edition of 100. It is a series of artist’s editions and is made up of a designed cover and an inlay with the download code for the artwork. The design of the editions is intended emphasize its character as a collectible digital object and illustrate the work of the featured artist.'
            }
          ]}
        />

        {blocks.map(({node}) => {
          return (
              <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}

        <section className="editions further">

          <div className="row">
            <div className="col-md-4 col-sm-12 col-xs-12">
              <h2>Previous editions</h2>
            </div>

            <div className="col-md-8 col-sm-12 col-xs-12">
              {posts.map(({ node }) => {
                return (
                    <EditionListItem key={node.slug} edition={node} />
                )
              })}
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

export default PankeEdition;


export const pageQuery = graphql`
  query PankeEditionQuery {
    allContentfulContentBlock (filter: {page: {eq: "Edition"}}, sort: { fields: [createdAt], order: ASC}){
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
    allContentfulEdition(
      sort: { fields: [slug], order: DESC }

    ) {
      edges {
        node {
          title
          slug
          featuredImage {
            fluid(maxWidth: 1000) {
              sizes
              src
            }
          }
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


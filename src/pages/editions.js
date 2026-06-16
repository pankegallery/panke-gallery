import React from 'react';
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import EditionListItem from '../components/edition-list-item'
import { FurtherSection,  } from '../components/content/Content.styles';
import { Row, Col } from '../components/layout/Layout.styles';

class PankeEdition extends React.Component {

  render() {

    // Get array of content blocks
    const blocks = get(this, 'props.data.allContentfulContentBlock.edges');

    // Get array of editions
    const posts = get(this, 'props.data.allContentfulEdition.edges');

    //    // Log array of Content Blocks
    //    console.log("Blocks:", blocks);
    //
    //    // Log array of Editions
    //    console.log("Editions:", posts);

    return (
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

        {blocks.map(({ node }) => {
          return (
            <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
          )
        })}

        <FurtherSection className="editions">
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>Previous editions</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              {posts.map(({ node }) => {
                return (
                  <EditionListItem key={node.slug} edition={node} />
                )
              })}
            </Col>
          </Row>
        </FurtherSection>

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
            gatsbyImageData(
              layout: CONSTRAINED,
              width: 1050
            )
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


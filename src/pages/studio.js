import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ExhibitionItem from '../components/exhibition-item'
import { ContentHtml } from '../components/content-block'
import { FurtherSection, CardGrid } from '../components/content/Content.styles'
import { Row, Col } from '../components/layout/Layout.styles'

/**
 * One section of /studio: the label in the left column, the intro text and
 * the cards in the right two thirds.
 *
 * @param {Object} props
 * @param {string} props.label - Section label.
 * @param {Object} [props.intro] - Content block with `blockContent`.
 * @param {React.ReactNode} props.children - The cards.
 */
const StudioSection = ({ label, intro, children }) => (
  <FurtherSection>
    <Row>
      <Col $md={4} $sm={4} $xs={12}>
        <h2>{label}</h2>
      </Col>
      <Col $md={8} $sm={8} $xs={12}>
        <ContentHtml html={intro?.blockContent?.childMarkdownRemark?.html} />
        <CardGrid>{children}</CardGrid>
      </Col>
    </Row>
  </FurtherSection>
)

/**
 * /studio (#85), formerly /editions: residencies and editions, each with its
 * intro text and cards, newest first. Residency cards link to their page and
 * show the dates; edition cards are labelled "Edition" instead, as editions
 * have no dates.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result.
 */
const Studio = ({ data }) => (
  <Layout>
    <Helmet
      title="Studio"
      meta={[
        {
          name: 'description',
          content: 'Residencies and editions of panke.gallery: a remote residency for net art, and a series of limited artist’s editions.'
        }
      ]}
    />

    <StudioSection label="Residency" intro={data.residencyIntro}>
      {data.allContentfulResidency.nodes.map((residency) => (
        <ExhibitionItem
          key={residency.slug}
          exhibition={residency}
          variant="card"
          to={`/residency/${residency.slug}`}
        />
      ))}
    </StudioSection>

    <StudioSection label="Edition" intro={data.editionIntro}>
      {data.allContentfulEdition.nodes.map((edition) => (
        <ExhibitionItem
          key={edition.slug}
          exhibition={edition}
          variant="card"
          to={`/edition/${edition.slug}`}
          dateLine="Edition"
        />
      ))}
    </StudioSection>
  </Layout>
)

export default Studio

// The intros are found by slug rather than by the block's `page`, so it
// doesn't matter whether "About the Editions" is still filed under
// "Edition" or already under "Studio". Card images are 16:10, as in the
// Recent grid.
export const pageQuery = graphql`
  query StudioQuery {
    residencyIntro: contentfulContentBlock(slug: { eq: "about-the-residency" }) {
      blockContent {
        childMarkdownRemark {
          html
        }
      }
    }
    editionIntro: contentfulContentBlock(slug: { eq: "edition-about" }) {
      blockContent {
        childMarkdownRemark {
          html
        }
      }
    }
    allContentfulResidency(sort: { startDate: DESC }) {
      nodes {
        title
        slug
        startDate
        endDate
        dateTbc
        featuredImage {
          gatsbyImageData(layout: CONSTRAINED, width: 1050, aspectRatio: 1.6)
        }
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
    allContentfulEdition(sort: { slug: DESC }) {
      nodes {
        title
        slug
        featuredImage {
          gatsbyImageData(layout: CONSTRAINED, width: 1050, aspectRatio: 1.6)
        }
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`

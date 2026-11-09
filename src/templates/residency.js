import React from 'react'
import Helmet from 'react-helmet'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock, { ContentHtml } from '../components/content-block'
import ExhibitionItem from '../components/exhibition-item'
import { ExternalMark } from '../components/exhibition-item/ExhibitionItem.styles'
import { formatDateRange } from '../utils/formatDateRange'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import {
  Button,
  HeadSection,
  ImageWithButton,
  InfoSection,
  Section,
  Headline,
} from '../components/content/Content.styles'
import { ItemDate, Subline } from '../components/content/Item.styles'
import { Row, Col, Grid } from '../components/layout/Layout.styles'

/**
 * The works of a residency as archive rows (#67) on the page `Grid`, in the
 * order they have in Contentful. Each row links to the work's own site.
 * Renders nothing before the first work is published.
 *
 * @param {Object} props
 * @param {Object[]} [props.works] - `ContentfulResidencyWork` nodes.
 */
const WorksSection = ({ works }) => {
  if (!works?.length) return null

  return (
    <Section>
      <Headline>
        <h2>Works from the residency</h2>
      </Headline>
      <Grid>
        {works.map(({ id, title, year, type, url, image, shortDescription }) => (
          <ExhibitionItem
            key={id}
            // Same shape as an exhibition, so the row needs no work variant.
            exhibition={{ title, featuredImage: image, description: shortDescription }}
            variant="row"
            headingLevel={3}
            href={url}
            dateLine={[year, type].filter(Boolean).join(' · ')}
          />
        ))}
      </Grid>
    </Section>
  )
}

/**
 * The button to a residency's landing page, centred on its featured image.
 * The Contentful field is plain text, so it takes both: a path on this site
 * ("/…") opens like any internal link, a full URL opens in a new tab with
 * an ↗, like the works.
 *
 * @param {Object} props
 * @param {string} props.url - `residencyLandingPage` from Contentful.
 */
const LandingPageButton = ({ url }) =>
  url.startsWith('/') ? (
    <Button as={Link} to={url}>
      Visit live studio
    </Button>
  ) : (
    <Button as="a" href={url} target="_blank" rel="noopener noreferrer">
      Visit live studio
      {/* The arrow alone says nothing to a screen reader. */}
      <ExternalMark aria-label="opens external site" role="img">↗</ExternalMark>
    </Button>
  )

/**
 * A residency page (#85), built like the exhibition page: the head with the
 * title on the left and the artist line and dates on the right, aligned with
 * the 4/8 columns of the sections below; the featured image at 16:9; "About
 * the residency" in Medium; further blocks such as "About the artist" in
 * Light; then the works. With a `residencyLandingPage`, a button to it sits
 * on the image.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result.
 */
const ResidencyTemplate = ({ data }) => {
  const residency = data.contentfulResidency
  const { title, featuredImage } = residency
  const landingPage = residency.residencyLandingPage?.trim()

  return (
    <Layout>
      <main>
        <Helmet title={title} />
        <HeadSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h1>{keepSeparatorsAttached(title)}</h1>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <Subline $variant="page">
                <ContentHtml html={residency.subtitleShortDescription?.childMarkdownRemark?.html} />
              </Subline>
              <ItemDate>
                {formatDateRange(residency.startDate, residency.endDate, { tbc: residency.dateTbc })}
              </ItemDate>
            </Col>
          </Row>

          {featuredImage?.gatsbyImageData ? (
            <ImageWithButton>
              <GatsbyImage image={featuredImage.gatsbyImageData} alt={featuredImage.description || title} />
              {landingPage && <LandingPageButton url={landingPage} />}
            </ImageWithButton>
          ) : (
            // Without an image the link still shows, on its own.
            landingPage && <LandingPageButton url={landingPage} />
          )}
        </HeadSection>

        <InfoSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>About the residency</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <ContentHtml html={residency.description?.childMarkdownRemark?.html} />
            </Col>
          </Row>
        </InfoSection>

        {residency.furtherInformationBlocks?.map(({ id, title: blockTitle, blockContent }) => (
          <ContentBlock key={id} blockTitle={blockTitle} blockContent={blockContent} />
        ))}

        <WorksSection works={residency.works} />
      </main>
    </Layout>
  )
}

export default ResidencyTemplate

// Featured image at 16:9 as in the mockup; work images at 16:10 like the
// archive rows they share their layout with.
export const pageQuery = graphql`
  query ResidencyBySlug($slug: String!) {
    contentfulResidency(slug: { eq: $slug }) {
      title
      startDate
      endDate
      dateTbc
      subtitleShortDescription {
        childMarkdownRemark {
          html
        }
      }
      description {
        childMarkdownRemark {
          html
        }
      }
      featuredImage {
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          aspectRatio: 1.7778,
          placeholder: BLURRED,
          quality: 100
        )
        description
      }
      residencyLandingPage
      furtherInformationBlocks {
        id
        title
        blockContent {
          childMarkdownRemark {
            html
          }
        }
      }
      works {
        id
        title
        year
        type
        url
        image {
          gatsbyImageData(
            layout: CONSTRAINED,
            width: 1050,
            aspectRatio: 1.6,
            placeholder: BLURRED
          )
          description
        }
        shortDescription {
          childMarkdownRemark {
            excerpt(pruneLength: 1200)
          }
        }
      }
    }
  }
`

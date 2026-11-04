import React from 'react';
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import ContentBlock from '../components/content-block'
import EventSection from '../components/event-section'
import { processExternalLinks } from '../utils/processExternalLinks'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { InfoSection, FurtherSection, SectionStack } from '../components/content/Content.styles';
import { Row, Col } from '../components/layout/Layout.styles';

const infoBlock = {
  title: 'About',
  content: '<strong>/rosa is a project space in Berlin. It is jointly run by <a href="https://netzkunst.berlin">Zentrum für Netzkunst (ZfN)</a> and panke.gallery and focuses on researching and exhibiting net art and net culture.</strong>'
}

const moreBlock = {
  title: 'More',
  content: `/rosa offers a site for local and international dialogues between researchers, students, net art enthusiasts, and established and emerging artists. In addition to showing artworks, /rosa proposes experimental formats of art mediation, with public lectures and a workspace, as well as a growing research library for self-study. It also  functions as a venue for community events such as reading groups and workshops.`
}

const address = `
  <strong>/rosa</strong><br>
  Heidelberger Str. 28<br>
  12059 Berlin
`

/**
 * /rosa, the project space run with Zentrum für Netzkunst: about, address,
 * the /rosa content blocks from Contentful, then the events of the "rosa"
 * series in the same rows as on the homepage and /events. The upcoming
 * event gets a thumbnail; there is rarely more than one at a time, so its
 * row spans the page.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result: the /rosa content blocks
 *   and the rosa events, newest first.
 */
const PankeRosa = ({ data }) => {
  const blocks = data.allContentfulContentBlock.nodes
  const events = data.allContentfulEvent.nodes

  const now = new Date()
  // The query sorts newest first; upcoming events read better soonest first.
  const upcoming = events.filter(({ date }) => new Date(date) >= now).reverse()
  const past = events.filter(({ date }) => new Date(date) < now)

  return (
    <Layout>
      <main>
        <Helmet
          title="/rosa"
          meta={[
            {
              name: 'description',
              content: '/rosa is a project space jointly run by Zentrum für Netzkunst (ZfN) and panke.gallery focused on representing net art and net culture in Berlin.'
            }
          ]}
        />

        <InfoSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>{keepSeparatorsAttached(infoBlock.title)}</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <div dangerouslySetInnerHTML={{
                __html: processExternalLinks(infoBlock.content)
              }} />
            </Col>
          </Row>
        </InfoSection>

        <FurtherSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <div dangerouslySetInnerHTML={{
                __html: processExternalLinks(address)
              }}
                style={{
                  background: '#00ef00',
                  display: 'inline'
                }} />
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <div dangerouslySetInnerHTML={{
                __html: processExternalLinks(moreBlock.content)
              }} />
            </Col>
          </Row>
        </FurtherSection>

        {blocks.map((node) => (
          <ContentBlock key={node.id} blockTitle={node.title} blockContent={node.blockContent} />
        ))}

        <SectionStack>
          <EventSection label="Upcoming at /rosa" events={upcoming} withImage />
          <EventSection label="Past events at /rosa" events={past} />
        </SectionStack>
      </main>
    </Layout>
  );
}

export default PankeRosa;

export const pageQuery = graphql`
  query PankeRosaQuery {
    allContentfulContentBlock(filter: { page: { eq: "/rosa" } }, sort: { slug: ASC }) {
      nodes {
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
    allContentfulEvent(
      sort: { date: DESC }
      filter: {eventSeries: {slug: {eq: "rosa"}}}
    ) {
      nodes {
        title
        slug
        date
        endTime
        openEnd
        subtitleShortDescription {
          childMarkdownRemark {
            html
          }
        }
        # The thumbnail of the upcoming event: full width on phones, the first
        # column from breakpoints.sm. Sized and cropped like the exhibition
        # images.
        featuredImage {
          gatsbyImageData(
            layout: CONSTRAINED,
            width: 1050,
            aspectRatio: 1.6,
            placeholder: BLURRED
          )
        }
      }
    }
  }
`

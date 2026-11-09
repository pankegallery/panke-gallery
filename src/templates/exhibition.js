import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'
import { formatDateRange } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { HeadSection, InfoSection, Button } from '../components/content/Content.styles'
import { ItemDate, Subline } from '../components/content/Item.styles'
import { Row, Col } from '../components/layout/Layout.styles'
import Tag from '../components/tag'

class ExhibitionTemplate extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')

    const audioguideStops = get(this.props, 'data.allAudioguideStop.edges', [])
    const hasAudioguide = audioguideStops.some(({ node }) => node.audioUrl)

    // ––– Slideshow or featured images –––

    var ImageOrSlides;
    if (exhibition.exhibitionImpressionsSlideshow != null) {
      ImageOrSlides = (
        <Slideshow slides={exhibition.exhibitionImpressionsSlideshow} length={exhibition.exhibitionImpressionsSlideshow.length} />
      );
    }
    else if (exhibition.featuredImage?.gatsbyImageData) {
      // Without image data (e.g. a broken upload) GatsbyImage would warn on
      // every build, so the image is left out instead.
      ImageOrSlides = (
        <GatsbyImage alt="FeaturedImage" image={exhibition.featuredImage.gatsbyImageData} />
      );
    }


    // ––– Documentation –––

    var DocumentationImages;
    if (exhibition.exhibitionDocumentationImagesBelow) {
      DocumentationImages = (
        <Documentation images={exhibition.exhibitionDocumentationImagesBelow} />
      );
    }

    // ––– Further Content Blocks –––

    var FurtherContentBlocks
    if (exhibition.furtherInformationBlocks) {
      FurtherContentBlocks = (
        exhibition.furtherInformationBlocks.map(({ id, title, childContentfulContentBlockBlockContentTextNode }) => {
          return (
            <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }

    // ––– Exhibition tags –––

    var exhibitionTags;
    if (exhibition.tags != null) {
      exhibitionTags = (
        exhibition.tags.map(({ slug, name }) => (
          <Tag key={slug} tag={{ slug, name }} />
        ))
      );
    }


    // --- Date or to be confirmed plus other meta--

    let metaInfos = formatDateRange(exhibition.startDate, exhibition.endDate, { tbc: exhibition.dateTbc })

    if (exhibition.openingHours) {
      metaInfos += ' | ' + exhibition.openingHours
    }

    if (exhibition.vernissageInfos) {
      metaInfos += ' | ' + exhibition.vernissageInfos
    }
    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
        <main>
          <Helmet title={`${exhibition.title}`} />
          <HeadSection>
            {/* Title and date left, subline and tags right: 4/8 like the
                "About the exhibition" row below, 6/6 on larger screens (#70). */}
            <Row>
              <Col $md={6} $sm={4} $xs={12}>
                <h1>{keepSeparatorsAttached(exhibition.title)}</h1>
                <ItemDate>{metaInfos}</ItemDate>
              </Col>
              <Col $md={6} $sm={8} $xs={12}>
                <Subline $variant="page" dangerouslySetInnerHTML={{
                  __html: processExternalLinks(exhibition.subtitleShortDescription.childMarkdownRemark.html)
                }} />
                {exhibitionTags}
              </Col>
            </Row>

            {/*  ---- SLIDESHOW ---- */}

            {ImageOrSlides}
          </HeadSection>

          {/*  ---- ABOUT ---- */}

          <InfoSection>
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                <h2>About the exhibition</h2>
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                <div dangerouslySetInnerHTML={{
                  __html: processExternalLinks(exhibition.description.childMarkdownRemark.html)
                }} />
              </Col>
            </Row>
          </InfoSection>

          {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

          {FurtherContentBlocks}

          {/*  ---- AUDIOGUIDE ---- */}

          {hasAudioguide && (
            <InfoSection>
              <Row>
                <Col $md={4} $sm={4} $xs={12}>
                  <h2>Audio guide</h2>
                </Col>
                <Col $md={8} $sm={8} $xs={12}>
                  <p>This exhibition has a free audio guide.</p>
                  <p style={{ fontWeight: "normal" }}>Listen on your phone as you walk through, or scan the code at each artwork. <br />
                    We kindly ask you to bring your own headphones.</p>
                  <Button as={Link} to={`/guide/${exhibition.slug}/`} style={{ margin: "10px 0" }}>Open the audioguide</Button>
                </Col>
              </Row>
            </InfoSection>
          )}

          {/*  ---- DOCUMENTATION IMAGES ---- */}

          {DocumentationImages}

        </main>
      </Layout>
    )
  }
}

export default ExhibitionTemplate;


//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query ExhibitionsBySlug($slug: String!) {
    contentfulExhibition(slug: { eq: $slug }) {
      slug
      title
      startDate
      endDate
      dateTbc
      tags {
        slug
        name
      }
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
      openingHours
      vernissageInfos
      furtherInformationBlocks {
        id
        title
        childContentfulContentBlockBlockContentTextNode {
          id
          childMarkdownRemark {
            html
          }
        }

      }
      featuredImage{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
      }
      exhibitionImpressionsSlideshow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        description
      }
      exhibitionDocumentationImagesBelow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        description
      }
    }
    allAudioguideStop(filter: { exhibitionSlug: { eq: $slug } }) {
      edges {
        node {
          audioUrl
        }
      }
    }
  }
`

import React from 'react'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Seo, { excerptOf, shareImageOf } from '../components/seo'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Checkout from '../components/checkout'
import { processExternalLinks } from '../utils/processExternalLinks'
import { keepSeparatorsAttached } from '../utils/keepSeparatorsAttached'
import { HeadSection, FurtherSection } from '../components/content/Content.styles'
import { Row, Col } from '../components/layout/Layout.styles'

class EditionTemplate extends React.Component {

  getChechoutStatus = () => {
    let url = typeof window !== 'undefined' ? window.location.href : '';
    return (url.indexOf('checkout') > 0) ?
      url.substr(url.indexOf('=') + 1) : 'initial'
  }


  render() {

    const edition = get(this.props, 'data.contentfulEdition')

    // ––– Slideshow or featured images –––

    var ImageOrSlides;
    if (edition.editionImpressionsSlideshow != null) {
      ImageOrSlides = (
        <Slideshow slides={edition.editionImpressionsSlideshow} alt={edition.title} />
      );
    }
    else if (edition.featuredImage?.gatsbyImageData) {
      // Without image data (e.g. a broken upload) GatsbyImage would warn on
      // every build, so the image is left out instead.
      ImageOrSlides = (
        <GatsbyImage alt={edition.featuredImage.description || edition.title} image={edition.featuredImage.gatsbyImageData} />
      );
    }


    // ––– Further Content Blocks –––

    var FurtherContentBlocks;
    if (edition.furtherInformationBlocks) {
      FurtherContentBlocks = (
        edition.furtherInformationBlocks.map(({ id, title, childContentfulContentBlockBlockContentTextNode }) => {
          return (
            <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }

    // --- Checkout ---

    const checkoutStatus = this.getChechoutStatus()
    var EditionCheckout;

    if (edition.stripePriceId) {
      if (checkoutStatus === 'success') {
        EditionCheckout = (
          <div className="alert alert-success"><p><strong>Thank you for your purchase.</strong></p><p>Once we receive your payment, we will contact you for shipping details.</p><p> Enjoy the edition!</p></div>
        )
      }
      else {
        EditionCheckout = (
          <Checkout slug={edition.slug} priceID={edition.stripePriceId} />
        )
      }
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
        <div>
          <HeadSection>

            <h1>{keepSeparatorsAttached(edition.title)}</h1>
            <div className="subtitle" dangerouslySetInnerHTML={{
              __html: processExternalLinks(edition.subtitleShortDescription.childMarkdownRemark.html)
            }} />

            {/*  ---- FEATURED IMAGE ---- */}

            {ImageOrSlides}

          </HeadSection>

          {/*  ---- ABOUT ---- */}
          
          <FurtherSection className="about-edition">
            <Row>
              <Col $md={4} $sm={4} $xs={12}>
                <h2>About the edition</h2>
                {EditionCheckout}
              </Col>
              <Col $md={8} $sm={8} $xs={12}>
                <div dangerouslySetInnerHTML={{
                  __html: processExternalLinks(edition.description.childMarkdownRemark.html)
                }} />
              </Col>
            </Row>
          </FurtherSection>

          {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

          {FurtherContentBlocks}

        </div>
      </Layout>
    )
  }
}

// The share preview: the entry's subtitle, or else the start of its text, and
// its featured image, or else the first slide.
export const Head = ({ data, location }) => {
  const entry = data.contentfulEdition
  return (
    <Seo
      title={entry.title}
      description={excerptOf(entry.subtitleShortDescription, entry.description)}
      path={location.pathname}
      image={shareImageOf(entry.featuredImage || entry.editionImpressionsSlideshow?.[0])}
      type="article"
    />
  )
}

export default EditionTemplate;



//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query EditionBySlug($slug: String!) {
    contentfulEdition(slug: { eq: $slug }) {
      title
      slug
      subtitleShortDescription {
        childMarkdownRemark {
          html
          excerpt(pruneLength: 200)
        }
      }
      description {
        childMarkdownRemark {
          html
          excerpt(pruneLength: 200)
        }
      }
      stripePriceId
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
        url
        mimeType
        description
      }
      editionImpressionsSlideshow{
        gatsbyImageData(
          layout: CONSTRAINED,
          width: 1050,
          placeholder: BLURRED,
          quality: 100
        )
        url
        mimeType
        description
      }
    }
  }
`

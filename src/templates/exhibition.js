import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'
import Moment from 'moment'
import { processExternalLinks } from '../utils/processExternalLinks'
import { HeadSection, Meta, InfoSection, Button } from '../components/content/Content.styles'
import { Row, Col } from '../components/layout/Layout.styles'


class ExhibitionTemplate extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')
    console.log(exhibition);

    const audioguideStops = get(this.props, 'data.allAudioguideStop.edges', [])
    const hasAudioguide = audioguideStops.some(({ node }) => node.audioUrl)

    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    console.log(siteTitle);

    // ––– Slideshow or featured images –––

    var ImageOrSlides;
    if (exhibition.exhibitionImpressionsSlideshow != null){
      ImageOrSlides =(
        <Slideshow slides={exhibition.exhibitionImpressionsSlideshow} length={exhibition.exhibitionImpressionsSlideshow.length} />
      );
    }
    else{
      ImageOrSlides =(
        <GatsbyImage alt="FeaturedImage" image={exhibition.featuredImage.gatsbyImageData} aspectratio={16/9} />
      );
    }


    // ––– Documentation –––

    var DocumentationImages;
    if (exhibition.exhibitionDocumentationImagesBelow){
      DocumentationImages =(
        <Documentation images={exhibition.exhibitionDocumentationImagesBelow} />
      );
    }

    // ––– Further Content Blocks –––

    var FurtherContentBlocks
    if (exhibition.furtherInformationBlocks){
      FurtherContentBlocks =(
        exhibition.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }

    // ––– Exhibition tags –––

    var exhibitionTags;
    if (exhibition.tags!=null){
      exhibitionTags =(
        exhibition.tags.map(({slug, name}) => {
          return (
            <p className="tag">
              {name}
            </p>
          )
        })
      );
    }


        // --- Date or to be confirmed plus other meta--

    let dateDisplayed

    if (exhibition.dateTbc){
      dateDisplayed = "Date to be confirmed"
    }
    else{
      dateDisplayed = Moment(exhibition.startDate).format('DD MMMM') + '\u2009\u2013\u2009' + Moment(exhibition.endDate).format('DD MMMM YYYY')
    }

    let metaInfos = dateDisplayed

    if (exhibition.vernissageInfos){
      metaInfos += ' | ' + exhibition.openingHours
    }

    if (exhibition.vernissageInfos){
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

          <h1>{exhibition.title}</h1>
          <div className="subtitle" dangerouslySetInnerHTML={{
              __html: processExternalLinks(exhibition.subtitleShortDescription.childMarkdownRemark.html)
            }} />
          <Meta>
           {metaInfos}
          </Meta>

          {exhibitionTags}

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
                <p style={{fontWeight: "normal"}}>Listen on your phone as you walk through, or scan the code at each artwork. <br />
                We kindly ask you to bring your own headphones.</p>
                <Button as={Link} to={`/guide/${exhibition.slug}/`} style={{margin: "10px 0", display: "inline-block"}}>Open the audioguide</Button>
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

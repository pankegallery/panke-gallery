import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { GatsbyImage } from 'gatsby-plugin-image'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'
import Moment from 'moment'

class ExhibitionTemplate extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')
    console.log(exhibition);

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
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{exhibition.title}</h1>
              <div className="subtitle" dangerouslySetInnerHTML={{
                  __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
                }} />
              <p className="meta">
               {metaInfos}
              </p>

              {exhibitionTags}

              {/*  ---- SLIDESHOW ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/*  ---- ABOUT ---- */}

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the exhibition</h2>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <div dangerouslySetInnerHTML={{
                __html: exhibition.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

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
  }
`

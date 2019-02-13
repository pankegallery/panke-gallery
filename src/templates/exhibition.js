import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Documentation from '../components/documentation-images'

class ExhibitionTemplate extends React.Component {
  render() {

    {/*=======================================================================
    =======================================================================*/}

    const exhibition = get(this.props, 'data.contentfulExhibition')
    console.log(exhibition);

    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    console.log(siteTitle);

    {/* ––– Slideshow or featured images ––– */}

    if (exhibition.exhibitionImpressionsSlideshow != null){
      var ImageOrSlides =(
        <Slideshow slides={exhibition.exhibitionImpressionsSlideshow} length={exhibition.exhibitionImpressionsSlideshow.length} />
      );
    }
    else{
      var ImageOrSlides =(
        <Img alt="FeaturedImage" sizes={{...exhibition.featuredImage.sizes , aspectRatio: 16/9}} />
      );
    }


    {/* ––– Documentation ––– */}

    console.log(exhibition.exhibitionDocumentationImagesBelow);
    if (exhibition.exhibitionDocumentationImagesBelow){
      var DocumentationImages =(
        <Documentation images={exhibition.exhibitionDocumentationImagesBelow} />
      );
    }
    else{
      var DocumentationImages;
    }

    {/* ––– Further Content Blocks ––– */}

    if (exhibition.furtherInformationBlocks){
      var FurtherContentBlocks =(
        exhibition.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }
    else{
      var FurtherContentBlocks;
    }

    {/*==========================================================================

                                    OUTPUT

    ==========================================================================*/}

    return (
      <main>
        <Helmet title={`${exhibition.title}`} />
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{exhibition.title}</h1>
              <p dangerouslySetInnerHTML={{
                  __html: exhibition.subtitleShortDescription.childMarkdownRemark.html
                }} />
              <p className="meta">{exhibition.startDate}&thinsp;&ndash;&thinsp;{exhibition.endDate} | {exhibition.openingHours}</p>

              {/* ---- SLIDESHOW ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/* ---- ABOUT ---- */}

        <section className="info">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the exhibition</h2>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <p dangerouslySetInnerHTML={{
                __html: exhibition.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/* ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

        {/* ---- DOCUMENTATION IMAGES ---- */}

        {DocumentationImages}

      </main>
    )
  }
}

export default ExhibitionTemplate;


{/*=========================================================================

                                QUERY

==========================================================================*/}

export const pageQuery = graphql`
  query ExhibitionsBySlug($slug: String!) {
    contentfulExhibition(slug: { eq: $slug }) {
      title
      startDate(formatString: "DD MMMM YYYY")
      endDate(formatString: "DD MMMM YYYY")
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
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
      }
      exhibitionImpressionsSlideshow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
      exhibitionDocumentationImagesBelow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
    }
  }
`

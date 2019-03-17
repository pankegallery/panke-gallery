import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'

class EditionTemplate extends React.Component {
  render() {

    const edition = get(this.props, 'data.contentfulEdition')
    console.log(edition);

    {/* ––– Slideshow or featured images ––– */}

    if (edition.editionImpressionsSlideshow != null){
      var ImageOrSlides =(
        <Slideshow slides={edition.editionImpressionsSlideshow} length={edition.editionImpressionsSlideshow.length} />
      );
    }
    else{
      var ImageOrSlides =(
        <Img alt="FeaturedImage" sizes={{...edition.featuredImage.sizes , aspectRatio: 16/9}} />
      );
    }


    {/* ––– Further Content Blocks ––– */}

    if (edition.furtherInformationBlocks){
      var FurtherContentBlocks =(
        edition.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
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
        <Helmet title={`${edition.title}`} />
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{edition.title}</h1>
              <div className="subtitle" dangerouslySetInnerHTML={{
                  __html: edition.subtitleShortDescription.childMarkdownRemark.html
                }} />

              {/* ---- FEATURED IMAGE ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/* ---- ABOUT ---- */}

        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the edition</h2>
              <p dangerouslySetInnerHTML={{
                __html: edition.embedCode.childMarkdownRemark.html
              }} />
              <small>The widget needs coockies from third parties to be enabled. If you don't want to follow this requirement, feel free to write us an email to info@panke.gallery.</small>
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <p dangerouslySetInnerHTML={{
                __html: edition.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/* ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

      </main>
    )
  }
}

export default EditionTemplate;



{/*=========================================================================

                                QUERY

==========================================================================*/}


export const pageQuery = graphql`
  query EditionBySlug($slug: String!) {
    contentfulEdition(slug: { eq: $slug }) {
      title
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
      embedCode{
        childMarkdownRemark {
          html
        }
      }
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
      editionImpressionsSlideshow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
    }
  }
`

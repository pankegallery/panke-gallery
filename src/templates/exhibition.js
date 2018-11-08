import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'

class ExhibitionTemplate extends React.Component {
  render() {
    const exhibition = get(this.props, 'data.contentfulExhibition')

    console.log(exhibition);

    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    console.log(siteTitle);

    console.log('Slides: ' + exhibition.exhibitionImpressionsSlideshow.length)

    if (exhibition.exhibitionImpressionsSlideshow.length > 0){
      var ImageOrSlides =(
        <Slideshow slides={exhibition.exhibitionImpressionsSlideshow} length={exhibition.exhibitionImpressionsSlideshow.length} />
      )
    }
    else{
      var ImageOrSlides =(
        <Img alt="FeaturedImage" sizes={{...exhibition.featuredImage.sizes , aspectRatio: 16/9}} />
      )
    }

    return (
      <main>
        <Helmet title={`${exhibition.title} | ${siteTitle}`} />
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

        {exhibition.furtherInformationBlocks.map(({id, title, childContentfulContentBlockContentTextNode }) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockContentTextNode} />
          )
        })}

        {/* ---- DOKUMENTATION IMAGES ---- */}
        <section className="further">
          <div className="col-md-12 col-sm-8 col-xs-12">
            <div className="image-wrapper 3col">
                <img src="../../img/netzkunst/Overview/Manzano,Alexia_7225_WEB.jpg" alt="Zentrum der Netzkunst" width="" height="" />
                    <p>Exhibition Overview</p>
            </div>
            <div className="image-wrapper 3col">
                <img src="../../img/netzkunst/Overview/Manzano,Alexia_7236_WEB.jpg" alt="Zentrum der Netzkunst" width="" height="" />
                    <p>Exhibition Overview </p>
            </div>
             <div className="image-wrapper 3col">
                <img src="../../img/netzkunst/Overview/Manzano,Alexia_7248_WEB.jpg" alt="Zentrum der Netzkunst" width="" height="" />
                    <p>Exhibition Overview </p>
            </div>
            <p>Documention - Fotos by Manzano, Alexia - </p>
          </div>
        </section>
      </main>
    )
  }
}

export default ExhibitionTemplate

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
        title
        childContentfulContentBlockContentTextNode {
          childMarkdownRemark{
            html
          }
        }
        id
      }
      exhibitionImpressionsSlideshow{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
        description
      }
      featuredImage{
        sizes(maxWidth: 1000) {
          ...GatsbyContentfulSizes
        }
      }
    }
  }
`

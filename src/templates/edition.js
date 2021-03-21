import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'
//import { loadStripe } from '@stripe/stripe-js'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'
import Slideshow from '../components/slideshow'
import Checkout from '../components/checkout'

//const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
//const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

//let stripePromise
//const getStripe = () => {
//  if (!this.state.stripePromise) {
//    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
//  }
//  return stripePromise
//}

class EditionTemplate extends React.Component {

//  state = {
//    stripePromise: undefined,
//  };
//
//  getStripe = () => {
//    let stripePromise
//    if (!this.state.stripePromise) {
//      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
//    }
//    this.setState({stripePromise: stripePromise});
////    console.log("stripePromise:", stripePromise)
//  }

  getChechoutStatus = () => {
    let url = typeof window !== 'undefined' ? window.location.href : '';
    let checkoutGet
    if (url.indexOf('checkout')){
      checkoutGet = url.substr(url.indexOf('=')+1);
    }

    console.log("=:", checkoutGet)

  }

//  componentDidMount = () => {
//    this.getStripe();
//  }

  render() {

    const checkout = this.getChechoutStatus()

    const edition = get(this.props, 'data.contentfulEdition')
    console.log(edition);

    // ––– Slideshow or featured images –––

    var ImageOrSlides;
    if (edition.editionImpressionsSlideshow != null){
      ImageOrSlides =(
        <Slideshow slides={edition.editionImpressionsSlideshow} length={edition.editionImpressionsSlideshow.length} />
      );
    }
    else{
      ImageOrSlides =(
        <Img alt="FeaturedImage" fluid={{...edition.featuredImage.fluid , aspectRatio: 16/9}} />
      );
    }


    // ––– Further Content Blocks –––

    var FurtherContentBlocks;
    if (edition.furtherInformationBlocks){
      FurtherContentBlocks =(
        edition.furtherInformationBlocks.map(({id, title, childContentfulContentBlockBlockContentTextNode}) => {
          return (
              <ContentBlock key={id} blockTitle={title} blockContent={childContentfulContentBlockBlockContentTextNode} />
          )
        })
      );
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
      <main>
        <Helmet title={`${edition.title}`} />
        <section className="head">
          <div className="row headline">
            <div className="col-md-12 col-sm-12 col-xs-12">

              <h1>{edition.title}</h1>
              <div className="subtitle" dangerouslySetInnerHTML={{
                  __html: edition.subtitleShortDescription.childMarkdownRemark.html
                }} />

              {/*  ---- FEATURED IMAGE ---- */}

              {ImageOrSlides}

            </div>
          </div>
        </section>

        {/*  ---- ABOUT ---- */}

        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
              <h2>About the edition</h2>
              <Checkout />
            </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              <div dangerouslySetInnerHTML={{
                __html: edition.description.childMarkdownRemark.html
              }} />
            </div>
          </div>
        </section>

        {/*  ---- ADDITIONAL BLOCKS (each a section) ---- */}

        {FurtherContentBlocks}

      </main>
      </Layout>
    )
  }
}

export default EditionTemplate;



//==========================================================================

//                                QUERY

//==========================================================================


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
        fluid(maxWidth: 1000) {
          sizes
          src
        }
      }
      editionImpressionsSlideshow{
        fluid(maxWidth: 1000) {
          sizes
          src
        }
        description
      }
    }
  }
`

import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import PrintSheet from '../components/print-sheet'

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'general'

class PrintSheetExhibitionPage extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')
    const exhibitionSlug = get(this.props, 'pageContext.exhibitionSlug')
    const stops = get(this.props, 'data.allAudioguideStop.edges', [])

    const exhibitionName = exhibition
      ? exhibition.title
      : exhibitionSlug === UNASSIGNED_EXHIBITION_SLUG
        ? 'Other stops'
        : exhibitionSlug

    const title = `Audioguide — Print Sheet — ${exhibitionName}`

    return (
      <Layout>
        <Helmet title={title} />

        <PrintSheet title={title} stops={stops} />
      </Layout>
    );
  }
}

export default PrintSheetExhibitionPage;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PrintSheetExhibitionQuery($exhibitionSlug: String!, $exhibitionSlugValues: [String]) {
    contentfulExhibition(slug: { eq: $exhibitionSlug }) {
      title
    }
    allAudioguideStop(
      filter: { exhibitionSlug: { in: $exhibitionSlugValues } }
      sort: { referenceNumber: ASC }
    ) {
      edges {
        node {
          referenceNumber
          exhibitionSlug
          artworkName
          qrCodeSvg
        }
      }
    }
  }
`

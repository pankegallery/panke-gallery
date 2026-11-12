import React from 'react'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import PrintLayout, { PrintHead } from '../components/print-layout'
import PrintSheet from '../components/print-sheet'
import { dedupeStopsByPosition } from '../utils/dedupe-stops-by-position'

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'stop'

const TITLE = 'Audioguide — Print Sheet'

class PrintSheetExhibitionPage extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')
    const exhibitionSlug = get(this.props, 'pageContext.exhibitionSlug')
    // A position with multiple language-variant rows shares one QR code —
    // only one entry should be printed for it.
    const stops = dedupeStopsByPosition(get(this.props, 'data.allAudioguideStop.edges', []))
    const unassignedOverviewQrCodeSvg = get(this.props, 'data.audioguideUnassignedOverviewQrCodeSvg')

    const exhibitionName = exhibition
      ? exhibition.title
      : exhibitionSlug === UNASSIGNED_EXHIBITION_SLUG
        ? 'Other stops'
        : exhibitionSlug

    const overviewQrCodeSvg = exhibition
      ? exhibition.audioguideOverviewQrCodeSvg
      : unassignedOverviewQrCodeSvg

    const sections = [
      {
        key: exhibitionSlug,
        title: exhibitionName,
        overviewQrCodeSvg,
        stops,
      },
    ]

    return (
      <PrintLayout>
        <PrintSheet pageTitle={TITLE} sections={sections} />
      </PrintLayout>
    );
  }
}

export const Head = () => <PrintHead title={TITLE} />

export default PrintSheetExhibitionPage;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PrintSheetExhibitionQuery($exhibitionSlug: String!, $exhibitionSlugValues: [String]) {
    contentfulExhibition(slug: { eq: $exhibitionSlug }) {
      title
      audioguideOverviewQrCodeSvg
    }
    audioguideUnassignedOverviewQrCodeSvg
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

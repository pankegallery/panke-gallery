import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import PrintLayout from '../components/print-layout'
import PrintSheet from '../components/print-sheet'

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'general'

class PrintSheetPage extends React.Component {
  render() {

    const stops = get(this.props, 'data.allAudioguideStop.edges', [])
    const exhibitions = get(this.props, 'data.allContentfulExhibition.edges', []).map(({ node }) => node)
    const unassignedOverviewQrCodeSvg = get(this.props, 'data.audioguideUnassignedOverviewQrCodeSvg')

    const stopsBySlug = new Map()
    stops.forEach(edge => {
      const slug = edge.node.exhibitionSlug || UNASSIGNED_EXHIBITION_SLUG
      if (!stopsBySlug.has(slug)) stopsBySlug.set(slug, [])
      stopsBySlug.get(slug).push(edge)
    })

    const sections = exhibitions
      .filter(exhibition => stopsBySlug.has(exhibition.slug))
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(exhibition => ({
        key: exhibition.slug,
        title: exhibition.title,
        overviewQrCodeSvg: exhibition.audioguideOverviewQrCodeSvg,
        stops: stopsBySlug.get(exhibition.slug),
      }))

    if (stopsBySlug.has(UNASSIGNED_EXHIBITION_SLUG)) {
      sections.push({
        key: UNASSIGNED_EXHIBITION_SLUG,
        title: 'Other stops',
        overviewQrCodeSvg: unassignedOverviewQrCodeSvg,
        stops: stopsBySlug.get(UNASSIGNED_EXHIBITION_SLUG),
      })
    }

    const title = 'Audioguide — Print Sheet — All'

    return (
      <PrintLayout>
        <Helmet title={title} />

        <PrintSheet pageTitle={title} sections={sections} />
      </PrintLayout>
    );
  }
}

export default PrintSheetPage;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PrintSheetQuery {
    allAudioguideStop(sort: { referenceNumber: ASC }) {
      edges {
        node {
          referenceNumber
          exhibitionSlug
          artworkName
          qrCodeSvg
        }
      }
    }
    allContentfulExhibition {
      edges {
        node {
          slug
          title
          audioguideOverviewQrCodeSvg
        }
      }
    }
    audioguideUnassignedOverviewQrCodeSvg
  }
`

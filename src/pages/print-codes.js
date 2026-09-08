import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Layout from "../components/layout"
import PrintSheet from '../components/print-sheet'

class PrintSheetPage extends React.Component {
  render() {

    const stops = get(this.props, 'data.allAudioguideStop.edges', [])
    const title = 'Audioguide — Print Sheet — All'

    return (
      <Layout>
        <Helmet title={title} />

        <PrintSheet title={title} stops={stops} />
      </Layout>
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
  }
`

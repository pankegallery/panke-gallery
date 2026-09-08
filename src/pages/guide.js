import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'

class GuideOverview extends React.Component {
  render() {

    const stops = get(this.props, 'data.allAudioguideStop.edges', [])

    return (
      <GuideLayout showOverviewLink={false}>
        <Helmet title="Audioguide — Overview" />

        <GuideStopList stops={stops} />
      </GuideLayout>
    );
  }
}

export default GuideOverview;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query AudioguideOverviewQuery {
    allAudioguideStop(sort: { referenceNumber: ASC }) {
      edges {
        node {
          referenceNumber
          exhibitionSlug
          artworkName
          artist
        }
      }
    }
  }
`

import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Moment from 'moment'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'
import { HeadSection, Meta } from '../components/content/Content.styles'

const Overview = styled.section`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1.25em;
`

class GuideExhibitionOverview extends React.Component {
  render() {

    const exhibition = get(this.props, 'data.contentfulExhibition')
    const exhibitionSlug = get(this.props, 'pageContext.exhibitionSlug')
    const stops = get(this.props, 'data.allAudioguideStop.edges', [])

    let dateDisplayed
    if (exhibition) {
      dateDisplayed = exhibition.dateTbc
        ? 'Date to be confirmed'
        : Moment(exhibition.startDate).format('DD MMMM') + ' – ' + Moment(exhibition.endDate).format('DD MMMM YYYY')
    }

    return (
      <GuideLayout>
        <Helmet title={exhibition ? `${exhibition.title} — Audioguide` : 'Audioguide'} />

        <Overview>
          <HeadSection>
            <h1>{exhibition ? exhibition.title : exhibitionSlug}</h1>
            {exhibition && <Meta>{dateDisplayed}</Meta>}
          </HeadSection>
        </Overview>

        <GuideStopList stops={stops} />
      </GuideLayout>
    )
  }
}

export default GuideExhibitionOverview;


//==========================================================================

//                                QUERY

//==========================================================================

export const pageQuery = graphql`
  query AudioguideExhibitionOverview($exhibitionSlug: String!) {
    contentfulExhibition(slug: { eq: $exhibitionSlug }) {
      title
      startDate
      endDate
      dateTbc
    }
    allAudioguideStop(
      filter: { exhibitionSlug: { eq: $exhibitionSlug } }
      sort: { referenceNumber: ASC }
    ) {
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

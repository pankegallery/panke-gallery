import React, { useState, useEffect } from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import Moment from 'moment'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'
import { HeaderTitle } from '../components/guide-layout/GuideLayout.styles'
import { getStoredLanguage } from '../utils/audioguide-language'

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'stop'

const GuideExhibitionOverview = props => {
  const exhibition = get(props, 'data.contentfulExhibition')
  const exhibitionSlug = get(props, 'pageContext.exhibitionSlug')
  const rawStops = get(props, 'data.allAudioguideStop.edges', [])

  // A position can have more than one row (language variants sharing the
  // same reference number/page, e.g. different artwork names per language in
  // the test data) — show each position once, preferring the row matching
  // the visitor's already-chosen language, so the name/link shown here
  // matches what they'll actually see on the stop page.
  const [preferredLanguage, setPreferredLanguage] = useState(null)
  useEffect(() => {
    setPreferredLanguage(getStoredLanguage())
  }, [])

  const stopsByPosition = new Map()
  rawStops.forEach(edge => {
    const key = `${edge.node.exhibitionSlug}/${edge.node.referenceNumber}`
    if (!stopsByPosition.has(key)) stopsByPosition.set(key, [])
    stopsByPosition.get(key).push(edge)
  })

  const stops = Array.from(stopsByPosition.values()).map(group =>
    group.length === 1
      ? group[0]
      : group.find(edge => edge.node.language === preferredLanguage) || group[0]
  )

  const heading = exhibition
    ? exhibition.title
    : exhibitionSlug === UNASSIGNED_EXHIBITION_SLUG
      ? 'panke.gallery'
      : exhibitionSlug

  let dateDisplayed
  if (exhibition) {
    dateDisplayed = exhibition.dateTbc
      ? 'Date to be confirmed'
      : Moment(exhibition.startDate).format('DD/MM') + ' – ' + Moment(exhibition.endDate).format('DD/MM/YYYY')
  }

  return (
    <GuideLayout
      showOverviewLink={false}
      headerAction={
        <HeaderTitle>
          <strong>{heading}</strong>
          {dateDisplayed && <span className="date">{dateDisplayed}</span>}
        </HeaderTitle>
      }
    >
      <Helmet title={`${heading} — Audioguide`} />
       


      <GuideStopList stops={stops} />
    </GuideLayout>
  )
}

export default GuideExhibitionOverview;


//==========================================================================

//                                QUERY

//==========================================================================

export const pageQuery = graphql`
  query AudioguideExhibitionOverview($exhibitionSlug: String!, $exhibitionSlugValues: [String]) {
    contentfulExhibition(slug: { eq: $exhibitionSlug }) {
      title
      startDate
      endDate
      dateTbc
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
          artist
          language
        }
      }
    }
  }
`

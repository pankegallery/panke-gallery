import React, { useState, useEffect, useMemo } from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Moment from 'moment'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'
import LanguagePicker from '../components/language-picker'
import LanguageLabel from '../components/language-label'
import { HeadSection, Meta } from '../components/content/Content.styles'
import { getStoredLanguage, setStoredLanguage } from '../utils/audioguide-language'

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'stop'

const Overview = styled.section`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1.25em;
`

const GuideExhibitionOverview = props => {
  const exhibition = get(props, 'data.contentfulExhibition')
  const exhibitionSlug = get(props, 'pageContext.exhibitionSlug')
  const stops = get(props, 'data.allAudioguideStop.edges', [])

  // Stops with no language set are treated as language-agnostic and always
  // shown, regardless of which language is picked.
  const languages = useMemo(
    () => Array.from(new Set(stops.map(({ node }) => node.language).filter(Boolean))).sort(),
    [stops]
  )
  const needsLanguagePicker = languages.length > 1

  const [language, setLanguage] = useState(null)
  const [checkedStorage, setCheckedStorage] = useState(false)

  useEffect(() => {
    const stored = getStoredLanguage()
    if (stored && languages.includes(stored)) setLanguage(stored)
    setCheckedStorage(true)
    // Only re-check on mount — languages is derived from the page's own
    // (static) data and won't meaningfully change after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chooseLanguage = selected => {
    setStoredLanguage(selected)
    setLanguage(selected)
  }

  const visibleStops = needsLanguagePicker
    ? stops.filter(({ node }) => !node.language || node.language === language)
    : stops

  const heading = exhibition
    ? exhibition.title
    : exhibitionSlug === UNASSIGNED_EXHIBITION_SLUG
      ? 'Other stops'
      : exhibitionSlug

  let dateDisplayed
  if (exhibition) {
    dateDisplayed = exhibition.dateTbc
      ? 'Date to be confirmed'
      : Moment(exhibition.startDate).format('DD MMMM') + ' – ' + Moment(exhibition.endDate).format('DD MMMM YYYY')
  }

  // Gate both the picker and the list behind checkedStorage so a returning
  // visitor with a remembered language doesn't see the picker flash before
  // localStorage is read (client-only — there's nothing to check at build time).
  const showPicker = needsLanguagePicker && checkedStorage && !language
  const showStops = !needsLanguagePicker || (checkedStorage && language)

  return (
    <GuideLayout
      showOverviewLink={false}
      headerAction={
        needsLanguagePicker && showStops ? (
          <LanguageLabel language={language} onClick={() => setLanguage(null)} />
        ) : null
      }
    >
      <Helmet title={`${heading} — Audioguide`} />

      <Overview>
        <HeadSection>
          <h1>{heading}</h1>
          {exhibition && <Meta>{dateDisplayed}</Meta>}
        </HeadSection>
      </Overview>

      {showPicker && <LanguagePicker languages={languages} onSelect={chooseLanguage} />}

      {showStops && <GuideStopList stops={visibleStops} />}
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

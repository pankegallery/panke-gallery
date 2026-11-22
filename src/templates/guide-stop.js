import React, { useState, useEffect, useMemo } from 'react'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import GuideLayout, { GuideHead } from '../components/guide-layout'
import AudioPlayer from '../components/audio-player'
import LanguagePicker from '../components/language-picker'
import { HeadSection, Meta } from '../components/content/Content.styles'
import { HeaderTitle } from '../components/guide-layout/GuideLayout.styles'
import { getStoredLanguage, setStoredLanguage } from '../utils/audioguide-language'
import { linkify } from '../utils/linkify'

const Overview = styled.section`
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1.25em;
`

const ArtworkImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
  margin: 1.5em 0;
`

const StopNumber = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4em;
  height: 2.4em;
  margin: 1.5em 0 0.8em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 50%;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const stopTitle = row => `${row.artworkName} — Audioguide`

// The languages a position offers. More than one means the visitor picks one.
const languagesOf = rows =>
  Array.from(new Set(rows.map(row => row.language).filter(Boolean))).sort()

// Which row to actually show: the one matching the chosen language, or —
// if this position mixes a language-agnostic row in with variants (e.g. a
// silent/visual-only piece) — that row as a fallback.
const rowForLanguage = (rows, language) =>
  rows.find(row => row.language === language) || rows.find(row => !row.language)

const GuideStopTemplate = props => {
  const exhibitionSlug = get(props, 'pageContext.exhibitionSlug')
  const exhibitionTitle = get(props, 'pageContext.exhibitionTitle')
  // A wall position can be more than one row — language variants of the same
  // artwork, sharing this same reference number, page, and QR code. Which
  // row is shown (name, description, audio, transcript — all of it) depends
  // on the chosen language, resolved here before anything renders.
  const rows = get(props, 'data.allAudioguideStop.edges', []).map(({ node }) => node)

  const languages = useMemo(() => languagesOf(rows), [rows])
  const needsLanguagePicker = languages.length > 1

  const [language, setLanguage] = useState(null)
  const [checkedStorage, setCheckedStorage] = useState(false)
  // Separate from `language` itself so re-opening the picker (via the
  // player's "change language" control) doesn't lose track of the previous
  // choice — LanguagePicker highlights it as already-selected instead of
  // presenting a blank set of options again.
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    if (needsLanguagePicker) {
      const stored = getStoredLanguage()
      if (stored && languages.includes(stored)) setLanguage(stored)
    }
    setCheckedStorage(true)
    // Only re-check on mount — languages is derived from this page's own
    // (static) data and won't meaningfully change after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chooseLanguage = selected => {
    setStoredLanguage(selected)
    setLanguage(selected)
    setPickerOpen(false)
  }

  const activeRow = needsLanguagePicker ? rowForLanguage(rows, language) : rows[0]

  const showPicker = needsLanguagePicker && checkedStorage && (!language || pickerOpen)
  const showStop = !needsLanguagePicker || (checkedStorage && language && !pickerOpen)

  // `Head` only renders on navigation, so a language picked on this page
  // sets the title here.
  useEffect(() => {
    if (needsLanguagePicker && showStop && activeRow) document.title = stopTitle(activeRow)
  }, [needsLanguagePicker, showStop, activeRow])

  if (rows.length === 0) return null

  const headerAction = (
    <HeaderTitle>
      <strong>{exhibitionTitle}</strong>
    </HeaderTitle>
  )

  if (showPicker) {
    return (
      <GuideLayout overviewHref={`/guide/${exhibitionSlug}/`} headerAction={headerAction}>
        <LanguagePicker languages={languages} selectedLanguage={language} onSelect={chooseLanguage} />
      </GuideLayout>
    )
  }

  if (!showStop || !activeRow) return null

  return (
    <GuideLayout overviewHref={`/guide/${exhibitionSlug}/`} headerAction={headerAction}>
      <Overview>
        <HeadSection>
          <StopNumber>{activeRow.referenceNumber}</StopNumber>
          <h1>{activeRow.artworkName}</h1>
          {activeRow.artist && <Meta>{activeRow.artist}</Meta>}
        </HeadSection>

        {activeRow.artworkImage && (
          <ArtworkImage src={activeRow.artworkImage} alt={activeRow.artworkName} />
        )}

        <p style={{ whiteSpace: 'pre-wrap' }}>{linkify(activeRow.description)}</p>
      </Overview>

      <AudioPlayer
        audioUrl={activeRow.audioUrl}
        transcript={activeRow.transcript}
        title={activeRow.artworkName}
        artist={activeRow.artist}
        referenceNumber={activeRow.referenceNumber}
        language={needsLanguagePicker ? language : null}
        onChangeLanguage={needsLanguagePicker ? () => setPickerOpen(true) : undefined}
      />
    </GuideLayout>
  )
}

// Language variants can name the artwork differently. The static HTML can't
// know the visitor's language and shows the language picker, so it names the
// exhibition. `Head` isn't hydrated, so in the browser it can read the stored
// language straight away and name the artwork in that language.
export const Head = ({ data, pageContext }) => {
  const rows = data.allAudioguideStop.edges.map(({ node }) => node)
  const languages = languagesOf(rows)
  const stored = languages.length > 1 ? getStoredLanguage() : null
  const row = languages.length > 1
    ? languages.includes(stored) && rowForLanguage(rows, stored)
    : rows[0]

  return <GuideHead title={row ? stopTitle(row) : `${pageContext.exhibitionTitle} — Audioguide`} />
}

export default GuideStopTemplate;


//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query AudioguideStopByReference($rawExhibitionSlug: String!, $referenceNumber: String!) {
    allAudioguideStop(
      filter: {
        exhibitionSlug: { eq: $rawExhibitionSlug }
        referenceNumber: { eq: $referenceNumber }
      }
    ) {
      edges {
        node {
          referenceNumber
          artworkName
          artist
          description
          audioUrl
          transcript
          artworkImage
          language
        }
      }
    }
  }
`

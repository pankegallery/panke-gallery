import React, { useState, useEffect, useMemo } from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import GuideLayout from '../components/guide-layout'
import AudioPlayer from '../components/audio-player'
import LanguagePicker from '../components/language-picker'
import LanguageLabel from '../components/language-label'
import { HeadSection, Meta } from '../components/content/Content.styles'
import { getStoredLanguage, setStoredLanguage } from '../utils/audioguide-language'

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

const GuideStopTemplate = props => {
  const exhibitionSlug = get(props, 'pageContext.exhibitionSlug')
  // A wall position can be more than one row — language variants of the same
  // artwork, sharing this same reference number, page, and QR code. A QR scan
  // always lands here directly (it's the only entry point some visitors use),
  // so the language choice has to be made on this page too, not just from
  // the exhibition overview.
  const rows = get(props, 'data.allAudioguideStop.edges', []).map(({ node }) => node)

  const languages = useMemo(
    () => Array.from(new Set(rows.map(row => row.language).filter(Boolean))).sort(),
    [rows]
  )
  const needsLanguagePicker = languages.length > 1

  const [language, setLanguage] = useState(null)
  const [checkedStorage, setCheckedStorage] = useState(false)

  useEffect(() => {
    if (needsLanguagePicker) {
      const stored = getStoredLanguage()
      if (stored && languages.includes(stored)) setLanguage(stored)
    }
    setCheckedStorage(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chooseLanguage = selected => {
    setStoredLanguage(selected)
    setLanguage(selected)
  }

  // Which row to actually render: the one matching the chosen language, or —
  // if this position mixes a language-agnostic row in with language variants
  // (e.g. a silent/visual-only piece) — that row as a fallback.
  const stop = needsLanguagePicker
    ? rows.find(row => row.language === language) || rows.find(row => !row.language)
    : rows[0]

  const showPicker = needsLanguagePicker && checkedStorage && !language
  const showStop = !needsLanguagePicker || (checkedStorage && language)

  if (showPicker) {
    return (
      <GuideLayout overviewHref={`/guide/${exhibitionSlug}/`}>
        <LanguagePicker languages={languages} onSelect={chooseLanguage} />
      </GuideLayout>
    )
  }

  if (!showStop || !stop) return null

  return (
    <GuideLayout
      overviewHref={`/guide/${exhibitionSlug}/`}
      headerAction={
        needsLanguagePicker ? (
          <LanguageLabel language={language} onClick={() => setLanguage(null)} />
        ) : null
      }
    >
      <Helmet title={`${stop.artworkName} — Audioguide`} />

      <Overview>
        <HeadSection>
          <StopNumber>{stop.referenceNumber}</StopNumber>
          <h1>{stop.artworkName}</h1>
          {stop.artist && <Meta>{stop.artist}</Meta>}
        </HeadSection>

        {stop.artworkImage && (
          <ArtworkImage src={stop.artworkImage} alt={stop.artworkName} />
        )}

        <p style={{ whiteSpace: 'pre-wrap' }}>{stop.description}</p>
      </Overview>

      <AudioPlayer
        audioUrl={stop.audioUrl}
        title={stop.artworkName}
        artist={stop.artist}
        transcript={stop.transcript}
        referenceNumber={stop.referenceNumber}
      />
    </GuideLayout>
  )
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

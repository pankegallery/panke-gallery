import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled from 'styled-components'

import GuideLayout from '../components/guide-layout'
import AudioPlayer from '../components/audio-player'
import { HeadSection, Meta } from '../components/content/Content.styles'

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

class GuideStopTemplate extends React.Component {
  render() {

    const stop = get(this.props, 'data.audioguideStop')

    return (
      <GuideLayout>
        <Helmet title={`${stop.artworkName} — Audioguide`} />

        <Overview>
          <HeadSection>
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
        />
      </GuideLayout>
    )
  }
}

export default GuideStopTemplate;


//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query AudioguideStopByReferenceNumber($referenceNumber: String!) {
    audioguideStop(referenceNumber: { eq: $referenceNumber }) {
      referenceNumber
      artworkName
      artist
      description
      audioUrl
      transcript
      artworkImage
    }
  }
`

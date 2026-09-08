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

class GuideStopTemplate extends React.Component {
  render() {

    const stop = get(this.props, 'data.audioguideStop')
    const exhibitionSlug = get(this.props, 'pageContext.exhibitionSlug')

    return (
      <GuideLayout overviewHref={`/guide/${exhibitionSlug}/`}>
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
}

export default GuideStopTemplate;


//==========================================================================

//                                QUERY

//==========================================================================


export const pageQuery = graphql`
  query AudioguideStopByReference($rawExhibitionSlug: String!, $referenceNumber: String!) {
    audioguideStop(
      exhibitionSlug: { eq: $rawExhibitionSlug }
      referenceNumber: { eq: $referenceNumber }
    ) {
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

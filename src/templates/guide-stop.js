import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import { HeadSection, Meta, InfoSection } from '../components/content/Content.styles'
import { Row, Col } from '../components/layout/Layout.styles'

class GuideStopTemplate extends React.Component {
  render() {

    const stop = get(this.props, 'data.audioguideStop')

    var TranscriptSection;
    if (stop.transcript) {
      TranscriptSection = (
        <InfoSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>Transcript</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{stop.transcript}</p>
            </Col>
          </Row>
        </InfoSection>
      );
    }

    //==========================================================================

    //                                OUTPUT

    //==========================================================================

    return (
      <Layout>
      <main>
        <Helmet title={`${stop.artworkName} — Audioguide`} />
        <HeadSection>

          <h1>{stop.artworkName}</h1>
          {stop.artist && <Meta>{stop.artist}</Meta>}

        </HeadSection>

        {/*  ---- ABOUT ---- */}

        <InfoSection>
          <Row>
            <Col $md={4} $sm={4} $xs={12}>
              <h2>About the work</h2>
            </Col>
            <Col $md={8} $sm={8} $xs={12}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{stop.description}</p>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption -- spoken narration; the transcript below is the accessible text alternative */}
              <audio controls src={stop.audioUrl} style={{ width: '100%', marginTop: '1em' }} />
            </Col>
          </Row>
        </InfoSection>

        {/*  ---- TRANSCRIPT ---- */}

        {TranscriptSection}

      </main>
      </Layout>
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
    }
  }
`

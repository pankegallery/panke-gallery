import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'
import Moment from 'moment'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'
import LanguageLabel from '../components/language-label'
import { List } from '../components/guide-stop-list/GuideStopList.styles'
import { getStoredLanguage } from '../utils/audioguide-language'

const SectionHeading = styled.h2`
  padding: 1.5em 1.25em 0.5em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const ExhibitionItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    display: block;
    margin: 0 -1.25em;
    padding: 1.1em 1.25em;
    transition: background-color 0.15s ease;

    @media (hover: hover) {
      &:hover {
        background: ${props => props.theme.colors.theme.lightgrey};
      }
    }

    &:active {
      background: ${props => props.theme.colors.theme.lightgrey};
    }
  }

  strong {
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  small {
    display: block;
    color: ${props => props.theme.colors.theme.grey};
  }
`

const formatDates = exhibition =>
  exhibition.dateTbc
    ? 'Date to be confirmed'
    : Moment(exhibition.startDate).format('DD MMMM') + ' – ' + Moment(exhibition.endDate).format('DD MMMM YYYY')

const GuideOverview = props => {
  const stops = get(props, 'data.allAudioguideStop.edges', [])
  const exhibitions = get(props, 'data.allContentfulExhibition.edges', []).map(({ node }) => node)

  // Only list exhibitions that actually have a guide stop, and only file a
  // stop under "Other stops" if it truly has no exhibitionSlug.
  const exhibitionSlugsWithStops = new Set(
    stops.map(({ node }) => node.exhibitionSlug).filter(Boolean)
  )
  const exhibitionsWithStops = exhibitions.filter(exhibition =>
    exhibitionSlugsWithStops.has(exhibition.slug)
  )
  const unassignedStops = stops.filter(({ node }) => !node.exhibitionSlug)

  // Read-only here — this page spans every exhibition, each with its own
  // (possibly different) language list, so there's no single picker to
  // re-open from this level. Changing language happens from within a
  // specific exhibition's own overview page.
  const [language, setLanguage] = useState(null)
  useEffect(() => {
    setLanguage(getStoredLanguage())
  }, [])

  return (
    <GuideLayout showOverviewLink={false} headerAction={<LanguageLabel language={language} />}>
      <Helmet title="Audioguide — Overview" />

      {exhibitionsWithStops.length > 0 && (
        <>
          <SectionHeading>Exhibitions</SectionHeading>
          <List>
            {exhibitionsWithStops.map(exhibition => (
              <ExhibitionItem key={exhibition.slug}>
                <Link to={`/guide/${exhibition.slug}/`}>
                  <strong>{exhibition.title}</strong>
                  <small>{formatDates(exhibition)}</small>
                </Link>
              </ExhibitionItem>
            ))}
          </List>
        </>
      )}

      {unassignedStops.length > 0 && (
        <>
          <SectionHeading>Other stops</SectionHeading>
          <GuideStopList stops={unassignedStops} />
        </>
      )}
    </GuideLayout>
  );
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
    allContentfulExhibition {
      edges {
        node {
          slug
          title
          startDate
          endDate
          dateTbc
        }
      }
    }
  }
`

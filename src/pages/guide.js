import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'
import Moment from 'moment'

import GuideLayout from '../components/guide-layout'
import GuideStopList from '../components/guide-stop-list'
import { List } from '../components/guide-stop-list/GuideStopList.styles'
import { HeaderTitle } from '../components/guide-layout/GuideLayout.styles'
import { getStoredLanguage } from '../utils/audioguide-language'

const SectionHeading = styled.h2`
  padding: 1.5em 1.25em 0.5em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
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
  // A position can have more than one row (language variants sharing the
  // same reference number/page) — show each position once, preferring the
  // row matching the visitor's already-chosen language.
  const [preferredLanguage, setPreferredLanguage] = useState(null)
  useEffect(() => {
    setPreferredLanguage(getStoredLanguage())
  }, [])

  const unassignedByPosition = new Map()
  stops.forEach(edge => {
    if (edge.node.exhibitionSlug) return
    const key = edge.node.referenceNumber
    if (!unassignedByPosition.has(key)) unassignedByPosition.set(key, [])
    unassignedByPosition.get(key).push(edge)
  })

  const unassignedStops = Array.from(unassignedByPosition.values()).map(group =>
    group.length === 1
      ? group[0]
      : group.find(edge => edge.node.language === preferredLanguage) || group[0]
  )

  return (
    <GuideLayout 
      showOverviewLink={false}
      headerAction={
        <HeaderTitle>
          <strong>Overview of audio guide stops</strong>
        </HeaderTitle>
      }
    >
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
        allAudioguideStop(sort: {referenceNumber: ASC }) {
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

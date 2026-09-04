import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql, Link } from 'gatsby'
import styled from 'styled-components'

import GuideLayout from '../components/guide-layout'

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 1.25em;
`

const StopItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 1.1em 0;
  }
`

const Number = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2em;
  height: 2.2em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 50%;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
`

const Titles = styled.span`
  min-width: 0;

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

class GuideOverview extends React.Component {
  render() {

    const stops = get(this.props, 'data.allAudioguideStop.edges', [])

    return (
      <GuideLayout showOverviewLink={false}>
        <Helmet title="Audioguide — Overview" />

        <List>
          {stops.map(({ node }) => (
            <StopItem key={node.referenceNumber}>
              <Link to={`/guide/${node.referenceNumber}/`}>
                <Number>{node.referenceNumber}</Number>
                <Titles>
                  <strong>{node.artworkName}</strong>
                  {node.artist && <small>{node.artist}</small>}
                </Titles>
              </Link>
            </StopItem>
          ))}
        </List>
      </GuideLayout>
    );
  }
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
          artworkName
          artist
        }
      }
    }
  }
`

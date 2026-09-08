import React from 'react';
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { graphql } from 'gatsby'
import styled, { createGlobalStyle } from 'styled-components'

import Layout from "../components/layout"
import { Section, Headline } from '../components/content/Content.styles';

const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: A4;
      margin: 1.5cm;
    }

    header, footer, nav {
      display: none !important;
    }
  }
`;

const QrGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2em;
  margin: 2em 0;

  @media (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media print {
    grid-template-columns: repeat(3, 1fr);
    gap: 1cm;
  }
`;

const QrCard = styled.div`
  text-align: center;
  page-break-inside: avoid;

  svg {
    width: 100%;
    height: auto;
  }

  h3 {
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin: 0.5em 0 0.1em;
  }

  p {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.theme.grey};
    margin: 0;
  }
`;

class PrintSheet extends React.Component {
  render() {

    const stops = get(this.props, 'data.allAudioguideStop.edges', [])

    return (
      <Layout>
        <PrintStyles />
        <Helmet title="Audioguide — Print Sheet" />

        <Section>
          <Headline>
            <h1>Audioguide — Print Sheet</h1>
          </Headline>

          <QrGrid>
            {stops.map(({ node }) => (
              <QrCard key={`${node.exhibitionSlug}-${node.referenceNumber}`}>
                <div dangerouslySetInnerHTML={{ __html: node.qrCodeSvg }} />
                <h3>{node.referenceNumber}</h3>
                <p>{node.artworkName}</p>
                <p>{node.exhibitionSlug}</p>
              </QrCard>
            ))}
          </QrGrid>
        </Section>

      </Layout>
    );
  }
}

export default PrintSheet;


//=========================================================================

//                                QUERY

//=========================================================================

export const pageQuery = graphql`
  query PrintSheetQuery {
    allAudioguideStop(sort: { referenceNumber: ASC }) {
      edges {
        node {
          referenceNumber
          exhibitionSlug
          artworkName
          qrCodeSvg
        }
      }
    }
  }
`

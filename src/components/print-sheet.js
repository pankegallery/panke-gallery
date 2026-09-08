import React from 'react';

import { Section, Headline } from './content/Content.styles';
import { PrintStyles, QrGrid, QrCard } from './print-sheet/PrintSheet.styles';

const PrintSheet = ({ title, stops }) => (
  <>
    <PrintStyles />

    <Section>
      <Headline>
        <h1>{title}</h1>
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
  </>
);

export default PrintSheet;

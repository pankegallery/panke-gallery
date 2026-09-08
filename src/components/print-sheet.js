import React from 'react';

import { Section, Headline } from './content/Content.styles';
import { PrintStyles, PrintSection, QrGrid, QrCard } from './print-sheet/PrintSheet.styles';

// sections: [{ key, title, overviewQrCodeSvg, stops }] — one section per
// exhibition (plus the fallback bucket, if used). Each gets its own heading,
// an "entrance" QR for the exhibition's overview page (if available), then
// one QR per stop, followed by a page break before the next section.
const PrintSheet = ({ pageTitle, sections }) => (
  <>
    <PrintStyles />

    <Section>
      <Headline>
        <h1>{pageTitle}</h1>
      </Headline>
    </Section>

    {sections.map(section => (
      <PrintSection key={section.key}>
        <Headline>
          <h2>{section.title}</h2>
        </Headline>

        <QrGrid>
          {section.overviewQrCodeSvg && (
            <QrCard>
              <div dangerouslySetInnerHTML={{ __html: section.overviewQrCodeSvg }} />
              <h3>Audioguide overview</h3>
            </QrCard>
          )}

          {section.stops.map(({ node }) => (
            <QrCard key={node.referenceNumber}>
              <div dangerouslySetInnerHTML={{ __html: node.qrCodeSvg }} />
              <h3>{node.referenceNumber}</h3>
              <p>{node.artworkName}</p>
            </QrCard>
          ))}
        </QrGrid>
      </PrintSection>
    ))}
  </>
);

export default PrintSheet;

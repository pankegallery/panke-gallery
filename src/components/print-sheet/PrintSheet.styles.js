import styled, { createGlobalStyle } from 'styled-components';

export const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      size: A4;
      margin: 1.5cm;
    }
    
  }

  body{
    padding: 2vw;
    width: calc(100% - 4vw);
  }

`;

export const PrintSection = styled.section`
  & + & {
    page-break-before: always;
  }
`;

export const QrGrid = styled.div`
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

export const QrCard = styled.div`
  text-align: center;
  page-break-inside: avoid;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }

  h3 {
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin: 2.2em 0 2em;
  }

  p {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.theme.grey};
    margin: 2em 0 2em;
  }
`;

// Wraps a per-stop QR code so its reference-number badge can be centered on
// top of it — the number+code pairing is what's actually stable long-term
// (an artwork name can change last minute; the printed physical code can't),
// so it belongs read together, not as separate text below the code.
export const QrWrapper = styled.div`
  position: relative;
`;

// Sized as a fraction of the QR code itself (not a fixed size) so it scales
// with it across the different grid column counts (2/4/3 — mobile/tablet/
// print). Kept well under the ~30% of the code that errorCorrectionLevel
// 'H' can tolerate losing, so it stays reliably scannable.
export const QrNumberBadge = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.theme.colors.theme.white};
  border: 1px solid ${props => props.theme.colors.theme.black};
  font-size: 30px;
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.theme.black};
`;

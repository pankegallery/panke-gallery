import styled, { createGlobalStyle } from 'styled-components';

export const PrintStyles = createGlobalStyle`
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

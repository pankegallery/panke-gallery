import styled from 'styled-components';

// Fills the ResponsiveVideo frame, so the page layout doesn't jump when the
// iframe replaces the placeholder.
export const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  padding: ${props => props.theme.spacing.inner};
  text-align: center;
  background-color: ${props => props.theme.colors.theme.lightgrey};

  p {
    margin: 0;
  }
`;

export const Notice = styled.p`
  font-size: ${props => props.theme.fontSizes.small};
`;

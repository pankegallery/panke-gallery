import styled from 'styled-components';

export const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75em;
  padding: 2em 1.25em;
`;

export const LanguageButton = styled.button`
  padding: 0.6em 1.4em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: none;
  color: ${props => props.theme.colors.theme.black};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
`;

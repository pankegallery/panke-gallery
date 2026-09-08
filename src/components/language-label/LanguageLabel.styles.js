import styled from 'styled-components';

const shared = `
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em 1.1em;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  svg {
    font-size: 1em;
  }
`;

export const LanguageLabelButton = styled.button`
  ${shared}
  border: 1px solid ${props => props.theme.colors.theme.black};
  background: none;
  color: ${props => props.theme.colors.theme.black};
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      background: ${props => props.theme.colors.theme.lightgrey};
    }
  }

  &:active {
    background: ${props => props.theme.colors.theme.lightgrey};
  }
`;

export const LanguageLabelText = styled.span`
  ${shared}
  border: 1px solid ${props => props.theme.colors.theme.lightgrey};
  color: ${props => props.theme.colors.theme.grey};
  font-size: ${props => props.theme.fontSizes.small};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

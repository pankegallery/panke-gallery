import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    line-height: ${props => props.theme.lineHeight.base};
  }

  html,
  body {
    height: 100%;
    width: 100%;
    background-color: ${props => props.theme.colors.theme.white};
    color: ${props => props.theme.colors.theme.black};
    text-align: left;
    font-family: ${props => props.theme.fonts.main};
    font-size: ${props => props.theme.fontSizes.base};
    font-weight: ${props => props.theme.fontWeights.light};
    padding: 0;
    margin: 0;
  }

  a,
  a:hover {
    color: ${props => props.theme.colors.theme.black};
    text-decoration: none;
  }

  a:focus:not(:focus-visible),
  button:focus:not(:focus-visible) {
    outline: none;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 2px solid ${props => props.theme.colors.theme.black};
    outline-offset: 2px;
  }

  h1, .h1, h2, .h2, h3, .h3 {
    margin: 0;
    line-height: ${props => props.theme.lineHeight.headings};
  }

  h3 {
    font-weight: ${props => props.theme.fontWeights.medium};
    font-size: 1rem;
  }

  p{
    margin: 0 0 1em;
  }
    
  small, .small {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.theme.grey};
  }

  strong {
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  img:hover {
    -webkit-filter: none;
    filter: none;
  }
`;

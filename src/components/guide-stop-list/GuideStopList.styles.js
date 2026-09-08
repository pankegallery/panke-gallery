import styled from 'styled-components';

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 1.25em;
`

export const StopItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 1.1em 0;
  }
`

export const Number = styled.span`
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

export const Titles = styled.span`
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

import styled from 'styled-components';

export const StyledFooter = styled.footer`
  color: ${props => props.theme.colors.theme.grey};
  font-size: 0.7em;
  padding: 100px 0 30px;

  .social {
    a {
      color: ${props => props.theme.colors.theme.grey};
      font-size: 1.5em;
      margin-left: 10px;
      display: inline-block;

      &.facebook:hover {
        color: #2f4984;
      }

      &.twitter:hover {
        color: #339aea;
      }
    }
  }
`;

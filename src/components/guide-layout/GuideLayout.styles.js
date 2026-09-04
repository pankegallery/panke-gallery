import styled from 'styled-components';

export const GuideShell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
`;

export const GuideHeader = styled.header`
  flex: 0 0 auto;
  padding: 1em 1.25em;
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    text-decoration: none;
  }
`;

export const GuideMain = styled.main`
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(84px + env(safe-area-inset-bottom));
`;

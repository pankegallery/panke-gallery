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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75em;
  /* Fixed regardless of what's in the right-hand slot (nothing, the overview
     icon, or the language button) — without this the header's height "jumps"
     between pages depending on which one is taller. */
  min-height: 48px;
  padding: 1em 1.25em;
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    text-decoration: none;
  }
`;

// Always rendered on both sides (even empty) so `justify-content:
// space-between` keeps the language action pinned left and the overview
// icon pinned right regardless of which one (if either) is present.
export const HeaderSlot = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
`;

export const OverviewLink = styled.a`
  flex: 0 0 auto;
  padding: 0.4em;
  margin: -0.4em;
  border-radius: 50%;
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

export const DashboardIcon = styled.span`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3px;
  width: 1.1em;
  height: 1.1em;

  span {
    background: ${props => props.theme.colors.theme.black};
  }
`;

export const GuideMain = styled.main`
  flex: 1 1 auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(84px + env(safe-area-inset-bottom));
`;

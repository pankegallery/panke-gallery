import styled, { css } from 'styled-components';

// Shared typographic treatment for an artwork title, wherever it's shown
// (mini player bar, fullscreen player, stop lists) — kept as-authored casing
// rather than force-uppercased, unlike exhibition names/section headings
// elsewhere in the guide. Centralised here so changing it once (e.g. the
// casing/letter-spacing choice) doesn't require editing every place an
// artwork title is rendered.
export const artworkTitleStyle = css`
  letter-spacing: 0.02em;
  font-weight: ${props => props.theme.fontWeights.medium};
`;

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
  gap: 0.75em;
  /* Fixed regardless of what's in the header (nothing, a title, or a title
     plus the overview icon) — without this the header's height "jumps"
     between pages depending on what's shown. */
  min-height: 48px;
  padding: 1em 1.25em;
  border-bottom: 1px solid ${props => props.theme.colors.theme.lightgrey};

  a {
    text-decoration: none;
  }
`;

// The exhibition name (+ date, on the overview page) shown in the header.
// flex: 1 1 auto so it fills the space and truncates rather than pushing the
// overview icon off the right edge or wrapping onto a second line, which
// would change the header's height depending on content.
export const HeaderTitle = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: ${props => props.theme.fontSizes.small};

  strong {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  .date {
    color: ${props => props.theme.colors.theme.grey};
    margin-left: 0.6em;
  }
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

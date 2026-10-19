import styled, { css } from 'styled-components';
import { Link } from 'gatsby';
import { media } from '../../theme/theme';

// Lines a teaser or artist line shows before it is cut off with an ellipsis.
// The teaser comes as a long plain-text excerpt from GraphQL, so the visible
// length is decided here, per variant, rather than by truncating in JS.
const TEASER_LINES = { feature: 6, 'feature-small': 4, row: 3 };
const CARD_ARTIST_LINES = 2;

const clamp = (lines) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  line-clamp: ${lines};
  overflow: hidden;
`;

const titleSize = ({ $variant, theme }) => {
  if ($variant === 'feature') {
    return css`
      font-size: ${theme.fontSizes.currentTitle};
      ${media.xl} { font-size: ${theme.fontSizes.currentTitleWide}; }
    `;
  }
  if ($variant === 'feature-small') {
    return css`
      font-size: ${theme.fontSizes.upcomingTitle};
      ${media.xl} { font-size: ${theme.fontSizes.upcomingTitleWide}; }
    `;
  }
  return css`font-size: ${theme.fontSizes.itemTitle};`;
};

// The DOM order is the same for every variant (image, title, artist line,
// date, teaser), so screen readers meet the heading first. `card` and `row`
// show the date above the title by placing each part on the grid instead.
const variantLayout = ({ $variant, theme }) => {
  if ($variant === 'card') {
    // The card spans four rows of its grid parent (`ItemGrid`, later the
    // Recent grid of #67) and shares them with its neighbours, so image,
    // date, title and artist line line up across each line of cards even
    // when one date wraps to two lines. It needs that grid parent: without
    // one, Chrome collapses the last subgrid row and hides the artist line.
    return css`
      display: grid;
      grid-row: span 4;
      grid-template-rows: subgrid;
      row-gap: 0.4em;
      align-content: start;

      > ${ImageLink} { grid-row: 1; margin-bottom: 0.4em; }
      > ${ItemDate} { grid-row: 2; }
      > ${Title} { grid-row: 3; }
      > ${Artist} { grid-row: 4; }
    `;
  }

  if ($variant === 'row') {
    // The image takes one column and the text the next two, like the other
    // two-column splits on the site. From `xl` up two rows sit side by side
    // (#67), so image and text get one column each. The last row is `1fr`
    // so it, not the text rows, absorbs the height of a tall image.
    // `minmax(0, …)` keeps a long unbroken title from widening its column.
    return css`
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      grid-template-rows: auto auto auto auto 1fr;
      column-gap: ${theme.spacing.gap};
      row-gap: 0.4em;
      align-items: start;

      ${media.md} { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
      ${media.xl} { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }

      > ${ImageLink} { grid-column: 1; grid-row: 1 / -1; }
      > ${ItemDate} { grid-column: 2; grid-row: 1; }
      > ${Title} { grid-column: 2; grid-row: 2; }
      > ${Artist} { grid-column: 2; grid-row: 3; }
      > ${Teaser} { grid-column: 2; grid-row: 4; }
    `;
  }

  // `feature` and `feature-small` stack image and text for now. The column
  // splits for Current and Upcoming come with the page grid in #67.
  return css`
    > ${ImageLink} { margin-bottom: ${theme.spacing.gap}; }
    > * + * { margin-top: 0.5em; }
  `;
};

// Parent for `card` items. One column for now, as the past list on
// /exhibitions has always been; #67 turns it into the Recent grid.
export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  column-gap: ${props => props.theme.spacing.gap};
`;

export const Item = styled.article`
  margin: 0 0 ${props => props.theme.spacing.gap};

  &:last-child {
    margin-bottom: 0;
  }

  ${variantLayout}
`;

export const ImageLink = styled(Link)`
  display: block;
`;

export const Title = styled.h3`
  color: ${props => props.theme.colors.theme.black};
  font-weight: ${props => props.theme.fontWeights.medium};
  ${titleSize}
`;

// The artist line is the short subtitle from Contentful, rendered as HTML.
export const Artist = styled.div`
  ${({ $variant, theme }) => $variant === 'card'
    ? css`
      font-family: ${theme.fonts.main};
      font-size: ${theme.fontSizes.artist};
      font-weight: ${theme.fontWeights.normal};
      color: ${theme.colors.theme.date};
      ${clamp(CARD_ARTIST_LINES)}
    `
    : css`
      font-family: ${theme.fonts.mono};
      font-size: ${theme.fontSizes.artistMono};
      font-weight: ${theme.fontWeights.light};
      color: ${theme.colors.theme.black};
    `}

  p {
    margin: 0;
  }
`;

export const ItemDate = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.date};
  font-weight: ${props => props.theme.fontWeights.light};
  color: ${props => props.theme.colors.theme.date};
`;

// Each half of a range is one unbreakable piece, so a long range such as
// "10 September 2022 – 21 January 2023" wraps only after the dash.
export const NoWrap = styled.span`
  white-space: nowrap;
`;

// `card` and `row` render the range twice and let CSS pick one, so the
// server-rendered HTML matches the browser and no width check runs in JS:
// full month names from `breakpoints.sm` up, abbreviated ones below.
export const LongDate = styled.span`
  ${props => props.$hasShort && css`
    ${media.sm} { display: none; }
  `}
`;

export const ShortDate = styled.span`
  display: none;

  ${media.sm} { display: inline; }
`;

export const Teaser = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.teaser};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeight.base};
  color: ${props => props.theme.colors.theme.quiet};
  ${props => clamp(TEASER_LINES[props.$variant])}

  /* Archive rows are too narrow on phones for a teaser. */
  ${props => props.$variant === 'row' && css`
    ${media.sm} { display: none; }
  `}
`;

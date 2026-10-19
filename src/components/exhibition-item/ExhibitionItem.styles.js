import styled, { css } from 'styled-components';
import { Link } from 'gatsby';
import { media } from '../../theme/theme';
import { breakpointDisplay } from '../layout/Layout.styles';

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

// Columns of the page `Grid` (3 from `breakpoints.sm`, 4 from `xl`) that
// image and text of a feature take. Current gets the larger image: 2 of 3,
// then 3 of 4 columns. Upcoming: 1 of 3, then 2 of 4.
const FEATURE_COLUMNS = {
  feature: {
    md: { image: '1 / -2', text: '-2 / -1' },
    xl: { image: '1 / -2', text: '-2 / -1' },
  },
  'feature-small': {
    md: { image: '1 / 2', text: '2 / -1' },
    xl: { image: '1 / 3', text: '3 / -1' },
  },
};

// The DOM order is the same for every variant (image, title, artist line,
// date, teaser), so screen readers meet the heading first. `card` and `row`
// show the date above the title by placing each part on the grid instead.
//
// Every variant is a direct child of the page `Grid` (Layout.styles.js).
// `row` and the features take its columns over with `subgrid`, so their
// image and text edges are the same lines as the Recent cards next to them.
const variantLayout = ({ $variant, theme }) => {
  if ($variant === 'card') {
    // The card spans four rows of its grid parent (the Recent grid) and
    // shares them with its neighbours, so image, date, title and artist line
    // line up across each line of cards even when one date wraps to two
    // lines. It needs that grid parent: without one, Chrome collapses the
    // last subgrid row and hides the artist line.
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
    // The image takes the first column and the text the rest of the row:
    // one column on phones, two from `breakpoints.sm`. From `xl` up a row
    // spans only two of the four columns, so two rows sit side by side.
    // The last row is `1fr` so it, not the text rows, absorbs the height of
    // a tall image.
    return css`
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
      grid-template-rows: auto auto auto auto 1fr;
      row-gap: 0.4em;
      align-items: start;

      ${media.xl} { grid-column: span 2; }

      > ${ImageLink} { grid-column: 1; grid-row: 1 / -1; }
      > ${ItemDate} { grid-column: 2 / -1; grid-row: 1; }
      > ${Title} { grid-column: 2 / -1; grid-row: 2; }
      > ${Artist} { grid-column: 2 / -1; grid-row: 3; }
      > ${Teaser} { grid-column: 2 / -1; grid-row: 4; }
    `;
  }

  // `feature` and `feature-small` stack image and text on phones. From
  // `breakpoints.sm` image and text take the columns in FEATURE_COLUMNS,
  // the text parts one grid row each from the top; the last row (`1fr`)
  // takes up the rest of the image height.
  const { md, xl } = FEATURE_COLUMNS[$variant];

  return css`
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: 0.5em;
    align-items: start;

    > * { grid-column: 1 / -1; }
    > ${ImageLink} { margin-bottom: ${theme.spacing.gap}; }

    ${media.md} {
      grid-template-rows: auto auto auto auto 1fr;

      > ${ImageLink} { grid-column: ${md.image}; grid-row: 1 / -1; margin-bottom: 0; }
      > :not(${ImageLink}) { grid-column: ${md.text}; }
    }

    ${media.xl} {
      > ${ImageLink} { grid-column: ${xl.image}; }
      > :not(${ImageLink}) { grid-column: ${xl.text}; }
    }
  `;
};

export const Item = styled.article`
  /* Artist lines may hold bare URLs, which can't wrap in a half-width
     column on phones and would widen the page. */
  overflow-wrap: anywhere;

  ${variantLayout}
  ${breakpointDisplay}
`;

export const ImageLink = styled(Link)`
  display: block;
`;

export const Title = styled.h3`
  /* The global reset covers h1–h3 only; archive rows use h4. */
  margin: 0;
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
      font-weight: ${theme.fontWeights.normal};
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
  letter-spacing: ${props => props.theme.letterSpacing.date};
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

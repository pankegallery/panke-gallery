import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';
import { breakpointDisplay } from '../layout/Layout.styles';

// Lines a teaser or subtitle shows before it is cut off with an ellipsis,
// per breakpoint (keys as in `media`), as in the archive prototype (#67).
// The teaser comes as a long plain-text excerpt from GraphQL, so the visible
// length is decided here rather than by truncating in JS.
const TEASER_LINES = {
  feature: { sm: 6, md: 11, xl: 14 },
  'feature-small': { sm: 3, md: 3, xl: 6 },
  row: { sm: 3, md: 3, xl: 3 },
};
const SUBTITLE_LINES = 2;

const clamp = (lines) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  line-clamp: ${lines};
  overflow: hidden;
`;

const clampLines = (lines) => css`
  -webkit-line-clamp: ${lines};
  line-clamp: ${lines};
`;

const titleSize = ({ $variant, theme }) => {
  if ($variant === 'feature') {
    return css`
      font-size: ${theme.fontSizes.currentTitlePhone};
      ${media.md} { font-size: ${theme.fontSizes.currentTitle}; }
      ${media.xl} { font-size: ${theme.fontSizes.currentTitleWide}; }
    `;
  }
  if ($variant === 'feature-small') {
    return css`
      font-size: ${theme.fontSizes.upcomingTitlePhone};
      ${media.md} { font-size: ${theme.fontSizes.upcomingTitle}; }
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

// The text of every variant reads date, title, subtitle, teaser, one
// grid row each, `spacing.textGap` apart. The DOM order puts the title
// first instead (image, title, subtitle, date, teaser), so screen readers
// meet the heading first; the grid rows below put the date on top.
const textRows = (first) => css`
  > ${ItemDate} { grid-row: ${first}; }
  > ${Title} { grid-row: ${first + 1}; }
  > ${Subline} { grid-row: ${first + 2}; }
  > ${Teaser} { grid-row: ${first + 3}; }
`;

// Every variant is a direct child of the page `Grid` (Layout.styles.js).
// `row` (from `breakpoints.sm`) and the features take its columns over with
// `subgrid`, so their image and text edges are the same lines as the Recent
// cards next to them.
const variantLayout = ({ $variant, theme }) => {
  if ($variant === 'card') {
    // Each card stacks its own text: the subtitle follows its title
    // directly. (Sharing rows with the neighbours through `subgrid` left a
    // gap under every one-line title next to a two-line one.) Images and
    // one-line dates still line up, since all images are 16:10. The text
    // sits close to its own image (`cardImageGap`), and the Recent grid's
    // row gap (`cardLineGap`) keeps it far from the next line of cards, so
    // it can't be read as belonging to the image below.
    return css`
      display: grid;
      row-gap: ${theme.spacing.textGap};
      align-content: start;

      > ${ItemImage} {
        grid-row: 1;
        margin-bottom: calc(${theme.spacing.cardImageGap} - ${theme.spacing.textGap});
      }
      ${textRows(2)}
    `;
  }

  if ($variant === 'row') {
    // Phones: the row's own 2 : 3 split of image and text with a narrower
    // gap, so the text gets more room than half the screen. From
    // `breakpoints.sm` the row takes the page columns (image 1, text 2), and
    // from `xl` it spans only two of the four, so two rows sit side by side.
    // The last grid row is `1fr` so it, not the text rows, absorbs the
    // height of the image.
    return css`
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
      grid-template-rows: auto auto auto auto 1fr;
      column-gap: ${theme.spacing.splitGap};
      row-gap: ${theme.spacing.textGap};
      align-items: start;

      ${media.md} {
        grid-template-columns: subgrid;
        /* "normal" on a subgrid uses the page grid's gap. */
        column-gap: normal;
      }
      ${media.xl} { grid-column: span 2; }

      > ${ItemImage} { grid-column: 1; grid-row: 1 / -1; }
      > :not(${ItemImage}) { grid-column: 2 / -1; }
      ${textRows(1)}
    `;
  }

  // `feature` and `feature-small` stack image and text on phones. From
  // `breakpoints.sm` image and text take the columns in FEATURE_COLUMNS;
  // the last grid row (`1fr`) takes up the rest of the image height.
  const { md, xl } = FEATURE_COLUMNS[$variant];

  return css`
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: ${theme.spacing.textGap};
    align-items: start;

    > * { grid-column: 1 / -1; }
    > ${ItemImage} {
      grid-row: 1;
      /* Together with the row gap: splitGap between image and date. */
      margin-bottom: calc(${theme.spacing.splitGap} - ${theme.spacing.textGap});
    }
    ${textRows(2)}

    ${media.md} {
      grid-template-rows: auto auto auto auto 1fr;

      > ${ItemImage} { grid-column: ${md.image}; grid-row: 1 / -1; margin-bottom: 0; }
      > :not(${ItemImage}) { grid-column: ${md.text}; }
      ${textRows(1)}
    }

    ${media.xl} {
      > ${ItemImage} { grid-column: ${xl.image}; }
      > :not(${ItemImage}) { grid-column: ${xl.text}; }
    }
  `;
};

export const Item = styled.article`
  /* Holds the title link's click area, which covers the whole item. */
  position: relative;
  /* Subtitles may hold bare URLs, which can't wrap in a half-width
     column on phones and would widen the page. */
  overflow-wrap: anywhere;

  ${variantLayout}
  ${breakpointDisplay}
`;

export const ItemImage = styled.div`
  display: block;
`;

// Stands in for an image that is still loading (#68), in the shape every
// image on /exhibitions is cropped to, so the item keeps its height.
export const ImagePending = styled.div`
  aspect-ratio: ${props => props.theme.sizes.exhibitionImageRatio};
  background: ${props => props.theme.colors.theme.tint};
`;

export const Title = styled.h3`
  /* The global reset covers h1–h3 only; archive rows use h4. */
  margin: 0;
  color: ${props => props.theme.colors.theme.black};
  font-weight: ${props => props.theme.fontWeights.medium};
  line-height: ${props => props.theme.lineHeight.headings};
  text-wrap: balance;
  ${titleSize}

  /* The whole item is clickable, as in the archive prototype, through the
     title link: its ::after covers the item. The link text stays just the
     title for screen readers, and there is one tab stop per show. Hovering
     anywhere on the item hovers the link, so the title takes the accent
     colour (the a:hover rule in Layout.styles.js), and the focus ring
     goes around the whole item. */
  a::after {
    content: "";
    position: absolute;
    inset: 0;
  }

  a:focus-visible {
    outline: none;
  }

  a:focus-visible::after {
    outline: ${props => props.theme.sizes.focusRing} solid ${props => props.theme.colors.theme.black};
    outline-offset: ${props => props.theme.sizes.focusRing};
  }
`;

// The subline is the subtitle from Contentful, rendered as HTML.
// Two lines at most in every variant; long group-show lists end in "…".
export const Subline = styled.div`
  ${clamp(SUBTITLE_LINES)}

  ${({ $variant, theme }) => $variant === 'card'
    ? css`
      font-family: ${theme.fonts.main};
      font-size: ${theme.fontSizes.subline};
      font-weight: ${theme.fontWeights.normal};
      color: ${theme.colors.theme.date};
    `
    : css`
      font-family: ${theme.fonts.mono};
      font-size: ${theme.fontSizes.sublineMono};
      font-weight: ${theme.fontWeights.normal};
      color: ${theme.colors.theme.black};
    `}

  p {
    margin: 0;
  }

  /* Links in a subline (e.g. an artist's website) stay clickable
     above the title link's click area. */
  a {
    position: relative;
    z-index: 1;
  }
`;

export const ItemDate = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.date};
  font-weight: ${props => props.theme.fontWeights.light};
  color: ${props => props.theme.colors.theme.date};
  letter-spacing: ${props => props.theme.letterSpacing.date};
  /* Equal-width digits, so dates line up from row to row. */
  font-variant-numeric: tabular-nums;
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
    ${media.belowMd} { display: none; }
  `}
`;

export const ShortDate = styled.span`
  display: none;

  ${media.belowMd} { display: inline; }
`;

export const Teaser = styled.p`
  margin: ${props => props.theme.spacing.teaserGap} 0 0;
  max-width: ${props => props.theme.sizes.teaserMaxWidth};
  font-size: ${props => props.theme.fontSizes.teaser};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeight.teaser};
  color: ${props => props.theme.colors.theme.quiet};
  ${props => clamp(TEASER_LINES[props.$variant].sm)}
  ${media.md} { ${props => clampLines(TEASER_LINES[props.$variant].md)} }
  ${media.xl} { ${props => clampLines(TEASER_LINES[props.$variant].xl)} }

  /* Archive rows are too narrow on phones for a teaser. */
  ${props => props.$variant === 'row' && css`
    ${media.belowMd} { display: none; }
  `}
`;

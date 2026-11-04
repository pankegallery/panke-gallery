import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';

// Text styles shared by everything listed as an item with a whole-item
// link: exhibition items (exhibition-item.js) and the event rows
// (event-item.js). Each component keeps its own layout in its
// own styles file and places these pieces in it; they set only the type,
// so an exhibition and an event read the same.
//
// `$variant` on `Title` and `Subline` is the exhibition item variant
// (`feature`, `feature-small`, `card`, `row`), `event` for an event row,
// `event-teaser` for an event row with a thumbnail and teaser (Subline
// only), or `page` for the head of a detail page (Subline only).

const SUBLINE_LINES = 2;

// Cuts text off after `lines` lines with an ellipsis.
export const clamp = (lines) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  line-clamp: ${lines};
  overflow: hidden;
`;

// Changes the number of lines of an element that already has `clamp`,
// e.g. per breakpoint.
export const clampLines = (lines) => css`
  -webkit-line-clamp: ${lines};
  line-clamp: ${lines};
`;

// Titles follow the type scale (`theme.typeScale`), which already changes
// with the screen: the current show is xlarge, upcoming shows are large,
// and every other title (Recent cards, archive rows, events) is base, one
// step above the rest of the item's text.
const TITLE_SIZES = {
  feature: 'xlarge',
  'feature-small': 'large',
};

const titleSize = ({ $variant, theme }) =>
  css`font-size: ${theme.fontSizes[TITLE_SIZES[$variant] || 'base']};`;

// The item's heading. Its parent needs `position: relative`, since the
// title link's click area covers it.
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
     title for screen readers, and there is one tab stop per item. Hovering
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
// In lists two lines at most; long group-show lists end in "…". On a
// detail page (`$variant="page"`, the head in HeadSection) it shows in
// full. Recent cards and plain event rows set it in grey Roboto; next to a
// teaser (also in an event row, `event-teaser`) and on a detail page it is
// mono in black.
export const Subline = styled.div`
  ${({ $variant }) => $variant !== 'page' && clamp(SUBLINE_LINES)}

  ${({ $variant, theme }) => ['card', 'event'].includes($variant)
    ? css`
      font-family: ${theme.fonts.main};
      font-size: ${theme.fontSizes.medium};
      font-weight: ${theme.fontWeights.normal};
      color: ${theme.colors.theme.date};
    `
    : css`
      font-family: ${theme.fonts.mono};
      font-size: calc(${theme.fontSizes.small} + 1px);
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

// Lines a teaser shows before it is cut off with an ellipsis,
// per breakpoint (keys as in `media`), as in the archive prototype (#67).
// The teaser comes as a long plain-text excerpt from GraphQL, so the visible
// length is decided here rather than by truncating in JS. `event` is an
// event row with a thumbnail (EventItem `withImage`), sized like an archive
// row, whose image it sits next to.
const TEASER_LINES = {
  feature: { sm: 6, md: 11, xl: 14 },
  'feature-small': { sm: 3, md: 3, xl: 6 },
  row: { sm: 3, md: 3, xl: 3 },
  event: { sm: 3, md: 3, xl: 3 },
};

// A few lines from the item's long description, in a quieter grey than the
// subline, for the items with an image. `$variant` is a key of TEASER_LINES.
export const Teaser = styled.p`
  /* Together with the row gap: xs above the teaser, a little more than
     between the other lines. */
  margin: ${props => props.theme.spacing.xxs} 0 0;
  max-width: ${props => props.theme.sizes.teaserMaxWidth};
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeight.text};
  color: ${props => props.theme.colors.theme.quiet};
  ${props => clamp(TEASER_LINES[props.$variant].sm)}
  ${media.md} { ${props => clampLines(TEASER_LINES[props.$variant].md)} }
  ${media.xl} { ${props => clampLines(TEASER_LINES[props.$variant].xl)} }

  /* Archive rows are too narrow on phones for a teaser. */
  ${props => props.$variant === 'row' && css`
    ${media.belowMd} { display: none; }
  `}
`;

export const ItemDate = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.medium};
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

// Some items render the date twice and let CSS pick one, so the
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

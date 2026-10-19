import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';

export const Container = styled.div`
  max-width: ${props => props.theme.container.maxWidth};
  margin: 0 auto;
  padding: 0 15px;
  transform: translate(0px, 0px);
  transition: 0.25s ease;

  /* Pages with grids of images (/exhibitions) use the wide container. */
  ${props => props.$wide && css`
    ${media.xl} { max-width: ${props.theme.container.maxWidthWide}; }
  `}

  &.menu-active {
    transform: translate(-15.563em, 0px);
  }

  /* Dynamic theme color styles */
  a:hover,
  .highlight-color,
  .info a,
  .further a,
  .eventSeries, .button.eventSeries
   {
    color: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
    border-color: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
  }

  a.tag-selected,
  .carousel-indicators button.active {
    background: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
    color: ${props => props.theme.colors.theme.white} !important;
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
`;

export const Main = styled.main`
  /* Main content styles */
`;

// export const Inner = styled.div`
//   padding: ${props => props.theme.spacing.inner};
// `;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${props => props.theme.spacing.gap};

`;

export const Col = styled.div`

  grid-column: span ${props => {
    if (props.$xs) return `${(props.$xs)}`;
    return '12';
  }};

  display: ${props => {
    if (props.$d) {
      if (props.$d.includes('sm')) return 'block';
      else return 'none';
    }}};

  ${media.md} {

    grid-column: span ${props => {
    if (props.$sm) return `${(props.$sm)}`;
    if (props.$xs) return `${(props.$xs)}`;
    return '12';
  }};
    display: ${props => {
    if (props.$d) {
      if (props.$d.includes('md')) return 'block';
      else return 'none';
    }}};
  }

  ${media.lg} {

    grid-column: span ${props => {
    if (props.$md) return `${(props.$md)}`;
    if (props.$sm) return `${(props.$sm)}`;
    if (props.$xs) return `${(props.$xs)}`;
    return '12';
  }};

    display: ${props => {
    if (props.$d) {
      if (props.$d.includes('lg')) return 'block';
      else return 'none';
    }}};
  }};

  
`;

const gridColumns = (count) => `repeat(${count}, minmax(0, 1fr))`;

/**
 * The page column grid: `theme.grid.columns` columns per breakpoint (1 on
 * phones, 3 from `breakpoints.sm`, 4 from `breakpoints.xl`) with the theme
 * gap. On /exhibitions the features, the Recent cards and the archive rows
 * all sit on it, and ExhibitionItem lays its parts out on these columns
 * through `subgrid`, so every image and text edge on the page lines up.
 * The tracks are `minmax(0, 1fr)` so long titles or nowrap dates can't widen
 * a column. The gutter is `spacing.gapPhone` on phones, `spacing.gap` from
 * `breakpoints.sm`.
 *
 * `$rowGap` replaces the row gap, e.g. the wider gap between the lines of
 * Recent cards.
 */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => gridColumns(props.theme.grid.columns.sm)};
  gap: ${props => props.theme.spacing.gapPhone};

  ${media.md} {
    grid-template-columns: ${props => gridColumns(props.theme.grid.columns.md)};
    gap: ${props => props.theme.spacing.gap};
  }

  ${media.xl} {
    grid-template-columns: ${props => gridColumns(props.theme.grid.columns.xl)};
  }

  /* styled-components moves the media queries after this rule, so the
     override needs the doubled class to beat their gap. */
  ${props => props.$rowGap && css`
    && { row-gap: ${props.$rowGap}; }
  `}
`;

/**
 * Style helper that hides an element on part of the range:
 * `$hideBelow="md"` hides it below `media.md`, `$hideFrom="xl"` from
 * `media.xl` up. Keys are those of `media` (`md` or `xl`). Being CSS, it
 * works in the server-rendered HTML, so nothing changes on hydration.
 *
 * @param {{$hideBelow?: 'md'|'xl', $hideFrom?: 'md'|'xl'}} props
 */
export const breakpointDisplay = ({ $hideBelow, $hideFrom }) => css`
  ${$hideBelow && css`
    ${$hideBelow === 'md' ? media.belowMd : media.belowXl} { display: none; }
  `}
  ${$hideFrom && css`
    ${media[$hideFrom]} { display: none; }
  `}
`;

/**
 * Style helper for the short rule under the logo: a 40px line that sticks
 * out to the left of the text edge, `spacing.shortRuleSpace` below what is
 * above it. Put it on a pseudo-element (`&::after { ${shortRule} }`). The
 * header, the news on the homepage and the homepage's intro/Visit row use it
 * in place of full-width lines (#69). The line takes the text colour.
 */
export const shortRule = ({ theme }) => css`
  content: "";
  display: inline-block;
  clear: both;
  width: ${theme.sizes.shortRule};
  height: ${theme.spacing.shortRuleSpace};
  margin-left: -${theme.spacing.shortRuleOutdent};
  border-bottom: 1px solid;
`;

// Utility classes
export const TextRight = styled.span`
  text-align: right;
`;

export const TextCenter = styled.span`
  text-align: center;
`;

// export const DBlock = styled.span`
//   display: block;
// `;

// export const DNone = styled.span`
//   display: none;
// `;

// export const DSmBlock = styled.span`
//   display: none;
  
//   ${media.md} {
//     display: block;
//   }
// `;

// export const DSmNone = styled.span`
//   display: block;
  
//   ${media.md} {
//     display: none;
//   }
// `;

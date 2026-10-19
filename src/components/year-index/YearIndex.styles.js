import styled from 'styled-components';
import { Link } from 'gatsby';
import { media } from '../../theme/theme';
import { breakpointDisplay } from '../layout/Layout.styles';

// The bar between two thin lines. From `breakpoints.sm` it sticks to the top
// of the viewport while its section (the archive) scrolls past. That needs
// every ancestor up to the page to keep `overflow: visible` (or `clip`):
// `overflow: hidden` on any of them would switch `position: sticky` off.
export const Bar = styled.nav`
  margin-bottom: ${props => props.theme.spacing.chipGap};
  border-block: 1px solid ${props => props.theme.colors.theme.rule};
  background: ${props => props.theme.colors.theme.white};

  ${media.md} {
    position: sticky;
    top: 0;
    /* Above the archive images, which are positioned. */
    z-index: 2;
  }
`;

// One line of chips. On phones the years don't fit, so the line scrolls
// sideways instead of wrapping; the cut-off chip at the edge shows that
// there is more, so the scrollbar is hidden.
export const Chips = styled.ul`
  display: flex;
  gap: ${props => props.theme.spacing.chipGap};
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0;
  padding: ${props => props.theme.spacing.yearIndexPadding} 0;
  list-style: none;
`;

export const ChipItem = styled.li`
  flex: none;
  ${breakpointDisplay}
`;

// A pill-shaped link, at least `sizes.tapTarget` tall so it is easy to hit
// on a phone. The year in view gets a 2px border in the accent colour.
export const Chip = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: ${props => props.theme.sizes.yearChipMinWidth};
  min-height: ${props => props.theme.sizes.tapTarget};
  padding: 0 ${props => props.theme.spacing.yearChipPadding};
  border: 1px solid ${props => props.theme.colors.theme.rule};
  border-radius: ${props => props.theme.sizes.pillRadius};
  font-size: ${props => props.theme.fontSizes.yearChip};
  font-weight: ${props => props.theme.fontWeights.normal};
  font-variant-numeric: tabular-nums;
  color: ${props => props.theme.colors.theme.black};

  ${props => props.$active && `
    border-width: 2px;
    border-color: ${props.$accent};
  `}
`;

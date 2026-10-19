import styled from 'styled-components';
import { media } from '../../theme/theme';
import { breakpointDisplay } from '../layout/Layout.styles';
import { Tag } from '../content/Content.styles';

// The bar between two thin lines. From `breakpoints.sm` it sticks to the top
// of the viewport while its section (the archive) scrolls past. That needs
// every ancestor up to the page to keep `overflow: visible` (or `clip`):
// `overflow: hidden` on any of them would switch `position: sticky` off.
export const Bar = styled.nav`
  border-top: 1px solid ${props => props.theme.colors.theme.grey};
  border-bottom: 1px solid ${props => props.theme.colors.theme.grey};
  background: ${props => props.theme.colors.theme.white};

  ${media.md} {
    position: sticky;
    top: 0;
    /* Above the archive images, which are positioned. */
    z-index: 1;
  }
`;

// One line of chips. On phones the years don't fit, so the line scrolls
// sideways instead of wrapping.
export const Chips = styled.ul`
  display: flex;
  gap: calc(${props => props.theme.spacing.gap} / 4);
  overflow-x: auto;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ChipItem = styled.li`
  flex: none;
  ${breakpointDisplay}
`;

// A `Tag` as a link, at least `sizes.tapTarget` square so it is easy to hit
// on a phone. The year whose section is in view gets the accent border.
export const Chip = styled(Tag).attrs({ as: 'a' })`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${props => props.theme.sizes.tapTarget};
  min-height: ${props => props.theme.sizes.tapTarget};
  box-sizing: border-box;
  margin: 0;
  color: ${props => props.theme.colors.theme.black};
  border-color: ${props => props.$active ? props.$accent : 'transparent'};
`;

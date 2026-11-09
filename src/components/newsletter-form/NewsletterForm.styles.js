import styled from 'styled-components';
import { media } from '../../theme/theme';

// Email and name side by side from `breakpoints.md` (desktop), stacked on
// tablets and phones, where two fields side by side get too narrow (#122).
export const Fields = styled.div`
  ${media.lg} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: ${props => props.theme.spacing.gutter};
  }
`;

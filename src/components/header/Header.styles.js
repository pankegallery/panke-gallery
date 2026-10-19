import styled from 'styled-components';
import { media } from '../../theme/theme';
import { shortRule } from '../layout/Layout.styles';

export const StyledHeader = styled.header`
  padding: ${props => props.theme.spacing.gap} 0 0;

  ${media.md} {
    padding: ${props => props.theme.spacing.headerTop} 0  0;
  }

  &::after {
    ${shortRule}
  }
`;

export const Logotype = styled.p`
  color: ${props => props.theme.colors.theme.black};
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: ${props => props.theme.fontWeights.medium};
  letter-spacing: 0.08em;
  margin: 0;
`;

export const ToggleMenuButton = styled.button`
  border: 0;
  background: none;
  cursor: pointer;

  i, svg {
    font-size: 1.5em;
    padding: 6px 0 0;
  }
`;

import styled from 'styled-components';
import { media } from '../../theme/theme';

export const ColorSwapContainer = styled.div`
  left: 20px;
  position: fixed;
  top: 80%;

  ${media.sm} {
    left: 4%;
    position: absolute;
    top: 12px;
    display: none;
  }
`;

export const ColorBox = styled.div`
  background: ${props => props.$color || props.theme.colors.theme.lightgrey};
  border: 2px solid ${props => props.theme.colors.theme.white};
  height: 10px;
  margin: 0 0 2px;
  width: 10px;
  cursor: pointer;

  ${media.sm} {
    display: inline-block;
    margin: 0 0px 0 0;
    border: 1px solid ${props => props.theme.colors.theme.white};
    height: 8px;
    width: 8px;
  }
`;

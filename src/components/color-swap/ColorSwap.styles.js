import styled from 'styled-components';
import { media } from '../../theme/theme';

// An <aside>, so it is a landmark of its own next to the page. The column of
// 24px buttons is centred where the old, denser column was.
export const ColorSwapContainer = styled.aside`
  left: 15px;
  position: fixed;
  top: calc(80% - 24px);

  ${media.sm} {
    left: 4%;
    position: absolute;
    top: 12px;
    display: none;
  }
`;

// A transparent 24px button (WCAG 2.5.8) with the colour as a small box in
// its middle, so the boxes keep their size but sit further apart.
export const ColorBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.theme.sizes.pointerTarget};
  height: ${props => props.theme.sizes.pointerTarget};
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  appearance: none;
  cursor: pointer;

  &::before {
    content: '';
    box-sizing: content-box;
    width: 10px;
    height: 10px;
    border: 2px solid ${props => props.theme.colors.theme.white};
    background: ${props => props.$color || props.theme.colors.theme.lightgrey};
  }
`;

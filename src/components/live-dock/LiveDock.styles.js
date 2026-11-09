import styled from 'styled-components';
import { media } from '../../theme/theme';
import { uppercase } from '../layout/Layout.styles';
import { CardHead, Pill } from '../consent-embed/ConsentEmbed.styles';

// Fixed to the bottom of the screen while a stream runs (#74): a bar across
// the width on phones, a small box in the bottom-right corner from
// `breakpoints.sm`, on the right so it stays clear of the colour switcher
// on the left. Above the slideshow and language picker, below the
// navigation menu.
export const Dock = styled.aside`
  position: fixed;
  z-index: 50;
  left: ${props => props.theme.spacing.xs};
  right: ${props => props.theme.spacing.xs};
  bottom: ${props => props.theme.spacing.xs};
  box-sizing: border-box;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.theme.white};
  border: 2px solid ${props => props.theme.colors.theme.black};
  border-radius: 5px;

  ${media.md} {
    left: auto;
    right: ${props => props.theme.spacing.gutter};
    bottom: ${props => props.theme.spacing.gutter};
    width: ${props => props.theme.sizes.consentCard};
  }

  /* The dock is the frame: the pill and card of TwitchEmbed sit in it
     without a frame of their own, and the dock's head already says what is
     live, so the card's own head is left out. */
  ${Pill} {
    display: flex;
    width: 100%;
    margin-top: ${props => props.theme.spacing.xs};
    padding: 0;
    border: 0;
  }

  ${CardHead} {
    display: none;
  }

  iframe {
    margin-top: ${props => props.theme.spacing.xs};
  }
`;

export const DockHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.fontSizes.medium};

  strong {
    flex: none;
    white-space: nowrap;
    font-weight: ${props => props.theme.fontWeights.medium};
    ${uppercase}
  }

  /* The event title, cut off rather than wrapping the head. */
  a {
    min-width: 0;
    overflow: hidden;
    color: ${props => props.theme.colors.theme.black};
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

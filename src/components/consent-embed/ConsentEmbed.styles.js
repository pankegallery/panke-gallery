import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';
import { uppercase } from '../layout/Layout.styles';

// Fills the ResponsiveVideo frame, so the page layout doesn't jump when the
// iframe replaces the placeholder.
export const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  padding: ${props => props.theme.spacing.gutter} ${props => props.theme.spacing.md};
  text-align: center;
  background-color: ${props => props.theme.colors.theme.lightgrey};

  p {
    margin: 0;
  }
`;

export const Notice = styled.p`
  font-size: ${props => props.theme.fontSizes.small};
`;

// What the pill sits on, e.g. an event's featured image.
export const Cover = styled.div`
  position: relative;
`;

// The `pill` variant: on its cover in the bottom-left corner, or on its own
// below a slideshow. A white box with a black outline like `Button`, so it
// reads on light and dark images alike. On phones it always sits below:
// there a wide image is often not much taller than the pill and would
// disappear behind it.
export const Pill = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.xxs};
  max-width: 100%;
  margin-top: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.theme.white};
  border: 2px solid ${props => props.theme.colors.theme.black};
  border-radius: 5px;

  ${props => props.$overlay && css`
    ${media.md} {
      position: absolute;
      left: ${props.theme.spacing.sm};
      bottom: ${props.theme.spacing.sm};
      max-width: calc(100% - 2 * ${props.theme.spacing.sm});
      margin-top: 0;
    }
  `}

  /* White ground, so the date grey keeps its 4.5:1 contrast here. */
  ${Notice} {
    margin: 0;
    color: ${props => props.theme.colors.theme.date};

    a {
      color: inherit;
    }
  }
`;

export const PillButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${props => props.theme.colors.theme.black};
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
  text-align: left;
  ${uppercase}
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  /* Touch screens get the full tap target (CONTRIBUTING.md); with a mouse
     the pill stays small on the image. */
  @media (pointer: coarse) {
    min-height: ${props => props.theme.sizes.tapTarget};
  }
`;

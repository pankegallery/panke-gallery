import styled from 'styled-components';
import { media } from '../../theme/theme';

export const Container = styled.div`
  max-width: ${props => props.theme.container.maxWidth};
  margin: 0 auto;
  padding: 0 15px;
  -webkit-transform: translate(0px, 0px);
  -moz-transform: translate(0px, 0px);
  -o-transform: translate(0px, 0px);
  -ms-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
  -webkit-transition: 0.25s ease;
  -moz-transition: 0.25s ease;
  -o-transition: 0.25s ease;
  transition: 0.25s ease;

  &.menu-active {
    -webkit-transform: translate(-15.563em, 0px);
    -moz-transform: translate(-15.563em, 0px);
    -o-transform: translate(-15.563em, 0px);
    -ms-transform: translate(-15.563em, 0px);
    transform: translate(-15.563em, 0px);
  }

  /* Dynamic theme color styles */
  a:hover,
  .highlight-color,
  .info a,
  .further a {
    color: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
    border-color: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
  }

  .carousel-indicators li.active,
  .highlight-background {
    background-color: ${props => props.$themeColor ? props.theme.colors.panke[props.$themeColor] : props.theme.colors.panke.blue};
  }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
`;

export const Main = styled.main`
  /* Main content styles */
`;

export const Inner = styled.div`
  padding: ${props => props.theme.spacing.inner};
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
`;

export const Col = styled.div`
  padding: 0 15px;
  flex: ${props => {
    if (props.$xs) return `0 0 ${(props.$xs / 12) * 100}%`;
    return '0 0 100%';
  }};
  max-width: ${props => {
    if (props.$xs) return `${(props.$xs / 12) * 100}%`;
    return '100%';
  }};

  ${media.md} {
    flex: ${props => {
      if (props.$sm) return `0 0 ${(props.$sm / 12) * 100}%`;
      if (props.$xs) return `0 0 ${(props.$xs / 12) * 100}%`;
      return '0 0 100%';
    }};
    max-width: ${props => {
      if (props.$sm) return `${(props.$sm / 12) * 100}%`;
      if (props.$xs) return `${(props.$xs / 12) * 100}%`;
      return '100%';
    }};
  }

  ${media.lg} {
    flex: ${props => {
      if (props.$md) return `0 0 ${(props.$md / 12) * 100}%`;
      if (props.$sm) return `0 0 ${(props.$sm / 12) * 100}%`;
      if (props.$xs) return `0 0 ${(props.$xs / 12) * 100}%`;
      return '0 0 100%';
    }};
    max-width: ${props => {
      if (props.$md) return `${(props.$md / 12) * 100}%`;
      if (props.$sm) return `${(props.$sm / 12) * 100}%`;
      if (props.$xs) return `${(props.$xs / 12) * 100}%`;
      return '100%';
    }};
  }
`;

// Utility classes
export const TextRight = styled.span`
  text-align: right;
`;

export const TextCenter = styled.span`
  text-align: center;
`;

export const DBlock = styled.span`
  display: block;
`;

export const DNone = styled.span`
  display: none;
`;

export const DSmBlock = styled.span`
  display: none;
  
  ${media.md} {
    display: block;
  }
`;

export const DSmNone = styled.span`
  display: block;
  
  ${media.md} {
    display: none;
  }
`;

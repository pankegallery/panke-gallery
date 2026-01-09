import styled from 'styled-components';
import { media } from '../../theme/theme';

export const Nav = styled.nav`
  margin: 0;
  padding: 1em 0 0;
  display: inline-block;
`;

export const NavMain = styled(Nav)`
  float: left;

  ul {
    margin: 0;
    padding: 0;

    li a {
      font-weight: ${props => props.theme.fontWeights.medium};
    }
  }
`;

export const NavSatellite = styled(Nav)`
  ul {
    margin: 0 0 0 10px;
    padding: 0;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: inline-block;

    a {
      margin: 0;
      padding: 0 0 0 15px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: ${props => props.theme.fontSizes.medium};
    }

    &:first-child a {
      padding-left: 0;
    }
  }
`;

export const OffCanvas = styled.div`
  background: ${props => props.theme.colors.theme.white} none repeat scroll 0 0;
  box-shadow: 0 0 10px ${props => props.theme.colors.theme.lightgrey} inset;
  height: 100%;
  padding: ${props => props.theme.spacing.headerTop} 15px;
  position: fixed;
  right: -100%;
  top: 0;
  width: 100%;
  transition: right 0.25s ease;
  z-index: 100;

  &.active {
    right: 0;
  }

  ${NavMain}, ${NavSatellite} {
    float: none;
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  ${NavSatellite} {
    margin-top: 6vh;
  }

  ${NavList} {
    margin: 0 !important;
    padding: 0;

    li {
      display: block;

      a {
        display: block;
        padding: 1em 0;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: ${props => props.theme.fontSizes.medium};
        text-align: center;
      }
    }
  }

  .toggle-menu {
    transform: rotate(45deg);
    margin: 0 0 25px calc(100% - 20px);
  }
`;

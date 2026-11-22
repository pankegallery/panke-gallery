import styled from 'styled-components';

export const StyledFooter = styled.footer`
  color: ${props => props.theme.colors.theme.date};
  font-size: ${props => props.theme.fontSizes.small};
  padding: 100px 0 30px;

  /* Imprint and Privacy Policy: on touch screens the padding makes the links
     44px tall (theme.sizes.tapTarget), and the negative margin keeps the
     line where it was. */
  @media (pointer: coarse) {
    p a {
      display: inline-block;
      padding: 14px 0;
      margin: -14px 0;
    }
  }
`;

export const FooterText = styled.p`
  margin: 0;
  text-align: left;
`;

export const SocialLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const SocialLink = styled.a`
  color: ${props => props.theme.colors.theme.grey};
  font-size: 1.5em;
  margin-left: 10px;
  margin-right: ${props => (props.$gapAfter ? '1rem' : '0')};
  display: inline-block;

  &.facebook:hover {
    color: ${props => props.theme.colors.social.facebook};
  }

  &.bluesky:hover {
    color: ${props => props.theme.colors.social.bluesky};
  }

  /* On touch screens each icon gets an area to tap with the icon in its
     middle, which replaces the margin between the icons: 44px tall, and 44px
     wide where the row has room. On narrow phones the nine icons only fit
     in one row at about 36px each, so they may shrink down to 24px. */
  @media (pointer: coarse) {
    display: inline-flex;
    flex: 0 1 ${props => props.theme.sizes.tapTarget};
    align-items: center;
    justify-content: center;
    min-width: ${props => props.theme.sizes.pointerTarget};
    min-height: ${props => props.theme.sizes.tapTarget};
    margin-left: 0;
  }
`;

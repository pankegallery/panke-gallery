import styled from 'styled-components';

// Shown under the button when the checkout can't be opened. Black text in
// the small size, as the meta lines: the site's red is too light for text
// on white (about 4:1), and the message sits right by the button anyway.
export const CheckoutError = styled.p`
  margin: ${props => props.theme.spacing.xs} 0 0;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.theme.black};
`;

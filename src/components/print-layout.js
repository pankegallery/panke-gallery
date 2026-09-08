import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/GlobalStyles';

// Deliberately bare — no header, nav, or footer. This wraps internal
// print-only pages (the QR code sheets), which have no visitor-facing
// purpose and shouldn't carry the full site chrome (or its jQuery/Bootstrap/
// FontAwesome CDN scripts) just to get styled-components theme access.
const PrintLayout = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </StyledThemeProvider>
);

export default PrintLayout;

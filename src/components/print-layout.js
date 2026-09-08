import React from 'react';
import Helmet from 'react-helmet';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/GlobalStyles';
import PasswordGate from './password-gate';

// Deliberately bare — no header, nav, or footer. This wraps internal
// print-only pages (the QR code sheets), which have no visitor-facing
// purpose and shouldn't carry the full site chrome (or its jQuery/Bootstrap/
// FontAwesome CDN scripts) just to get styled-components theme access.
//
// Gated by a simple password prompt (PasswordGate) — not real access
// control on a statically-generated site (the page's own HTML is still
// directly fetchable), just enough to keep it off crawlers and away from
// non-intended visitors who land on the link by accident. `noindex` is a
// free extra layer against well-behaved search crawlers specifically.
const PrintLayout = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    <GlobalStyles />
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <PasswordGate>{children}</PasswordGate>
  </StyledThemeProvider>
);

export default PrintLayout;

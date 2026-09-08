import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/GlobalStyles';
import {
  GuideShell,
  GuideHeader,
  GuideMain,
  HeaderSlot,
  OverviewLink,
  DashboardIcon,
} from './guide-layout/GuideLayout.styles';

// A deliberately minimal shell for the audioguide pages — no navigation, no
// footer, no logo. The guide is meant to be used fullscreen on a phone while
// walking through the gallery, not as a page within the main site — the
// header is just the language action (left, when relevant) and the way back
// to the exhibition's overview (right, when relevant).
const GuideLayout = ({
  children,
  showOverviewLink = true,
  overviewHref = '/guide/',
  headerAction = null,
}) => {
  useEffect(() => {
    // iOS Safari only applies :active styles to elements that have (or whose
    // ancestor has) a touch listener attached — otherwise taps show no
    // pressed-state feedback at all. A no-op listener is the standard shim.
    document.addEventListener('touchstart', () => {}, { passive: true });
  }, []);

  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles />
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <GuideShell>
        <GuideHeader>
          <HeaderSlot>{headerAction}</HeaderSlot>

          <HeaderSlot>
            {showOverviewLink && (
              <OverviewLink as={Link} to={overviewHref} title="All audioguide stops" aria-label="All audioguide stops">
                <DashboardIcon>
                  <span />
                  <span />
                  <span />
                  <span />
                </DashboardIcon>
              </OverviewLink>
            )}
          </HeaderSlot>
        </GuideHeader>
        <GuideMain>{children}</GuideMain>
      </GuideShell>
    </StyledThemeProvider>
  );
};

export default GuideLayout;

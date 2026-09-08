import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'gatsby';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/GlobalStyles';
import { Logotype } from './header/Header.styles';
import {
  GuideShell,
  GuideHeader,
  GuideMain,
  HeaderActions,
  OverviewLink,
  DashboardIcon,
} from './guide-layout/GuideLayout.styles';

// Smaller than the main site header's wordmark, to leave the header roomy
// enough for a pill-shaped action (overview icon or language button) on the
// other side without crowding.
const SmallLogotype = styled(Logotype)`
  font-size: ${props => props.theme.fontSizes.medium};
`;

// A deliberately minimal shell for the audioguide pages — no navigation, no
// footer, just the wordmark. The guide is meant to be used fullscreen on a
// phone while walking through the gallery, not as a page within the main site.
//
// headerAction renders alongside the overview icon (not instead of it) — a
// stop page needs both at once: the way back to its exhibition's overview,
// and (when that position has language variants) the language indicator,
// since a visitor scanning that one artwork's QR code may never have passed
// through the overview page where the choice would otherwise be made.
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
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Go to panke.gallery homepage (opens in a new tab)"
          >
            <SmallLogotype>panke.gallery</SmallLogotype>
          </a>

          <HeaderActions>
            {headerAction}
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
          </HeaderActions>
        </GuideHeader>
        <GuideMain>{children}</GuideMain>
      </GuideShell>
    </StyledThemeProvider>
  );
};

export default GuideLayout;

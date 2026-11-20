import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { theme } from '../theme/theme';
import { GlobalStyles } from '../theme/GlobalStyles';
import Seo from './seo';
import {
  GuideShell,
  GuideHeader,
  GuideMain,
  OverviewLink,
  DashboardIcon,
} from './guide-layout/GuideLayout.styles';

/**
 * Head for the audioguide pages, to export as `Head` from them: the title as
 * given, and a viewport that reaches under the notch and home indicator
 * (`viewport-fit=cover`), since the guide is used fullscreen on a phone.
 *
 * @param {Object} props
 * @param {string} props.title
 */
export const GuideHead = ({ title }) => (
  <Seo title={title} standalone>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  </Seo>
);

// A deliberately minimal shell for the audioguide pages — no navigation, no
// footer, no logo. The guide is meant to be used fullscreen on a phone while
// walking through the gallery, not as a page within the main site — the
// header is just the exhibition name (left, via headerAction — typically a
// <HeaderTitle> from GuideLayout.styles) and the way back to the exhibition's
// overview (right, when relevant). Data-agnostic on purpose: this component
// doesn't know what headerAction contains, callers build it themselves.
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
      <GuideShell>
        <GuideHeader>
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
        </GuideHeader>
        <GuideMain>{children}</GuideMain>
      </GuideShell>
    </StyledThemeProvider>
  );
};

export default GuideLayout;

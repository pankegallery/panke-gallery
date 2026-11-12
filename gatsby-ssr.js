// Site-wide parts of the static HTML that don't depend on the page. A page's
// own title and description come from its `Head` export (`<Seo>`).
import React from 'react'

const favicons = [
  <link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />,
  <link key="icon-32" rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />,
  <link key="icon-16" rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />,
  <link key="manifest" rel="manifest" href="/favicons/site.webmanifest" />,
  <link key="mask-icon" rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />,
  <link key="shortcut-icon" rel="shortcut icon" href="/favicons/favicon.ico" />,
  <meta key="msapplication-TileColor" name="msapplication-TileColor" content="#2b5797" />,
  <meta key="msapplication-config" name="msapplication-config" content="/favicons/browserconfig.xml" />,
  <meta key="theme-color" name="theme-color" content="#ffffff" />,
]

// Matomo, set up as gatsby-plugin-matomo did it: our own instance, no
// cookies, and nothing tracked when the browser sends Do Not Track.
// No cookies means Matomo needs no consent banner (§ 25 TDDDG, #60). Visits
// are still counted, only returning visitors aren't recognised across days.
// The page views are sent from `onRouteUpdate` in gatsby-browser.js, for the
// first page as for every in-site navigation.
const MATOMO_URL = 'https://matomo.crosssenses.de'
const MATOMO_SITE_ID = '2'
const SITE_URL = 'https://www.panke.gallery'

const matomoTracker = `
if (!(navigator.doNotTrack === '1' || window.doNotTrack === '1')) {
  window._paq = window._paq || [];
  window._paq.push(['disableCookies']);
  window._paq.push(['setTrackerUrl', '${MATOMO_URL}/matomo.php']);
  window._paq.push(['setSiteId', '${MATOMO_SITE_ID}']);
  window._paq.push(['enableHeartBeatTimer']);
  window.matomoLoadStart = Date.now();
  (function() {
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.async = true; g.src = '${MATOMO_URL}/matomo.js'; s.parentNode.insertBefore(g, s);
  })();
}
`

// Counts visits without JavaScript, which the tracker above can't see.
const matomoPixel = pathname =>
  `<img src="${MATOMO_URL}/matomo.php?idsite=${MATOMO_SITE_ID}&amp;rec=1&amp;url=${encodeURIComponent(SITE_URL + pathname)}" style="border:0" alt="" />`

// gatsby-plugin-offline renders an empty app shell for offline use. Nobody
// visits it as a page, so it gets no tracker.
const OFFLINE_APP_SHELL = '/offline-plugin-app-shell-fallback/'

export const onRenderBody = ({ pathname, setHtmlAttributes, setHeadComponents, setPostBodyComponents }) => {
  // The site is English only (#63). German text, should it come back, gets
  // its own `lang="de"`.
  setHtmlAttributes({ lang: 'en' })
  setHeadComponents(favicons)

  // Only the production build tracks, so `npm run dev` sends nothing.
  if (process.env.NODE_ENV !== 'production' || pathname === OFFLINE_APP_SHELL) return

  setHeadComponents([<link key="matomo-preconnect" rel="preconnect" href={MATOMO_URL} />])
  setPostBodyComponents([
    <script key="matomo-tracker" dangerouslySetInnerHTML={{ __html: matomoTracker }} />,
    <noscript key="matomo-pixel" dangerouslySetInnerHTML={{ __html: matomoPixel(pathname) }} />,
  ])
}

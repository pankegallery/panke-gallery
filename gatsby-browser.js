// Global, site-wide assets. Gatsby bundles CSS imported here and inlines it
// into every server-rendered page, so it applies before React hydrates and
// to every layout (site, audioguide and print pages alike).

// Self-hosted fonts (#60). Webpack bundles the font files, so they are served
// from panke.gallery itself instead of Google Fonts, which would send each
// visitor's IP address to Google without consent.
//
// These are the per-weight files rather than `latin-300.css` and friends: only
// the per-weight files set `unicode-range`, so the browser downloads just the
// subsets a page needs (latin, plus latin-ext for names like Štromajer).
// The per-subset files have no `unicode-range`, so importing latin and
// latin-ext side by side would fetch both on every page.
//
// Weights match theme.fontWeights (light 300, normal 400, medium 500).
// Light italic covers emphasis in body text from Contentful.
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/300-italic.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
// Roboto Mono for the type refresh (#65).
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";

// Font Awesome renders icons as inline SVG and normally injects its CSS at
// runtime. That only happens after hydration, so the server-rendered icons
// flash at full size first. Ship the CSS with the bundle instead and switch
// off the runtime injection.
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

// /exhibitions/<year>/ and /events/<year>/ scroll to their year themselves,
// also on back and forward (`useOpenYear`), so Gatsby mustn't scroll to the
// top or to a saved position there. /events/<series>/ is a filter and keeps
// Gatsby's behaviour, as does everything else: `undefined` leaves the
// decision to it.
const ARCHIVE_YEAR = /^\/(exhibitions\/[^/]+|events\/\d{4})\/?$/;

export const shouldUpdateScroll = ({ routerProps: { location } }) =>
  ARCHIVE_YEAR.test(location.pathname) ? false : undefined;

// Matomo page views, as gatsby-plugin-matomo sent them. The tracker itself is
// added in gatsby-ssr.js; `window._paq` is missing in development, on the
// offline app shell and when the browser sends Do Not Track.
let isFirstRoute = true;
let trackedTitle = null;

// Gatsby sets the new page's <title> from its `Head` export in a render of its
// own after this hook, on slow pages only hundreds of milliseconds later, and
// briefly leaves the title empty while swapping it. So wait until there is a
// new title, or at most a second for pages that share their title.
const whenTitleChanged = (callback, waited = 0) => {
  const title = document.title;
  if ((title && title !== trackedTitle) || waited >= 1000) {
    trackedTitle = title;
    callback(title);
  } else {
    setTimeout(() => whenTitleChanged(callback, waited + 50), 50);
  }
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (process.env.NODE_ENV !== "production" || !window._paq) return;

  const url = location.pathname + location.search + location.hash;
  const prevUrl = prevLocation && prevLocation.pathname + prevLocation.search + prevLocation.hash;

  whenTitleChanged(title => {
    const _paq = window._paq;
    if (prevUrl) _paq.push(["setReferrerUrl", prevUrl]);
    _paq.push(["setCustomUrl", url]);
    _paq.push(["setDocumentTitle", title]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    _paq.push(["trackAllContentImpressions"]);
  });

  // How long the first page took until React was running.
  if (isFirstRoute) {
    isFirstRoute = false;
    const duration = Date.now() - (window.matomoLoadStart || Date.now());
    window._paq.push(["trackEvent", "javascript", "load", "duration", duration || null]);
  }
};

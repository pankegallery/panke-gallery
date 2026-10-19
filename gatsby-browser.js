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

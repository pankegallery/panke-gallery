// Theme configuration for styled-components
export const theme = {
  colors: {
    panke: {
      red: '#ff0000',
      green: '#00ff00',
      blue: '#0000ff',
      magenta: '#e80f80',
      gold: '#b8a407',
      tropical: '#088a96'
    },
    theme: {
      black: '#000',
      // Borders, tags and icons only. At 2.85:1 on white it is too light
      // for text, so text uses `date` or `quiet` below.
      grey: '#999',
      lightgrey: '#ccc',
      white: '#fff',
      // Dates and other secondary text (e.g. the subtitle in the Recent
      // grid). The lightest grey that still reaches 4.5:1 on white (WCAG AA).
      date: '#767676',
      // Teaser text: a darker, slightly cool grey that reads as body copy
      // while staying quieter than the black titles.
      quiet: '#5f5f66',
      // Thin lines around the year index and the chip outlines (#67).
      rule: '#d9d9de',
      // Image boxes in the archive while their year's images load (#68),
      // as in the archive prototype.
      tint: '#f1f1f4'
    }
  },
  breakpoints: {
    sm: '768px',
    md: '1080px',
    // Wide screens: features get larger titles and the wide container.
    xl: '1440px'
  },
  fonts: {
    main: "'Roboto', sans-serif",
    // Sublines in archive rows, Current, Upcoming and the exhibition page.
    // Self-hosted via @fontsource/roboto-mono (see gatsby-browser.js).
    mono: "'Roboto Mono', ui-monospace, Menlo, monospace"
  },
  // Type scale (#65): five sizes for the whole site, set per screen size.
  // Keys of each step as in `media`: `sm` phones, `md` from
  // `breakpoints.sm`, `xl` from `breakpoints.xl`. GlobalStyles turns them
  // into CSS custom properties, so components use `fontSizes` below and
  // never need a media query of their own for type.
  // - small: dates, mono sublines, meta lines, footer, captions
  // - medium: everything in grids and rows (titles, sublines, teasers) and
  //   the interface (navigation, section labels, tags, chips, buttons)
  // - base: running text only (descriptions, Info, Contact). Never in a
  //   grid, where it would break the layout; never below 16px, or iOS
  //   zooms into form fields.
  // - large: upcoming titles, year headings, the homepage intro
  // - xlarge: the current exhibition and the title of a detail page
  // Hierarchy inside an item comes from weight and colour, not more sizes.
  typeScale: {
    small: { sm: '13px', md: '13px', xl: '13px' },
    medium: { sm: '14px', md: '15px', xl: '15px' },
    base: { sm: '16px', md: '16px', xl: '16px' },
    large: { sm: '20px', md: '22px', xl: '24px' },
    xlarge: { sm: '24px', md: '28px', xl: '32px' }
  },
  // Use these in styles: each one follows its `typeScale` step through the
  // breakpoints. Always px underneath, so nested sizes don't compound like
  // the old em values did.
  fontSizes: {
    small: 'var(--fs-small)',
    medium: 'var(--fs-medium)',
    base: 'var(--fs-base)',
    large: 'var(--fs-large)',
    xlarge: 'var(--fs-xlarge)',
    // The logotype is part of the corporate identity, so it stays outside
    // the scale and the same on every screen.
    logo: '28.8px'
  },
  letterSpacing: {
    // Opens up the small light grey dates a little, so they read more easily.
    date: '0.02em',
    // Every uppercase text, through the `uppercase` helper in
    // Layout.styles.js: capitals read better with a little extra space (#89).
    uppercase: '0.02em'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500
  },
  // Columns of the page grid (`Grid` in Layout.styles.js), keyed like the
  // `media` helpers: phones, then from `breakpoints.sm` and `breakpoints.xl`.
  // One column on phones, so Recent shows full-width images: between
  // exhibitions it is the first thing on the page.
  grid: {
    columns: { sm: 1, md: 3, xl: 4 }
  },
  sizes: {
    // Smallest touch target (WCAG 2.5.5), e.g. the year chips on /exhibitions.
    tapTarget: '44px',
    yearChipMinWidth: '60px',
    // Teasers stop at a readable line length in wide text columns.
    teaserMaxWidth: '60ch',
    // Rounded ends for pill shapes such as the year chips.
    pillRadius: '999px',
    // Width and offset of keyboard focus outlines, as in GlobalStyles.
    focusRing: '2px',
    // Every image on /exhibitions is cropped to 16:10 (`aspectRatio: 1.6` in
    // its query); boxes waiting for their image keep that shape (#68).
    exhibitionImageRatio: '16 / 10',
    // The short rule under the logo, which also marks the intro/Visit row on
    // the homepage instead of a full-width line (#69).
    shortRule: '40px',
    // Width of the consent card of a live stream and of the live dock on the
    // homepage (#74): room for the notice in a few lines.
    consentCard: '360px',
    // Where a jump to a year stops from `breakpoints.sm`, below the sticky
    // year index (chip, padding and lines, plus some air).
    yearScrollMargin: '72px'
  },
  // Spacing scale (#89): every gap, padding and margin takes a step from
  // here, on a 4px grid, instead of a value of its own.
  spacing: {
    xxs: '4px',    // Between the lines of an item: date, title, subline, teaser
    xs: '8px',     // Image to text in Recent cards; between and around year chips
    sm: '12px',    // Image to text side by side; inside a year chip; under a year heading
    md: '16px',    // Page gutter on phones
    lg: '24px',    // Between the short rule and the content it introduces
    xl: '32px',    // Above the short rule; above a year heading
    xxl: '48px',   // Between the lines of Recent cards, so text stays with its own image
    // Two layout values outside the scale, part of the site's look since
    // the start: the page gutter from `breakpoints.sm` (also how far the
    // short rule sticks out left of the text) and the space above the
    // header from `breakpoints.sm`.
    gutter: '20px',
    headerTop: '55px'
  },
  // One line height per kind of text, matching the type scale: `base` for
  // small and medium (set on every element in GlobalStyles), `text` for
  // running text and teasers, `headings` for large and xlarge.
  lineHeight: {
    base: '1.4em',
    text: '1.5',
    headings: '1.25'
  },
  container: {
    // Default content width.
    maxWidth: '1080px',
    // Content width from `breakpoints.xl` up.
    maxWidthWide: '1400px'
  }
};

// Helper function to get panke color by key
export const getPankeColor = (color) => theme.colors.panke[color] || theme.colors.panke.blue;

// Helper function to get theme color by key
export const getThemeColor = (color) => theme.colors.theme[color] || theme.colors.theme.black;

// Media query helpers.
// Note the names are shifted against `breakpoints`: `media.sm` is everything
// below `breakpoints.sm` (mobile), `media.md` starts at `breakpoints.sm`
// (tablet) and `media.lg` at `breakpoints.md` (desktop). `media.xl` matches
// `breakpoints.xl` directly.
export const media = {
  sm: `@media (max-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.sm})`,
  lg: `@media (min-width: ${theme.breakpoints.md})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  // Exact complements of `media.md` and `media.xl`, for hiding something
  // until a breakpoint. (`media.sm` uses max-width and so also matches at
  // exactly `breakpoints.sm`.)
  belowMd: `@media (width < ${theme.breakpoints.sm})`,
  belowXl: `@media (width < ${theme.breakpoints.xl})`
};

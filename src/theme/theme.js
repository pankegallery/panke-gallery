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
      // Dates and other secondary text (e.g. the artist line in the Recent
      // grid). The lightest grey that still reaches 4.5:1 on white (WCAG AA).
      date: '#767676',
      // Teaser text: a darker, slightly cool grey that reads as body copy
      // while staying quieter than the black titles.
      quiet: '#5f5f66',
      // Thin lines around the year index and the chip outlines (#67).
      rule: '#d9d9de'
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
    // Artist lines in archive rows, Current, Upcoming and the exhibition page.
    // Self-hosted via @fontsource/roboto-mono (see gatsby-browser.js).
    mono: "'Roboto Mono', ui-monospace, Menlo, monospace"
  },
  fontSizes: {
    // Legacy sizes. The em values are relative to the parent, so they
    // compound when nested; keep them for existing styles only.
    base: '16px',
    small: '0.8em',
    medium: '0.9em',
    large: '1.8em',

    // Refresh sizes (#65). Always px: they come 1:1 from the agreed design
    // table and don't compound like em. (rem would add nothing, since the
    // root size is fixed at `base` = 16px in GlobalStyles.)
    date: '13px',          // Dates everywhere, Light 300
    itemTitle: '15px',     // Titles in grids and archive rows, Medium 500
    artist: '14px',        // Artist line in the Recent grid, Regular 400
    artistMono: '13px',    // Artist line set in `fonts.mono`, Regular 400
    teaser: '14px',        // Teaser text, Light 300
    // Feature titles (Medium 500). `Phone` applies below `breakpoints.sm`,
    // the plain value from there and `Wide` from `breakpoints.xl`; the
    // exhibition page title stays 34px throughout.
    currentTitlePhone: '24px',
    currentTitle: '28px',
    currentTitleWide: '32px',
    upcomingTitlePhone: '20px',
    upcomingTitle: '22px',
    upcomingTitleWide: '26px',
    yearTitle: '22px',     // Year headings in the exhibitions archive, Medium 500
    yearChip: '14px',      // Year chips in the archive index, Regular 400
    pageTitle: '34px'
  },
  letterSpacing: {
    // Opens up the small light grey dates a little, so they read more easily.
    date: '0.02em'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500
  },
  // Columns of the page grid (`Grid` in Layout.styles.js), keyed like the
  // `media` helpers: phones, then from `breakpoints.sm` and `breakpoints.xl`.
  grid: {
    columns: { sm: 2, md: 3, xl: 4 }
  },
  sizes: {
    // Smallest touch target (WCAG 2.5.5), e.g. the year chips on /exhibitions.
    tapTarget: '44px',
    yearChipMinWidth: '60px',
    // Teasers stop at a readable line length in wide text columns.
    teaserMaxWidth: '60ch',
    // Rounded ends for pill shapes such as the year chips.
    pillRadius: '999px'
  },
  spacing: {
    gap: '20px',
    // Gutter of the page `Grid` below `breakpoints.sm`.
    gapPhone: '16px',
    inner: '20px 15px',
    headerTop: '55px',

    // Inside exhibition items (#67): between the date, title, artist line
    // and teaser, plus a little more above the teaser.
    textGap: '4px',
    teaserGap: '6px',
    // Under a Recent card image, and between the year chips.
    imageGap: '8px',
    // Between image and text where they don't sit on the page grid: archive
    // rows on phones and stacked features.
    splitGap: '12px',
    // Between the two lines of Recent cards (added to `textGap`).
    cardLineGap: '24px',
    // Archive year index: above and below the chips, inside a chip, and
    // around a year heading.
    yearIndexPadding: '10px',
    yearChipPadding: '14px',
    yearHeadingTop: '28px',
    yearHeadingBottom: '14px',
    // Where a jump to a year stops from `breakpoints.sm`, below the sticky
    // year index (chip, padding and lines, plus some air).
    yearScrollMargin: '72px'
  },
  lineHeight: {
    base: '1.4em',
    headings: '1.3em',
    teaser: '1.5'
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

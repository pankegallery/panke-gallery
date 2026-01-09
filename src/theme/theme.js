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
      grey: '#999',
      lightgrey: '#ccc',
      white: '#fff'
    }
  },
  breakpoints: {
    sm: '768px',
    md: '1080px'
  },
  fonts: {
    main: "'Roboto', sans-serif"
  },
  fontSizes: {
    base: '16px',
    small: '0.8em',
    medium: '0.9em',
    large: '1.8em'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500
  },
  spacing: {
    inner: '20px 15px',
    headerTop: '55px'
  },
  lineHeight: {
    base: '1.4em',
    headings: '1.3em'
  },
  container: {
    maxWidth: '1080px'
  }
};

// Helper function to get panke color by key
export const getPankeColor = (color) => theme.colors.panke[color] || theme.colors.panke.blue;

// Helper function to get theme color by key
export const getThemeColor = (color) => theme.colors.theme[color] || theme.colors.theme.black;

// Media query helpers
export const media = {
  sm: `@media (max-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.sm})`,
  lg: `@media (min-width: ${theme.breakpoints.md})`
};

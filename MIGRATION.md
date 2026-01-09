# SASS to Styled Components Migration

## Summary

This repository has been migrated from SASS/SCSS styling to styled-components, implementing a modern CSS-in-JS architecture while maintaining visual parity with the original design.

## What Has Been Completed

### Infrastructure Setup ✅
- Installed `styled-components` (v6.1.14) and `gatsby-plugin-styled-components`
- Removed `sass` and `gatsby-plugin-sass` dependencies
- Updated `gatsby-config.js` to use styled-components plugin instead of SASS

### Theme Configuration ✅
Created comprehensive theme system in `src/theme/`:
- **theme.js**: Centralized theme configuration with:
  - Color palette (panke colors: red, green, blue, magenta, gold, tropical)
  - Theme colors (black, grey, lightgrey, white)
  - Breakpoints for responsive design (768px, 1080px)
  - Typography settings (fonts, sizes, weights)
  - Spacing and layout constants
  - Media query helpers

- **GlobalStyles.js**: Global styles using `createGlobalStyle` for:
  - Base HTML/body styling
  - Typography defaults
  - Link styling
  - Heading styles

### Component Migrations ✅

#### Layout Components
- **Layout** (`src/components/layout/Layout.styles.js`):
  - Container with responsive grid system
  - Row and Col components (Bootstrap-compatible)
  - Utility classes (text alignment, display utilities)
  - Dynamic theme color support
  
- **Header** (`src/components/header/Header.styles.js`):
  - StyledHeader with decorative ::after element
  - Logotype styling
  - ToggleMenuButton
  
- **Navigation** (`src/components/navigation/Navigation.styles.js`):
  - NavMain and NavSatellite components
  - NavList styling
  - OffCanvas mobile menu with animations
  
- **Footer** (`src/components/footer/Footer.styles.js`):
  - StyledFooter with social icon styling
  
- **ColorSwap** (`src/components/color-swap/ColorSwap.styles.js`):
  - ColorSwapContainer and ColorBox
  - Responsive positioning

#### Content Components
- **Content Sections** (`src/components/content/Content.styles.js`):
  - NewsSection with decorative border
  - Section, Headline, Article components
  - Meta, Tag, EventSeries styled elements
  - InfoSection and FurtherSection
  - ImageWrapper components

#### Form Components  
- **RSVP Form** (`src/components/rsvp-form/RsvpForm.styles.js`):
  - RsvpFormContainer and StyledRsvpForm
  - RsvpSubmitButton with hover effects
  - RsvpError, RsvpSuccess, RsvpClosed states

#### Media Components
- **Media** (`src/components/media/Media.styles.js`):
  - CarouselControl and CarouselIndicators
  - ResponsiveVideo iframe container
  - VideosButton and Address components

### Page Migrations ✅
- **index.js**: Homepage using styled grid and content components
- **exhibition-preview.js**: Updated to use Article and Meta styled components
- **event-preview.js**: Updated to use NewsArticle, Meta, and Tag components

## Current Architecture

### Responsive Grid System
Replaced Bootstrap 4 grid with custom styled-components grid:
- `<Row>`: Flexbox container with negative margins
- `<Col $xs={12} $sm={6} $md={4}>`: Responsive column with prop-based sizing
- Breakpoint-based responsive behavior using media queries

### Theme Integration
- Uses React Context (ThemeContext) for dynamic color theming
- Integrates with styled-components ThemeProvider
- Color theme changes update Container component's $themeColor prop
- Dynamic color application for links and highlights

### Styling Pattern
Components follow a consistent pattern:
```javascript
// Component file
import { StyledComponent } from './ComponentName.styles';

// Styles file  
import styled from 'styled-components';
export const StyledComponent = styled.div`
  color: ${props => props.theme.colors.theme.black};
`;
```

## What Remains To Be Done

### Pages Requiring Migration
The following pages still use Bootstrap class names and need migration:
- ` src/pages/404.js`
- `src/pages/contact.js`
- `src/pages/editions.js`
- `src/pages/events.js`
- `src/pages/exhibitions.js`
- `src/pages/info.js`
- `src/pages/privacy.js`
- `src/pages/rosa.js`
- `src/pages/streaming.js`

### Templates Requiring Migration
- `src/templates/edition.js`
- `src/templates/event.js`
- `src/templates/exhibition.js`

### Components Requiring Migration
- `src/components/content-block.js`
- `src/components/documentation-images.js`
- `src/components/event-list-item.js`
- `src/components/exhibition-list-item.js`
- `src/components/slideshow.js`
- `src/components/social-icons.js`
- `src/components/youtubePlaylist.js`
- Other minor components

### Migration Guide for Remaining Files

To migrate a page or component:

1. Import styled components:
```javascript
import { Row, Col } from '../components/layout/Layout.styles';
import { Section, Headline } from '../components/content/Content.styles';
```

2. Replace Bootstrap classes:
```javascript
// Before
<div className="row">
  <div className="col-md-8 col-sm-12">

// After
<Row>
  <Col $md={8} $sm={12}>
```

3. Replace semantic HTML with styled components where appropriate:
```javascript
// Before
<section className="news">
  <article className="news-item">
  
// After
<NewsSection>
  <NewsArticle>
```

4. Use theme values instead of hardcoded styles:
```javascript
// Access theme in styled components
color: ${props => props.theme.colors.panke.blue};
font-size: ${props => props.theme.fontSizes.medium};
```

## Files That Can Be Removed

Once migration is complete, these SASS files can be deleted:
- `src/styles/panke.scss`
- `src/styles/_variables.scss`
- `src/styles/_theme.scss`
- `src/styles/_functions.scss`
- `src/styles/panke.css`
- `src/styles/bootstrap/` (entire directory - 44 files)

## Benefits of This Migration

1. **Smaller Bundle**: Removed entire Bootstrap 4 framework (~90% unused)
2. **Component Scoping**: Styles are scoped to components, preventing conflicts
3. **Dynamic Theming**: Better integration with React Context for color themes
4. **Modern Stack**: Using industry-standard CSS-in-JS solution
5. **Type Safety**: Can add TypeScript support more easily
6. **Better DX**: Co-located styles with components for easier maintenance
7. **Performance**: Only ship CSS that's actually used

## Testing Checklist

Before deploying, verify:
- [ ] All pages render correctly
- [ ] Responsive breakpoints work (test at 768px and 1080px)
- [ ] Color theme switching works
- [ ] Mobile menu functions properly
- [ ] Forms submit correctly
- [ ] All carousels/media components work
- [ ] Visual parity with original design
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Screenshots match original design

## Dependencies Added
- styled-components: ^6.1.14
- gatsby-plugin-styled-components: ^6.13.0
- babel-plugin-styled-components: ^2.1.4

## Dependencies Removed
- sass: ~1.69.7
- gatsby-plugin-sass: ^6.13.0

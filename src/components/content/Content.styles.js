import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';
import { breakpointDisplay, shortRule, uppercase } from '../layout/Layout.styles';

// Uppercase section labels such as "Upcoming events", "Current" or
// "About the exhibition".
const sectionLabel = ({ theme }) => css`
  ${uppercase}
  font-size: ${theme.fontSizes.medium};
  font-weight: ${theme.fontWeights.light};
  margin-bottom: 1em;
`;

export const NewsSection = styled.section`
  &::after {
    ${shortRule}
  }
`;

export const Section = styled.section`
  margin: ${props => props.$margin || '0'};
`;

export const Headline = styled.div`

  display: block;
  padding-top: 2em;
  
  ${media.md} {
    display: flex;
    justify-content: space-between;
  }

  h1, h2 {
    ${sectionLabel}
  }

  h1 {
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  > div {
    padding-bottom: 1.5em;
    padding-top: 2em;
  }
  
`;

// One year of the exhibitions archive; its id is the year, the target of
// the year index. From `breakpoints.sm` the index sticks to the top, so a
// jump stops below it. Takes `$hideFrom` / `$hideBelow` (see
// `breakpointDisplay`).
export const YearSection = styled.section`
  ${media.md} {
    scroll-margin-top: ${props => props.theme.spacing.yearScrollMargin};
  }

  ${breakpointDisplay}
`;

export const YearHeading = styled.h3`
  margin: ${props => props.theme.spacing.yearHeadingTop} 0 ${props => props.theme.spacing.yearHeadingBottom};
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-variant-numeric: tabular-nums;
`;

export const Article = styled.article`
  margin: 0 0 30px;

  &:last-child {
    margin: 0;
    padding: 0;
  }

  h3 {
    margin: 1em 0 1em;
    
    small {
      font-size: inherit;
      font-weight: ${props => props.theme.fontWeights.light};
      padding-left: 1em;
    }
  }

  p small {
    font-size: inherit;
    font-weight: ${props => props.theme.fontWeights.light};
    padding-left: 1em;
  }
`;

export const NewsArticle = styled(Article)`
  margin: 0 0 30px;
`;

// Secondary lines in grey: dates, image captions, the artist of an audio
// guide stop. Small, like the dates in the exhibition items.
export const Meta = styled.p`
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.theme.date};
`;

export const Tag = styled.p`
  display: inline-block;
  padding: 4px 8px;
  border: ${props => props.theme.colors.theme.grey} 2px solid;
  border-radius: 5px;
  background: transparent;
  color: ${props => props.theme.colors.theme.grey};
  ${uppercase}
  font-size: ${props => props.theme.fontSizes.medium};
  margin-top: 10px;
  margin-right: 10px;

  &.tag-selected {
    background: ${props => props.theme.colors.theme.grey};
    color: ${props => props.theme.colors.theme.white} !important;

    &::before {
      content: "×";
      display: inline-block;
      margin-right: 1em;
    }
  }
`;

export const EventSeries = styled(Tag)`
  /* inherits highlight-color and highlight-background from container */
  
`;

// Generic outlined CTA button (fills on hover) — same style as the RSVP
// form's submit button (src/components/rsvp-form/RsvpForm.styles.js), kept
// as a separate, generically-named copy here so pages outside the RSVP flow
// (e.g. a "listen to the audioguide" link) aren't importing something named
// for an unrelated feature.
export const Button = styled.button`
  font-size: ${props => props.theme.fontSizes.medium};
  text-align: center;
  color: ${props => props.theme.colors.theme.black};
  padding: 10px 20px;
  ${uppercase}
  border: ${props => props.theme.colors.theme.black} 2px solid;
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.theme.black};
    color: ${props => props.theme.colors.theme.white};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HeadSection = styled.div`

margin: 2em 0 0;

  /* The page title, the same size as the current show on /exhibitions, so
     it keeps its size from teaser to page; Medium like every title (#65).
     No uppercase: exhibition titles keep the artists' own casing. */
  h1 {
    font-size: ${props => props.theme.fontSizes.xlarge};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin-bottom: 0.5em;
  }
`;

export const InfoSection = styled.div`
  margin: 3em 0 0;
  line-height: ${props => props.theme.lineHeight.text};

  h2 {
    ${sectionLabel}
  }

  p {
    font-weight: ${props => props.theme.fontWeights.medium};

    img {
      max-width: 100%;
    }
  }
`;

export const FurtherSection = styled.div`
  margin: 3em 0 0;
  line-height: ${props => props.theme.lineHeight.text};

  h2 {
    ${sectionLabel}
  }

  h4 {
    font-size: ${props => props.theme.fontSizes.base};
    font-weight: ${props => props.theme.fontWeights.medium};
    margin: 0 0 0.3em;
  }

  p img {
    max-width: 100%;
  }
`;

export const ImageWrapper = styled.div`
  margin-bottom: 30px;
  
  & + p {
    margin-bottom: 30px;
  }
`;

export const ImageWrapperVertical = styled.div`
  height: 100%;
  margin-bottom: 30px;
  text-align: center;
  vertical-align: middle;
`;

// Scales an embedded iframe to the column width at a fixed aspect ratio.
// Defaults to 16:9 for video; pass `$ratio` (a CSS aspect-ratio value) for
// other embeds such as the contact page map.
export const ResponsiveVideo = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${props => props.$ratio || '16 / 9'};

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;
// The homepage's last row (#69): the one-line intro in the first column of
// the page `Grid` and the Visit block beside it, from the same column edge
// as the exhibition text above. The short rule from the header marks the
// row instead of a full-width line.
export const IntroSection = styled.section`
  &::before {
    ${shortRule}
    display: block;
    margin-bottom: ${props => props.theme.spacing.shortRuleGap};
  }
`;

export const Intro = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeight.text};
  text-wrap: balance;

  ${media.md} {
    padding-right: ${props => props.theme.spacing.gap};
  }
`;

// Address and opening hours: the Contact page's "visitUs" block from
// Contentful, so the hours are kept in one place. Its headings are section
// labels here, as on the Contact page.
export const Visit = styled.div`
  ${media.md} { grid-column: 2 / -1; }
  ${media.xl} { grid-column: 2 / span 2; }

  h2 {
    ${sectionLabel}
  }
`;

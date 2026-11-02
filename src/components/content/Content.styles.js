import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';
import { Row, breakpointDisplay, shortRule, uppercase } from '../layout/Layout.styles';
import { ItemDate } from './Item.styles';

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

// Puts more space between the labelled sections inside it, on top of the
// space above each section label, so one block (event rows, a feature, the
// Recent grid) doesn't run into the next. Used on the homepage, /exhibitions
// and /events, so all three share the same rhythm.
export const SectionStack = styled.div`
  > ${Section} + ${Section} {
    margin-top: ${props => props.theme.spacing.xxl};
  }
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
    scroll-margin-top: ${props => props.theme.sizes.yearScrollMargin};
  }

  ${breakpointDisplay}
`;

export const YearHeading = styled.h3`
  margin: ${props => props.theme.spacing.xl} 0 ${props => props.theme.spacing.sm};
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

// A tag stays on one line: a name too long for its column ends in "…"
// (TagName), and the box keeps the width of its text instead of wrapping
// into a box as wide as the column.
export const Tag = styled.p`
  display: inline-flex;
  align-items: baseline;
  max-width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  padding: 4px 8px;
  border: ${props => props.theme.colors.theme.grey} 2px solid;
  border-radius: 5px;
  background: transparent;
  color: ${props => props.theme.colors.theme.grey};
  ${uppercase}
  font-size: ${props => props.theme.fontSizes.small};
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

// The name in a Tag, cut off with "…" when the tag reaches the width of
// its column. `min-width: 0` lets it shrink inside the flex box.
export const TagName = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// The number of events after a series name in the series overview on
// /events, e.g. "SOUND NIGHT 17". It never shrinks, so it stays visible
// when the name is cut off.
export const TagCount = styled.span`
  flex: none;
  margin-left: 0.4em;
  font-variant-numeric: tabular-nums;
`;

// A line-wrapping list of tags, e.g. the series overview on /events. Its
// items can be hidden with the `hidden` attribute: Tag sets its own
// `display`, which would otherwise win over the browser's `[hidden]` rule.
export const TagList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: inline-block;
    /* So a long tag ends in "…" at the column edge instead of widening it. */
    max-width: 100%;
  }

  > li[hidden] {
    display: none;
  }
`;

// A button in the shape of a tag, e.g. "+ 10 more" at the end of a TagList.
// In the accent colour like the tags around it, but dimmed and with a
// dotted border, so it reads as a control rather than another series.
// `$accent` is the colour picked in the colour swap (getPankeColor).
export const TagButton = styled(Tag).attrs({ as: 'button', type: 'button' })`
  font-family: inherit;
  cursor: pointer;
  color: color-mix(in srgb, ${props => props.$accent} 70%, ${props => props.theme.colors.theme.white});
  border-style: dotted;
  border-color: color-mix(in srgb, ${props => props.$accent} 60%, ${props => props.theme.colors.theme.white});

  &:hover {
    color: ${props => props.$accent};
    border-color: ${props => props.$accent};
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

// Head of an exhibition or event page (#70): a `Row` with the title and
// date in the left `Col`, and the subline and tags in the right one. From
// `breakpoints.sm` it is the 4/8 split of the InfoSection rows below, so
// the head lines up with "About the exhibition" and its text; from
// `breakpoints.md` it opens to 6/6, which gives long titles and the mono
// subline more room side by side. The image or slideshow follows the row
// across the full width. On phones both columns stack.
export const HeadSection = styled.div`
  margin: 2em 0 0;

  > ${Row} {
    /* Stacked on phones, the subline stays close to its title. */
    row-gap: ${props => props.theme.spacing.xs};
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  /* The page title, the same size as the current show on /exhibitions, so
     it keeps its size from teaser to page; Medium like every title (#65).
     No uppercase: exhibition titles keep the artists' own casing. Long
     titles wrap within their column. */
  h1 {
    margin: 0;
    font-size: ${props => props.theme.fontSizes.xlarge};
    font-weight: ${props => props.theme.fontWeights.medium};
    overflow-wrap: break-word;
    text-wrap: balance;
  }

  /* Subline, date and tags read as one block, spaced as in the exhibition
     items. */
  ${ItemDate} {
    margin-top: ${props => props.theme.spacing.xxs};
  }
`;

// Long words without spaces in Contentful text (URLs, wallet addresses
// such as the one under "Support" on /info) wrap anywhere instead of
// widening their column and the page on phones.
const wrapLongWords = css`
  overflow-wrap: anywhere;
`;

export const InfoSection = styled.div`
  margin: 3em 0 0;
  line-height: ${props => props.theme.lineHeight.text};
  ${wrapLongWords}

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
  ${wrapLongWords}

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

// Cards in the text column of a labelled section, as on /studio (#85): two
// side by side from `breakpoints.sm`, full width on phones like the Recent
// grid. The wide row gap keeps each card's text with its own image.
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${props => props.theme.spacing.xxl} ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.lg};

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: ${props => props.theme.spacing.gutter};
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
  /* The same gap as between the labelled sections above (SectionStack),
     so the last block (e.g. the residency) doesn't crowd the short rule. */
  margin-top: ${props => props.theme.spacing.xxl};

  &::before {
    ${shortRule}
    display: block;
    margin-bottom: ${props => props.theme.spacing.lg};
  }
`;

export const Intro = styled.p`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: ${props => props.theme.fontWeights.light};
  line-height: ${props => props.theme.lineHeight.text};
  text-wrap: balance;

  ${media.md} {
    padding-right: ${props => props.theme.spacing.gutter};
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

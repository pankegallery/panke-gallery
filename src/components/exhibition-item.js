import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { DASH, dateRangeParts } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
import { theme } from '../theme/theme'
import {
  Item,
  ImageLink,
  Title,
  Artist,
  ItemDate,
  NoWrap,
  LongDate,
  ShortDate,
  Teaser,
} from './exhibition-item/ExhibitionItem.styles'

// Variants whose image only repeats the linked title next to it, so it
// gets `alt=""` and stays out of the tab order.
const COMPACT_VARIANTS = ['card', 'row']
// Variants whose dates switch to short months on phones (see `LongDate` /
// `ShortDate`): archive rows, whose text column is narrow there. Recent
// cards are full width on phones and keep the full month names.
const SHORT_DATE_VARIANTS = ['row']

// `sizes` for the image of each variant, from the grid columns its image
// spans on phones, from `breakpoints.sm` and from `breakpoints.xl` (see the
// styles). The query asks for 1050px images, whose default `sizes` would
// make a phone load a 2100px file for a half-width thumbnail. These are
// upper bounds (gaps and page padding left out), so images stay sharp.
const { breakpoints, container, grid } = theme
const imageSizes = ([sm, md, xl]) => [
  `(min-width: ${breakpoints.xl}) calc(${container.maxWidthWide} * ${xl} / ${grid.columns.xl})`,
  `(min-width: ${breakpoints.sm}) ${Math.ceil((100 * md) / grid.columns.md)}vw`,
  `${Math.ceil((100 * sm) / grid.columns.sm)}vw`,
].join(', ')

const IMAGE_SIZES = {
  feature: imageSizes([1, 2, 3]),
  'feature-small': imageSizes([1, 1, 2]),
  card: imageSizes([1, 1, 1]),
  // On phones the row has its own 2 : 3 split, so the image is 2/5 wide.
  row: imageSizes([0.4, 1, 1]),
}

/** Returns `gatsbyImageData` with its `sizes` replaced on every source. */
const withSizes = (image, sizes) => ({
  ...image,
  images: {
    ...image.images,
    fallback: image.images.fallback && { ...image.images.fallback, sizes },
    sources: image.images.sources?.map((source) => ({ ...source, sizes })),
  },
})

/** Renders the parts of a date range so it wraps only after the dash. */
const DateRange = ({ parts }) =>
  parts.map((part, i) => (
    <NoWrap key={i}>
      {part}
      {i < parts.length - 1 && DASH}
    </NoWrap>
  ))

/**
 * One exhibition in a list: the homepage, /exhibitions and its archive all
 * render shows through this component, so they share markup, date format and
 * alt text. Every variant must be a direct child of the page `Grid`
 * (Layout.styles.js), whose columns it lays its image and text on.
 *
 * Variants (layout as in the archive prototype of #67):
 * - `feature`: the current show. Large image; date with opening hours and
 *   vernissage info, feature-size title, mono artist line, long teaser.
 *   Stacked on phones; from `breakpoints.sm` the image takes 2 of 3 columns,
 *   from `breakpoints.xl` 3 of 4, with the text beside it.
 * - `feature-small`: upcoming shows. Like `feature` with a smaller title and
 *   a shorter teaser; the image takes 1 of 3, then 2 of 4 columns.
 * - `card`: the Recent grid. One column: image, date, title and a grey
 *   artist line, which follows its own title directly.
 * - `row`: archive rows. Image and text side by side: 2 : 3 on phones, then
 *   image 1 column and text 2; from `breakpoints.xl` a row spans two columns,
 *   so two sit side by side. Date (always with the year, since the year
 *   heading may have scrolled away), title, mono artist line, and a
 *   three-line teaser from `breakpoints.sm` up.
 *
 * Artist lines stop after two lines in every variant. Images are cropped to
 * the aspect ratio the page queries (16:10 on /exhibitions).
 *
 * `row` shows abbreviated months on phones. `card` and `row` use `alt=""`,
 * since their image only repeats the linked title. The feature variants describe
 * the image with the Contentful asset description.
 *
 * @param {Object} props
 * @param {Object} props.exhibition - A `ContentfulExhibition` node with `slug`,
 *   `title`, `startDate`, `endDate`, `dateTbc`,
 *   `featuredImage { gatsbyImageData description }`,
 *   `subtitleShortDescription.childMarkdownRemark.html` (the artist line) and,
 *   for a teaser, `description.childMarkdownRemark.excerpt(pruneLength: 1200)`.
 *   The feature variants also show `openingHours` and `vernissageInfos` when
 *   they are queried and set.
 * @param {'feature'|'feature-small'|'card'|'row'} props.variant
 * @param {number} [props.headingLevel=3] - Level of the title heading, to fit
 *   the page's outline.
 * @param {'md'|'xl'} [props.hideBelow] - Hide the item below this `media`
 *   breakpoint.
 * @param {'md'|'xl'} [props.hideFrom] - Hide the item from this `media`
 *   breakpoint up. Both are CSS, so the server-rendered page is already
 *   right; /exhibitions uses them to show a show either as a Recent card or
 *   as an archive row, depending on the width.
 */
const ExhibitionItem = ({ exhibition, variant, headingLevel = 3, hideBelow, hideFrom }) => {
  const {
    slug,
    title,
    startDate,
    endDate,
    dateTbc,
    featuredImage,
    subtitleShortDescription,
    description,
    openingHours,
    vernissageInfos,
  } = exhibition

  const path = `/exhibition/${slug}`
  const isCompact = COMPACT_VARIANTS.includes(variant)
  const hasShortDate = SHORT_DATE_VARIANTS.includes(variant)
  const artistHtml = subtitleShortDescription?.childMarkdownRemark?.html
  const teaser = variant !== 'card' && description?.childMarkdownRemark?.excerpt
  const meta = isCompact ? [] : [openingHours, vernissageInfos].filter(Boolean)

  return (
    <Item $variant={variant} $hideBelow={hideBelow} $hideFrom={hideFrom}>
      {/* In compact variants the title link is the one to announce and tab to;
          the image link is a mouse shortcut to the same page. */}
      <ImageLink
        to={path}
        {...(isCompact && { tabIndex: -1, 'aria-hidden': true })}
      >
        <GatsbyImage
          image={withSizes(featuredImage.gatsbyImageData, IMAGE_SIZES[variant])}
          alt={isCompact ? '' : featuredImage.description || title}
        />
      </ImageLink>

      <Title as={`h${headingLevel}`} $variant={variant}>
        <Link to={path}>{title}</Link>
      </Title>

      {artistHtml && (
        <Artist
          $variant={variant}
          dangerouslySetInnerHTML={{ __html: processExternalLinks(artistHtml) }}
        />
      )}

      <ItemDate>
        <LongDate $hasShort={hasShortDate}>
          <DateRange parts={dateRangeParts(startDate, endDate, { tbc: dateTbc })} />
        </LongDate>
        {hasShortDate && (
          <ShortDate>
            <DateRange parts={dateRangeParts(startDate, endDate, { tbc: dateTbc, short: true })} />
          </ShortDate>
        )}
        {meta.map((info) => ` | ${info}`)}
      </ItemDate>

      {teaser && <Teaser $variant={variant}>{teaser}</Teaser>}
    </Item>
  )
}

export default ExhibitionItem

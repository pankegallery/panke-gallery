import React from 'react'
import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { DASH, dateRangeParts } from '../utils/formatDateRange'
import { processExternalLinks } from '../utils/processExternalLinks'
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

export { ItemGrid } from './exhibition-item/ExhibitionItem.styles'

// Variants whose images sit next to a linked title and whose dates switch to
// short months on phones (see `LongDate` / `ShortDate`).
const COMPACT_VARIANTS = ['card', 'row']

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
 * alt text.
 *
 * Variants:
 * - `feature`: the current show. Large image, feature-size title, mono artist
 *   line, date with opening hours and vernissage info, long teaser.
 * - `feature-small`: upcoming shows. Like `feature` with a smaller title and
 *   a shorter teaser.
 * - `card`: the Recent grid. Image, date, title and a grey two-line artist
 *   line. Cards must be direct children of a CSS grid such as `ItemGrid`,
 *   whose rows they share through `subgrid` (see the styles).
 * - `row`: archive rows. Image in one column; date (always with the year,
 *   since the year heading may have scrolled away), title, mono artist line,
 *   and a three-line teaser from `breakpoints.sm` up.
 *
 * `card` and `row` show abbreviated months on phones and use `alt=""`, since
 * their image only repeats the linked title. The feature variants describe
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
 */
const ExhibitionItem = ({ exhibition, variant, headingLevel = 3 }) => {
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
  const artistHtml = subtitleShortDescription?.childMarkdownRemark?.html
  const teaser = variant !== 'card' && description?.childMarkdownRemark?.excerpt
  const meta = isCompact ? [] : [openingHours, vernissageInfos].filter(Boolean)

  return (
    <Item $variant={variant}>
      {/* In compact variants the title link is the one to announce and tab to;
          the image link is a mouse shortcut to the same page. */}
      <ImageLink
        to={path}
        {...(isCompact && { tabIndex: -1, 'aria-hidden': true })}
      >
        <GatsbyImage
          image={featuredImage.gatsbyImageData}
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
        <LongDate $hasShort={isCompact}>
          <DateRange parts={dateRangeParts(startDate, endDate, { tbc: dateTbc })} />
        </LongDate>
        {isCompact && (
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

import React from 'react'
import { Link } from 'gatsby'
import { Tag as StyledTag } from './content/Content.styles'

/**
 * A rounded, outlined label for a tag or an event series.
 *
 * Props:
 * - `tag` – `{ slug, name }`; `name` is the visible label.
 * - `type` – `'eventSeries'` adds the `eventSeries` class, which picks up the
 *   page's highlight colour (see `Container` in Layout.styles.js).
 * - `to` – optional link target. With it the tag is a Gatsby `<Link>`, so it
 *   works without JavaScript and can be opened in a new tab; without it the
 *   tag is a plain label (the `<p>` from Content.styles.js).
 * - `selected` – renders the filled `tag-selected` state with a "×", used on
 *   /events/ for the series that is currently filtered by.
 * - `label` – optional accessible name, e.g. to say what clicking the link does.
 *
 * The selected state comes only from props: the caller derives it from the
 * URL, so the tag never holds a copy of it that could get out of sync.
 */
const Tag = ({ tag, type, to, selected = false, label }) => {
  const className = [
    'tag',
    type === 'eventSeries' && 'eventSeries',
    selected && 'tag-selected',
  ].filter(Boolean).join(' ')

  // Only pass `to` along with `as={Link}`: styled-components v6 forwards
  // unknown props, so a plain label would otherwise get a stray `to` attribute.
  const linkProps = to ? { as: Link, to } : {}

  return (
    <StyledTag
      {...linkProps}
      className={className}
      aria-label={label}
    >
      {tag.name}
    </StyledTag>
  )
}

export default Tag

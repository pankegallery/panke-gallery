import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { GALLERY, venueOfEvent } from '../utils/venues'

const KEYWORDS =
  'net art, Netzkunst, Galerlie, gallery, Berlin, Wedding, Sakrowski, transmediale, Kultur'

const AUTHOR = 'panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.'

// The size share previews are shown at (Facebook, Mastodon, Bluesky, Slack and
// others all crop to about 1.91:1).
const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630

/**
 * A Contentful image as a share image: cropped to 1200×630 by Contentful's
 * image API (which also scales smaller images up to that size), as a JPEG,
 * since some platforms show no preview for WebP or an animated GIF. Its
 * description becomes the alt text.
 *
 * @param {Object} asset - A Contentful asset with `url`, `mimeType` and
 *   `description`.
 * @returns {Object|undefined} The `image` prop for `<Seo>`, or nothing for a
 *   missing asset or one that isn't an image (e.g. a video).
 */
export const shareImageOf = asset => {
  if (!asset?.url || !asset.mimeType?.startsWith('image/')) return undefined
  // Asset URLs are absolute, but Contentful's own `file.url` starts with `//`.
  const url = asset.url.startsWith('//') ? `https:${asset.url}` : asset.url
  return {
    url: `${url}?w=${SHARE_IMAGE_WIDTH}&h=${SHARE_IMAGE_HEIGHT}&fit=fill&fm=jpg&q=80`,
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    alt: asset.description || undefined,
  }
}

/**
 * The first of the given Contentful text fields that has text, as plain text
 * for a description. The fields need `childMarkdownRemark { excerpt }` in the
 * page query.
 *
 * @param {...Object} fields - Contentful long-text fields, in order of preference.
 * @returns {string|undefined}
 */
export const excerptOf = (...fields) =>
  fields
    // Markdown that remark drops (e.g. a stray list dash) can leave runs of
    // spaces behind.
    .map(field => field?.childMarkdownRemark?.excerpt?.replace(/\s+/g, ' ').trim())
    .find(Boolean)

/**
 * A date and time from Contentful, which stores the time as it is in Berlin
 * without an offset ("2026-11-08T16:00"), with the offset Berlin has on that
 * day (+01:00 or +02:00), since search engines would otherwise read it as UTC.
 * A time that already has an offset is kept as it is.
 *
 * @param {string} local - Date and time as stored in Contentful.
 * @returns {string} The same time in ISO 8601 with an offset.
 */
const berlinTime = local => {
  if (/(Z|[+-]\d\d:?\d\d)$/.test(local)) return local
  // The offset at the same clock time in UTC, which differs from the one at
  // the actual moment only in the night of a daylight saving switch.
  const offset = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${local}Z`))
    .find(part => part.type === 'timeZoneName')
    .value.replace('GMT', '')
  return `${local}${offset || '+00:00'}`
}

/**
 * An exhibition as event data for `<Seo event>`: the days it runs, at the
 * gallery. Nothing while its date is to be confirmed, since search engines
 * would show a wrong date.
 *
 * @param {Object} exhibition - A Contentful exhibition with `startDate`,
 *   `endDate` and `dateTbc`.
 * @returns {Object|undefined}
 */
export const eventDataOfExhibition = ({ startDate, endDate, dateTbc }) =>
  dateTbc || !startDate
    ? undefined
    : {
        type: 'ExhibitionEvent',
        startDate: startDate.slice(0, 10),
        endDate: endDate?.slice(0, 10),
        venue: GALLERY,
      }

/**
 * An event as event data for `<Seo event>`: its start, its end unless it is
 * open-ended, and its place (/rosa for the /rosa series, otherwise the
 * gallery, see `venueOfEvent`).
 *
 * @param {Object} event - A Contentful event with `date`, `endTime`,
 *   `openEnd` and `eventSeries { slug }`.
 * @returns {Object|undefined}
 */
export const eventDataOfEvent = event =>
  event?.date
    ? {
        type: 'Event',
        startDate: berlinTime(event.date),
        endDate: event.endTime && !event.openEnd ? berlinTime(event.endTime) : undefined,
        venue: venueOfEvent(event),
      }
    : undefined

/**
 * The tags in a page's `<head>`: title, description, the site-wide keywords
 * and author, and the Open Graph and Twitter tags that make up a link's
 * preview when it's shared. Render it from a page's or template's `Head`
 * export (Gatsby's Head API). Site-wide tags that don't depend on the page,
 * such as the favicons and `<html lang>`, are set in `gatsby-ssr.js` instead.
 *
 * Share platforms don't run JavaScript, so everything here has to be in the
 * static HTML, with absolute URLs.
 *
 * @param {Object} props
 * @param {string} props.title - The page title, shown as "<title> · panke.gallery".
 * @param {string} [props.shareTitle] - The title in share previews, if it
 *   differs from `title` (e.g. the homepage, titled "Home").
 * @param {string} [props.description] - Falls back to the description of the
 *   gallery as a whole.
 * @param {string} [props.path] - The page's path, e.g. `/exhibitions/`, for
 *   its canonical URL and `og:url`. Left out on pages without a URL of their
 *   own, such as the 404 page.
 * @param {Object} [props.image] - The share image (see `shareImageOf`):
 *   `url` (absolute) and optional `alt`. Falls back to the site's default
 *   share image.
 * @param {string} [props.type] - `og:type`: `website` by default, `article`
 *   for a single exhibition, event, edition or residency.
 * @param {boolean} [props.standalone] - For pages outside the site frame (the
 *   audioguide and the print sheets): the title as given, and no default
 *   description, keywords, author or share tags, since these came from the
 *   site layout.
 * @param {Object} [props.event] - For an exhibition or event page: its dates
 *   and place (see `eventDataOfExhibition` and `eventDataOfEvent`), rendered
 *   as schema.org event data, so search engines can list it as an event.
 *   Needs `path`.
 * @param {React.ReactNode} [props.children] - Further tags for this page.
 */
const Seo = ({ title, shareTitle = title, description, path, image, type = 'website', event, standalone = false, children }) => {
  const { site } = useStaticQuery(graphql`
    query SeoSiteMetadata {
      site {
        siteMetadata {
          title
          siteUrl
          description
          image
          imageAlt
          fediverseCreator
        }
      }
    }
  `)
  const meta = site.siteMetadata

  if (standalone) {
    return (
      <>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {children}
      </>
    )
  }

  const metaDescription = description || meta.description
  const url = path && `${meta.siteUrl}${path}`
  const shareImage = image || {
    url: `${meta.siteUrl}${meta.image}`,
    alt: meta.imageAlt,
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
  }

  const eventData = event && url && {
    '@context': 'https://schema.org',
    '@type': event.type,
    name: shareTitle,
    description: metaDescription,
    url,
    image: [shareImage.url],
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue.name,
      url: `${meta.siteUrl}${event.venue.path}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.venue.streetAddress,
        postalCode: event.venue.postalCode,
        addressLocality: event.venue.locality,
        addressCountry: 'DE',
      },
    },
    organizer: { '@type': 'Organization', name: meta.title, url: meta.siteUrl },
  }

  return (
    <>
      <title>{`${title} · ${meta.title}`}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="author" content={AUTHOR} />
      {url && <link rel="canonical" href={url} />}

      <meta property="og:site_name" content={meta.title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={shareTitle} />
      <meta property="og:description" content={metaDescription} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={shareImage.url} />
      {shareImage.width && <meta property="og:image:width" content={shareImage.width} />}
      {shareImage.height && <meta property="og:image:height" content={shareImage.height} />}
      {shareImage.alt && <meta property="og:image:alt" content={shareImage.alt} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={shareTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={shareImage.url} />
      {shareImage.alt && <meta name="twitter:image:alt" content={shareImage.alt} />}

      {/* Mastodon names the account as the author under a shared link. */}
      <meta name="fediverse:creator" content={meta.fediverseCreator} />

      {/* Set as HTML, since React would escape the quotes. "<" is escaped so
          that no text from Contentful can close the script early. */}
      {eventData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData).replace(/</g, '\\u003c') }}
        />
      )}
      {children}
    </>
  )
}

export default Seo

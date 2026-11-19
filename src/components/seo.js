import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

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
 * @param {React.ReactNode} [props.children] - Further tags for this page.
 */
const Seo = ({ title, shareTitle = title, description, path, image, type = 'website', standalone = false, children }) => {
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
      {children}
    </>
  )
}

export default Seo

import React from 'react'

const SITE_NAME = 'panke.gallery'

const DEFAULT_DESCRIPTION =
  'panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.'

const KEYWORDS =
  'net art, Netzkunst, Galerlie, gallery, Berlin, Wedding, Sakrowski, transmediale, Kultur'

const AUTHOR = 'panke.gallery – Verein für künstlerisch-kulturelle Bildung e.V.'

/**
 * The tags in a page's `<head>`: title, description and the site-wide
 * keywords and author. Render it from a page's or template's `Head` export
 * (Gatsby's Head API). Site-wide tags that don't depend on the page, such as
 * the favicons and `<html lang>`, are set in `gatsby-ssr.js` instead.
 *
 * @param {Object} props
 * @param {string} props.title - The page title, shown as "<title> · panke.gallery".
 * @param {string} [props.description] - Falls back to the description of the
 *   gallery as a whole.
 * @param {boolean} [props.standalone] - For pages outside the site frame (the
 *   audioguide and the print sheets): the title as given, and no default
 *   description, keywords or author, since these came from the site layout.
 * @param {React.ReactNode} [props.children] - Further tags for this page.
 */
const Seo = ({ title, description, standalone = false, children }) => {
  const metaDescription = description || (standalone ? null : DEFAULT_DESCRIPTION)

  return (
    <>
      <title>{standalone ? title : `${title} · ${SITE_NAME}`}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {!standalone && <meta name="keywords" content={KEYWORDS} />}
      {!standalone && <meta name="author" content={AUTHOR} />}
      {children}
    </>
  )
}

export default Seo

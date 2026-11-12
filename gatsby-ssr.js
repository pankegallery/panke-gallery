// Site-wide parts of the static HTML that don't depend on the page. A page's
// own title and description come from its `Head` export (`<Seo>`).
import React from 'react'

const favicons = [
  <link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />,
  <link key="icon-32" rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />,
  <link key="icon-16" rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />,
  <link key="manifest" rel="manifest" href="/favicons/site.webmanifest" />,
  <link key="mask-icon" rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#5bbad5" />,
  <link key="shortcut-icon" rel="shortcut icon" href="/favicons/favicon.ico" />,
  <meta key="msapplication-TileColor" name="msapplication-TileColor" content="#2b5797" />,
  <meta key="msapplication-config" name="msapplication-config" content="/favicons/browserconfig.xml" />,
  <meta key="theme-color" name="theme-color" content="#ffffff" />,
]

export const onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  // The site is English only (#63). German text, should it come back, gets
  // its own `lang="de"`.
  setHtmlAttributes({ lang: 'en' })
  setHeadComponents(favicons)
}

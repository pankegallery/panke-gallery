let contentfulConfig;

// Force-override process.env with .env.{NODE_ENV}'s values, rather than
// dotenv.config()'s own precedence rule (skip any key already present in
// process.env) — Netlify CLI pre-populates process.env for local `netlify
// build`/`netlify dev` before this file ever runs, including a redacted
// placeholder in place of any variable marked "secret" on Netlify's
// dashboard (real content, literal asterisks and all — not just masked
// display). dotenv does have an `override` option for exactly this, but the
// installed version here is 8.6.0, which predates that option (added in
// v16) and silently ignores it — so this bypasses dotenv.config() and does
// the override manually via dotenv.parse() + Object.assign instead.
const fs = require('fs')
const path = require('path')
const adapter = require('gatsby-adapter-netlify').default
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
if (fs.existsSync(envPath)) {
  Object.assign(process.env, require('dotenv').parse(fs.readFileSync(envPath)))
}


try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful')
} catch (_) {}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || (contentfulConfig && contentfulConfig.spaceId),
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || (contentfulConfig && contentfulConfig.accessToken),
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.'
  )
}

module.exports = {
  // Gatsby's own Netlify adapter writes the redirects and headers for the
  // deploy, including the security headers gatsby-plugin-netlify used to add
  // (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection).
  // Don't add @netlify/plugin-gatsby or gatsby-plugin-netlify next to it: they
  // do the same job, and Gatsby stops the build on the mismatch.
  adapter: adapter(),
  // Read by <Seo> (src/components/seo.js) for every page's head and share
  // preview.
  siteMetadata: {
    title: 'panke.gallery',
    // Share previews need absolute URLs.
    siteUrl: 'https://www.panke.gallery',
    description: 'panke.gallery seeks to open up a dialogue between established and emerging artists whose work comes out of the connections between digital or net-based art and club culture, especially in the recent history of Berlin. Its program of exhibitions and events takes place in a gallery space within the premises of panke.club.',
    // The share image of pages without an image of their own, 1200×630 px.
    image: '/share-image.png',
    imageAlt: 'panke.gallery',
    fediverseCreator: '@pankegallery@tldr.nettime.org'
  },
  pathPrefix: '/panke-gallery',
  plugins: [
    'gatsby-transformer-remark',
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        // icon: `src/favicons/favicon.ico`,
        // icons: [
        //   {
        //     src: `favicons/favicon-16x16.png`,
        //     sizes: `16x16`,
        //     type: `image/png`,
        //   },
        //   {
        //     src: `favicons/favicon-32x32.png`,
        //     sizes: `32x32`,
        //     type: `image/png`,
        //   },
        //   {
        //     src: `favicons/apple-touch-icon.png`,
        //     sizes: `180x180`,
        //     type: `image/png`,
        //   },
        // ],
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `blurred`,
          quality: 100,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        },
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-image',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    }
  ]
}

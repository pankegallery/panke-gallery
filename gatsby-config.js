let contentfulConfig;

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})


try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful')
} catch (_) {}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.'
  )
}

module.exports = {
  siteMetadata: {
    title: 'panke.gallery'
  },
  pathPrefix: '/panke-gallery',
  plugins: [
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
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
    {
      resolve: `gatsby-plugin-sass`,
      options: {
          implementation: require('sass')
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: '2',
        matomoUrl: 'https://piwik.wunderjewel.de',
        siteUrl: 'https://www.panke.gallery'
      }
    },
    'gatsby-plugin-netlify'
  ]
}

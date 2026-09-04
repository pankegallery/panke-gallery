const Promise = require('bluebird')
const path = require('path')

// The site is built without `--prefix-paths` (see the `build` script in
// package.json), so the configured `pathPrefix` in gatsby-config.js is not
// applied to production URLs — pages live at panke.gallery/guide/03, not
// panke.gallery/panke-gallery/guide/03. QR codes must encode the former.
const SITE_URL = process.env.SITE_URL || 'https://www.panke.gallery'

exports.sourceNodes = require('./gatsby/source-baserow.js').sourceNodes

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const exhibition = path.resolve('./src/templates/exhibition.js');
    const event = path.resolve('./src/templates/event.js');
    const edition = path.resolve('./src/templates/edition.js');
    const guideStop = path.resolve('./src/templates/guide-stop.js');
    resolve(
      graphql(
        `
          {
            allContentfulExhibition {
              edges {
                node {
                  slug
                }
              }
            }
            allContentfulEvent {
              edges {
                node {
                  slug
                }
              }
            }
            allContentfulEdition {
              edges {
                node {
                  slug
                }
              }
            }
            allAudioguideStop {
              edges {
                node {
                  referenceNumber
                }
              }
            }
          }`
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const exhibitions = result.data.allContentfulExhibition.edges;
        const events = result.data.allContentfulEvent.edges;
        const editions = result.data.allContentfulEdition.edges;
        const guideStops = result.data.allAudioguideStop.edges;

        exhibitions.forEach((entry, index) => {
          createPage({
            path: `/exhibition/${entry.node.slug}/`,
            component: exhibition,
            context: {
              slug: entry.node.slug
            },
          })
        })

        events.forEach((entry, index) => {
          createPage({
            path: `/event/${entry.node.slug}/`,
            component: event,
            context: {
              slug: entry.node.slug
            },
          })
        })

        editions.forEach((entry, index) => {
          createPage({
            path: `/edition/${entry.node.slug}/`,
            component: edition,
            context: {
              slug: entry.node.slug
            },
          })
        })

        guideStops.forEach((entry, index) => {
          createPage({
            path: `/guide/${entry.node.referenceNumber}/`,
            component: guideStop,
            context: {
              referenceNumber: entry.node.referenceNumber
            },
          })
        })

      })
    )

  })
}

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  var todayDate = new Date().toISOString()


  deletePage(page)
  // You can access the variable "house" in your page queries now
  createPage({
    ...page,
    context: {
      ...page.context,
      today: todayDate,
    },
  })

  createPage({
    path: `/events/:series`,
    matchPath: `/events/:series`,
    component: path.resolve(`./src/pages/events.js`),
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  createTypes(`
    type ContentfulEvent implements Node {
      rsvpCapacity: Int
      rsvpDeadline: Date @dateformat
    }

    type AudioguideStop implements Node {
      referenceNumber: String!
      artworkName: String!
      artist: String
      description: String
      audioUrl: String
      exhibitionSlug: String
      transcript: String
      pageUrl: String
      qrCodeSvg: String
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  const QRCode = require('qrcode')

  createResolvers({
    AudioguideStop: {
      pageUrl: {
        resolve: source => `${SITE_URL}/guide/${source.referenceNumber}/`,
      },
      qrCodeSvg: {
        resolve: source =>
          QRCode.toString(`${SITE_URL}/guide/${source.referenceNumber}/`, {
            type: 'svg',
            margin: 1,
          }),
      },
    },
  })
}

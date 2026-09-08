const Promise = require('bluebird')
const path = require('path')

// The site is built without `--prefix-paths` (see the `build` script in
// package.json), so the configured `pathPrefix` in gatsby-config.js is not
// applied to production URLs — pages live at panke.gallery/guide/{slug}/03,
// not panke.gallery/panke-gallery/guide/{slug}/03. QR codes must encode the former.
const SITE_URL = process.env.SITE_URL || 'https://www.panke.gallery'

exports.sourceNodes = require('./gatsby/source-baserow.js').sourceNodes

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const exhibition = path.resolve('./src/templates/exhibition.js');
    const event = path.resolve('./src/templates/event.js');
    const edition = path.resolve('./src/templates/edition.js');
    const guideStop = path.resolve('./src/templates/guide-stop.js');
    const guideExhibition = path.resolve('./src/templates/guide-exhibition.js');
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
                  exhibitionSlug
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

        // referenceNumber is only unique per exhibition (it's the number on the
        // physical wall label, restarting for each show), so pages are keyed
        // by (exhibitionSlug, referenceNumber) — not by referenceNumber alone.
        const seenGuideStopKeys = new Set()

        guideStops.forEach((entry, index) => {
          const { referenceNumber, exhibitionSlug } = entry.node

          if (!exhibitionSlug) {
            console.warn(
              `Audioguide: skipping guide page for reference number "${referenceNumber}" — missing exhibitionSlug.`
            )
            return
          }

          const key = `${exhibitionSlug}/${referenceNumber}`

          if (seenGuideStopKeys.has(key)) {
            console.warn(
              `Audioguide: duplicate reference number "${referenceNumber}" for exhibition "${exhibitionSlug}" — only the first matching row got a page.`
            )
            return
          }

          seenGuideStopKeys.add(key)

          createPage({
            path: `/guide/${exhibitionSlug}/${referenceNumber}/`,
            component: guideStop,
            context: {
              exhibitionSlug,
              referenceNumber,
            },
          })
        })

        // One overview page per exhibition that has at least one guide stop,
        // pulling the exhibition's own title/dates in from Contentful.
        const contentfulExhibitionSlugs = new Set(exhibitions.map(entry => entry.node.slug))
        const guideExhibitionSlugs = new Set(
          guideStops.map(entry => entry.node.exhibitionSlug).filter(Boolean)
        )

        guideExhibitionSlugs.forEach(slug => {
          if (!contentfulExhibitionSlugs.has(slug)) {
            console.warn(
              `Audioguide: exhibitionSlug "${slug}" doesn't match any Contentful Exhibition slug — /guide/${slug}/ will build but won't show the exhibition's title/dates. Check it's an exact copy of that Exhibition's slug field.`
            )
          }

          createPage({
            path: `/guide/${slug}/`,
            component: guideExhibition,
            context: {
              exhibitionSlug: slug,
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
      artworkImage: String
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
        resolve: source =>
          `${SITE_URL}/guide/${source.exhibitionSlug}/${source.referenceNumber}/`,
      },
      qrCodeSvg: {
        resolve: source =>
          QRCode.toString(
            `${SITE_URL}/guide/${source.exhibitionSlug}/${source.referenceNumber}/`,
            {
              type: 'svg',
              margin: 1,
            }
          ),
      },
    },
  })
}

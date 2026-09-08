const Promise = require('bluebird')
const path = require('path')

// The site is built without `--prefix-paths` (see the `build` script in
// package.json), so the configured `pathPrefix` in gatsby-config.js is not
// applied to production URLs — pages live at panke.gallery/guide/{slug}/03,
// not panke.gallery/panke-gallery/guide/{slug}/03. QR codes must encode the former.
const SITE_URL = process.env.SITE_URL || 'https://www.panke.gallery'

// Stops with no exhibitionSlug in Baserow (e.g. a piece that isn't tied to
// any temporary show) are filed under this reserved bucket instead of being
// dropped. Picked to read plainly in a URL — rename freely, nothing's been
// printed yet — but keep it in sync with the same constant in
// src/components/guide-stop-list.js, src/templates/guide-exhibition.js and
// src/templates/codes-exhibition.js if it ever changes.
const UNASSIGNED_EXHIBITION_SLUG = 'stop'

exports.sourceNodes = require('./gatsby/source-baserow.js').sourceNodes

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const exhibition = path.resolve('./src/templates/exhibition.js');
    const event = path.resolve('./src/templates/event.js');
    const edition = path.resolve('./src/templates/edition.js');
    const guideStop = path.resolve('./src/templates/guide-stop.js');
    const guideExhibition = path.resolve('./src/templates/guide-exhibition.js');
    const codesExhibition = path.resolve('./src/templates/codes-exhibition.js');
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
        // Stops with no exhibitionSlug are filed under UNASSIGNED_EXHIBITION_SLUG
        // instead of being dropped, so they still get a working page.
        const seenGuideStopKeys = new Set()

        guideStops.forEach((entry, index) => {
          const { referenceNumber } = entry.node
          const rawExhibitionSlug = entry.node.exhibitionSlug
          const hasExhibition = Boolean(rawExhibitionSlug)
          const exhibitionSlug = rawExhibitionSlug || UNASSIGNED_EXHIBITION_SLUG

          if (!hasExhibition) {
            console.warn(
              `Audioguide: reference number "${referenceNumber}" has no exhibitionSlug — filed under /guide/${UNASSIGNED_EXHIBITION_SLUG}/.`
            )
          }

          const key = `${exhibitionSlug}/${referenceNumber}`

          if (seenGuideStopKeys.has(key)) {
            console.warn(
              hasExhibition
                ? `Audioguide: duplicate reference number "${referenceNumber}" for exhibition "${exhibitionSlug}" — only the first matching row got a page.`
                : `Audioguide: duplicate reference number "${referenceNumber}" among stops with no exhibitionSlug — only the first matching row got a page.`
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
              // The actual stored value to query by — an unassigned stop's
              // AudioguideStop node has exhibitionSlug: "", not "stop",
              // so the page query can't filter on the bucket name above.
              rawExhibitionSlug,
            },
          })
        })

        // One overview page and one print sheet per exhibition that has at
        // least one guide stop (plus the fallback bucket, if used), pulling
        // the exhibition's own title in from Contentful where available.
        // exhibitionSlugValues is how each page's own query finds its stops —
        // the fallback bucket's stops are stored with an empty exhibitionSlug,
        // not the literal bucket name, so its query can't just do `eq: slug`.
        const contentfulExhibitionSlugs = new Set(exhibitions.map(entry => entry.node.slug))
        const guideExhibitionSlugs = new Set(
          guideStops.map(entry => entry.node.exhibitionSlug || UNASSIGNED_EXHIBITION_SLUG)
        )

        guideExhibitionSlugs.forEach(slug => {
          if (slug !== UNASSIGNED_EXHIBITION_SLUG && !contentfulExhibitionSlugs.has(slug)) {
            console.warn(
              `Audioguide: exhibitionSlug "${slug}" doesn't match any Contentful Exhibition slug — /guide/${slug}/ will build but won't show the exhibition's title/dates. Check it's an exact copy of that Exhibition's slug field.`
            )
          }

          const context = {
            exhibitionSlug: slug,
            exhibitionSlugValues: slug === UNASSIGNED_EXHIBITION_SLUG ? [''] : [slug],
          }

          createPage({
            path: `/guide/${slug}/`,
            component: guideExhibition,
            context,
          })

          createPage({
            path: `/codes/${slug}/`,
            component: codesExhibition,
            context,
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

    type ContentfulExhibition implements Node {
      audioguideOverviewUrl: String
      audioguideOverviewQrCodeSvg: String
    }

    type Query {
      audioguideUnassignedOverviewUrl: String
      audioguideUnassignedOverviewQrCodeSvg: String
    }
  `)
}

exports.createResolvers = ({ createResolvers }) => {
  const QRCode = require('qrcode')
  const qrCodeSvgFor = url => QRCode.toString(url, { type: 'svg', margin: 1 })

  createResolvers({
    AudioguideStop: {
      pageUrl: {
        resolve: source =>
          `${SITE_URL}/guide/${source.exhibitionSlug || UNASSIGNED_EXHIBITION_SLUG}/${source.referenceNumber}/`,
      },
      qrCodeSvg: {
        resolve: source =>
          qrCodeSvgFor(
            `${SITE_URL}/guide/${source.exhibitionSlug || UNASSIGNED_EXHIBITION_SLUG}/${source.referenceNumber}/`
          ),
      },
    },
    // A QR code for the exhibition's own audioguide overview page (as opposed
    // to one specific stop) — for signage at the entrance of a show, or the
    // top of its print sheet.
    ContentfulExhibition: {
      audioguideOverviewUrl: {
        resolve: source => `${SITE_URL}/guide/${source.slug}/`,
      },
      audioguideOverviewQrCodeSvg: {
        resolve: source => qrCodeSvgFor(`${SITE_URL}/guide/${source.slug}/`),
      },
    },
    // Same, for the fallback bucket — it has no ContentfulExhibition node to
    // hang a resolver off, so this is exposed as a root field instead.
    Query: {
      audioguideUnassignedOverviewUrl: {
        resolve: () => `${SITE_URL}/guide/${UNASSIGNED_EXHIBITION_SLUG}/`,
      },
      audioguideUnassignedOverviewQrCodeSvg: {
        resolve: () => qrCodeSvgFor(`${SITE_URL}/guide/${UNASSIGNED_EXHIBITION_SLUG}/`),
      },
    },
  })
}

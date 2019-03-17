const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const exhibition = path.resolve('./src/templates/exhibition.js');
    const event = path.resolve('./src/templates/event.js');
    const edition = path.resolve('./src/templates/edition.js');
    resolve(
      graphql(
        `
          {
            allContentfulExhibition {
              edges {
                node {
                  title
                  slug
                }
              }
            }
            allContentfulEvent {
              edges {
                node {
                  title
                  slug
                }
              }
            }
            allContentfulEdition {
              edges {
                node {
                  title
                  slug
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

      })
    )

  })
}

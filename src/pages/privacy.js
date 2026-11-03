import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import ContentBlock from '../components/content-block'

// The first sections of the text ("Who is responsible", "In short") stand
// in rows of their own, labelled with their heading; the rest of the
// policy follows under the block's title.
const LEAD_SECTIONS = 2

// A `###` heading in the markdown HTML and the text up to the next one.
const SECTION_START = /(?=<h3[\s>])/
const SECTION_HEADING = /^<h3[^>]*>([\s\S]*?)<\/h3>\s*/

/**
 * Splits the leading `###` sections off the policy, so each can be a row.
 * Text before the first heading stays with the rest.
 *
 * @param {string} html - The block's markdown HTML.
 * @param {number} count - How many sections to split off.
 * @returns {{lead: {title: string, html: string}[], rest: string}}
 */
const splitLeadSections = (html, count) => {
  const parts = html.split(SECTION_START)
  const before = SECTION_HEADING.test(parts[0]) ? '' : parts.shift()
  const lead = parts.slice(0, count).map((part) => {
    const [heading, title] = part.match(SECTION_HEADING)
    // The label is plain text; headings in this text carry no markup.
    return { title: title.replace(/<[^>]+>/g, ''), html: part.slice(heading.length) }
  })
  return { lead, rest: before + parts.slice(count).join('') }
}

/**
 * /privacy/: the privacy policy. Its text is the "privacy-policy" block in
 * Contentful, so legal updates are content edits like the imprint on
 * /contact/ (#61). Subheadings in the text are `###` (h3); the first
 * LEAD_SECTIONS of them become rows of their own, so there is still only
 * one block to edit.
 *
 * @param {Object} props
 * @param {Object} props.data - Page query result: the "privacy-policy" block.
 */
const PankePrivacy = ({ data }) => {
  const block = data.contentfulContentBlock
  const html = block?.blockContent?.childMarkdownRemark?.html
  const { lead, rest } = html ? splitLeadSections(html, LEAD_SECTIONS) : { lead: [], rest: '' }

  return (
    <Layout>
      <Helmet
        title="Privacy Policy"
        meta={[
          {
            name: 'description',
            content: 'How panke.gallery handles personal data: hosting, images, cookie-free visitor statistics, newsletter, event RSVPs and your rights under the GDPR.'
          }
        ]}
      />
      {lead.map(({ title, html: sectionHtml }) => (
        <ContentBlock key={title} blockTitle={title} html={sectionHtml} />
      ))}
      {rest && <ContentBlock blockTitle={block.title} html={rest} />}
    </Layout>
  )
}

export default PankePrivacy

export const pageQuery = graphql`
  query PankePrivacyQuery {
    contentfulContentBlock(slug: { eq: "privacy-policy" }) {
      title
      blockContent {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`

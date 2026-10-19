import React from 'react'
import { processExternalLinks } from '../utils/processExternalLinks'
import { useLinkedEmails } from '../utils/email-address'
import { Row, Col } from './layout/Layout.styles'
import { FurtherSection } from './content/Content.styles'

// A <script> pasted into Contentful would run on a direct page load (it is
// part of the server-rendered HTML) but not after client-side navigation,
// and would load third-party code without consent (#58, #60). Scripts never
// belong in content, so they are dropped here.
const stripScripts = (html) => html && html.replace(/<script[\s\S]*?<\/script>/gi, '')

/**
 * Contentful markdown HTML on its own, for pages that lay out their blocks
 * themselves. Drops scripts, marks external links and, after hydration,
 * turns `name [at] domain` into a mailto link (#62).
 *
 * @param {object} props
 * @param {string} [props.html] - `blockContent.childMarkdownRemark.html`.
 */
export const ContentHtml = ({ html }) => {
  const ref = useLinkedEmails(html)

  if (!html) return null

  return <div ref={ref} dangerouslySetInnerHTML={{
    __html: processExternalLinks(stripScripts(html))
  }} />
}

/**
 * Two-column content section: title on the left, Contentful markdown on the
 * right.
 *
 * @param {object} props
 * @param {string} props.blockTitle - Section title.
 * @param {object} [props.blockContent] - Contentful long text with `childMarkdownRemark.html`.
 * @param {React.ReactNode} [props.children] - Extra content below the text, e.g. a form.
 */
const ContentBlock = ({ blockTitle, blockContent, children }) => (
  <FurtherSection className="further">
    <Row>
      <Col $md={4} $sm={4} $xs={12}>
        <h2>{blockTitle}</h2>
      </Col>
      <Col $md={8} $sm={8} $xs={12}>
        <ContentHtml html={blockContent?.childMarkdownRemark?.html} />
        {children}
      </Col>
    </Row>
  </FurtherSection>
)

export default ContentBlock

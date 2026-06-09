import React from 'react'
import { processExternalLinks } from '../utils/processExternalLinks'
import { Row, Col } from './layout/Layout.styles'
import { FurtherSection } from './content/Content.styles'

const ContentBlock = ({ blockTitle, blockContent }) => (
  <FurtherSection className="further">
    <Row>
      <Col $md={4} $sm={4} $xs={12}>
        <h2>{blockTitle}</h2>
      </Col>
      <Col $md={8} $sm={8} $xs={12}>
        {<div dangerouslySetInnerHTML={{
          __html: processExternalLinks(blockContent.childMarkdownRemark.html)
        }} />}
      </Col>
    </Row>
  </FurtherSection>
)

export default ContentBlock

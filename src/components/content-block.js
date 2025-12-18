import React from 'react'
import { processExternalLinks } from '../utils/processExternalLinks'

const ContentBlock = ({ blockTitle, blockContent }) => (
        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
                      <h2>{blockTitle}</h2>
                  </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<div dangerouslySetInnerHTML={{
                __html: processExternalLinks(blockContent.childMarkdownRemark.html)
              }} />}
          </div>
          </div>
        </section>
)

export default ContentBlock

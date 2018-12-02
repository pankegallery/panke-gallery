import React from 'react'

export default ({ blockTitle, blockContent }) => (
        <section className="further">
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-12">
                      <h2>{blockTitle}</h2>
                  </div>
            <div className="col-md-8 col-sm-8 col-xs-12">
              {<p dangerouslySetInnerHTML={{
                __html: blockContent.childMarkdownRemark.html
              }} />}
          </div>
          </div>
        </section>
)

import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'

const DocumentationImages = ({images }) => (

  <section className="further">
    <div className="col-md-12 col-xs-12">

      {images.map(({fluid, description}) => {
        return (
          <div className="image-wrapper 3col">
            <GatsbyImage alt="FeaturedImage" image={fluid} aspectratio={16/9}  />
          </div>
        )
      })}
    </div>
  </section>

)
export default DocumentationImages

import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { FurtherSection } from './content/Content.styles'

const DocumentationImages = ({images }) => (

  <FurtherSection>
    {images.map(({gatsbyImageData, description}) => {
        return (
          <div className="image-wrapper 3col">
            <GatsbyImage alt="FeaturedImage" image={gatsbyImageData} aspectratio={16/9}  />
            <p className="meta mt-2 ">{description}</p>
          </div>
        )
      })}
  </FurtherSection>


)
export default DocumentationImages
  
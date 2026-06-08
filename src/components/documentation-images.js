import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { FurtherSection, Meta } from './content/Content.styles'

const DocumentationImages = ({images }) => (

  <FurtherSection>
    {images.map(({gatsbyImageData, description}) => {
        return (
          <div className="image-wrapper 3col">
            <GatsbyImage alt={description} image={gatsbyImageData} aspectratio={16/9}  />
            <Meta style={{ marginTop: '0.5em'}}>{description}</Meta>
          </div>
        )
      })}
  </FurtherSection>
)
export default DocumentationImages
  
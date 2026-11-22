import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import {
  DocumentationRows,
  DocumentationFigure,
  DocumentationCaption
} from './documentation-images/DocumentationImages.styles'

/**
 * The documentation images at the end of an exhibition or event page, as
 * justified rows (#6): the images of a row share one height and fill the
 * width together. They keep their upload order and are never cropped, so
 * portraits and landscapes can be mixed in any order.
 *
 * @param {Object} props
 * @param {Object[]} props.images - Contentful images with `gatsbyImageData`
 *   (its `width` and `height` give the aspect ratio) and an optional
 *   `description`, shown as caption and used as alt text.
 */
const DocumentationImages = ({ images }) => (
  <DocumentationRows>
    {images
      .filter(image => image?.gatsbyImageData)
      .map(({ gatsbyImageData, description }, index) => (
        <DocumentationFigure
          key={index}
          $ratio={gatsbyImageData.width / gatsbyImageData.height}
        >
          <GatsbyImage alt={description || ''} image={gatsbyImageData} />
          {description && <DocumentationCaption>{description}</DocumentationCaption>}
        </DocumentationFigure>
      ))}
  </DocumentationRows>
)

export default DocumentationImages

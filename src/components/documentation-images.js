import React, { useMemo } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { theme } from '../theme/theme'
import { planDocumentationRows } from '../utils/plan-documentation-rows'
import {
  DocumentationRows,
  DocumentationRow,
  DocumentationFigure,
  DocumentationCaption
} from './documentation-images/DocumentationImages.styles'

// The plan is made for the full content column, at the page grid's gap.
const PLAN_OPTIONS = {
  ...theme.grid.documentationRows.plan,
  width: parseFloat(theme.container.maxWidth),
  gap: parseFloat(theme.spacing.gutter)
}

/**
 * The documentation images at the end of an exhibition or event page, as
 * justified rows (#6): the images of a row share one height and fill the
 * width together, and are never cropped. Which images share a row on
 * desktop, and their order everywhere, comes from `planDocumentationRows`,
 * worked out from the aspect ratios when the page is rendered. It keeps the
 * upload order unless moving an image clearly gives better rows, such as a
 * lone portrait joining another one. The sizes are all CSS.
 *
 * @param {Object} props
 * @param {Object[]} props.images - Contentful images with `gatsbyImageData`
 *   (its `width` and `height` give the aspect ratio) and an optional
 *   `description`, shown as caption and used as alt text.
 */
const DocumentationImages = ({ images }) => {
  // `images` comes from the page query, so this runs once per page.
  const { shown, ratios, rows } = useMemo(() => {
    const shown = images.filter(image => image?.gatsbyImageData)
    const ratios = shown.map(({ gatsbyImageData }) => gatsbyImageData.width / gatsbyImageData.height)
    return { shown, ratios, rows: planDocumentationRows(ratios, PLAN_OPTIONS) }
  }, [images])

  return (
    <DocumentationRows>
      {rows.map((row, rowIndex) => (
        <DocumentationRow key={row.join()}>
          {row.map(index => {
            const { gatsbyImageData, description } = shown[index]
            return (
              <DocumentationFigure
                key={index}
                $ratio={ratios[index]}
                $isLastRow={rowIndex === rows.length - 1}
              >
                <GatsbyImage alt={description || ''} image={gatsbyImageData} />
                {description && <DocumentationCaption>{description}</DocumentationCaption>}
              </DocumentationFigure>
            )
          })}
        </DocumentationRow>
      ))}
    </DocumentationRows>
  )
}

export default DocumentationImages

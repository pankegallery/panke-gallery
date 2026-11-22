import styled from 'styled-components';
import { media } from '../../theme/theme';
import { FurtherSection, Meta } from '../content/Content.styles';

// Justified rows (#6): the images of a row share one height and together
// fill the width, in upload order and uncropped. Each image starts at the
// target row height (flex-basis = aspect ratio × target) and grows in
// proportion to its aspect ratio (flex-grow = aspect ratio), so every image
// in a row grows to the same height. Pure CSS, no layout script.
export const DocumentationRows = styled(FurtherSection)`
  --row-height: ${props => props.theme.grid.documentationRows.target.sm};
  --row-max: ${props => props.theme.grid.documentationRows.max.sm};

  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  /* Column gap as in the page grid; the wider row gap keeps each caption
     with its own image rather than the row below. */
  gap: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.md};

  ${media.md} {
    --row-height: ${props => props.theme.grid.documentationRows.target.md};
    --row-max: ${props => props.theme.grid.documentationRows.max.md};
    column-gap: ${props => props.theme.spacing.gutter};
  }

  ${media.lg} {
    --row-height: ${props => props.theme.grid.documentationRows.target.lg};
  }
`;

// One image with its caption. `$ratio` (width / height) goes into a custom
// property through `style`, so each aspect ratio doesn't create a class.
// The max-width caps the height at `--row-max`: a row that can't fill the
// width (the last one, or a lone landscape) stops there instead of
// growing to the full width.
export const DocumentationFigure = styled.figure.attrs(({ $ratio }) => ({
  style: { '--ratio': $ratio }
}))`
  margin: 0;
  min-width: 0;
  flex-grow: var(--ratio);
  flex-shrink: 1;
  flex-basis: calc(var(--ratio) * var(--row-height));
  max-width: calc(var(--ratio) * var(--row-max));

  .gatsby-image-wrapper {
    display: block;
    width: 100%;
  }
`;

export const DocumentationCaption = styled(Meta).attrs({ as: 'figcaption' })`
  margin: ${props => props.theme.spacing.xs} 0 0;
`;

import styled, { css } from 'styled-components';
import { media } from '../../theme/theme';
import { ItemDate, Subline as ItemSubline, Title } from '../content/Item.styles';

// Lines of the event subline before it is cut off. Event sublines are
// short descriptions, so they get one line more than the shared `Subline`.
const SUBLINE_LINES = 3;

// The subline in Roboto, as in the Recent grid: mono is kept for sublines
// next to exhibition teasers.
export const Subline = styled(ItemSubline)`
  -webkit-line-clamp: ${SUBLINE_LINES};
  line-clamp: ${SUBLINE_LINES};
`;

// Holds the series tag above the title link's click area, so the tag stays
// a link of its own (to the series on /events/).
export const SeriesTag = styled.div`
  position: relative;
  z-index: 1;
  justify-self: start;
  /* A long series name ends in "…" (see Tag) instead of widening the row. */
  max-width: 100%;

  > * { margin-top: 0; }
`;

// One event row, a direct child of the page `Grid` (Layout.styles.js).
// Stacked on phones, date first. From `breakpoints.sm` the row takes the page
// columns over with `subgrid`: the date in the first column, title, subline
// and series tag in the next two, the same edges as the exhibition text and
// the intro/Visit row. From `breakpoints.xl` the text stays two columns wide.
// The DOM puts the title first, so screen readers meet the heading first.
// The thumbnail of a row with `$withImage`. Not a link of its own: the
// title link covers the whole row.
export const EventImage = styled.div`
  display: block;
`;

// A row with a thumbnail (`$withImage`, the upcoming event on /rosa) is laid
// out like an archive row on /exhibitions: the image takes the first column,
// where the date sits otherwise, and date, title, subline and tag follow
// next to it, date on top as in the exhibition items. On phones image and
// text sit side by side, 2 : 3. The last grid row (`1fr`) takes up the rest
// of the image height.
// Each part gets its column and row again in every media query, by its own
// selector: the plain row's rules above use `*` and `:not()`, which would
// otherwise win or lose depending on the order the media queries end up in.
const textColumns = (columns) => css`
  > ${ItemDate} { grid-column: ${columns}; grid-row: 1; }
  > ${Title} { grid-column: ${columns}; grid-row: 2; }
  > ${Subline} { grid-column: ${columns}; grid-row: 3; }
  > ${SeriesTag} { grid-column: ${columns}; grid-row: 4; }
`;

const withImage = ({ theme }) => css`
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  grid-template-rows: auto auto auto auto 1fr;
  column-gap: ${theme.spacing.sm};

  > ${EventImage} { grid-column: 1; grid-row: 1 / -1; }
  ${textColumns('2')}

  ${media.md} {
    grid-template-columns: subgrid;
    /* "normal" on a subgrid uses the page grid's gap. */
    column-gap: normal;

    > ${EventImage} { grid-column: 1; grid-row: 1 / -1; }
    ${textColumns('2 / -1')}
  }

  ${media.xl} {
    > ${EventImage} { grid-column: 1; grid-row: 1 / -1; }
    ${textColumns('2 / span 2')}
  }
`;

export const EventRow = styled.article`
  /* Holds the title link's click area, which covers the whole row. */
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  /* One column on phones that may shrink below its content, so a long
     series tag can't widen the page. */
  grid-template-columns: minmax(0, 1fr);
  row-gap: ${props => props.theme.spacing.xxs};
  align-content: start;
  overflow-wrap: anywhere;

  > ${ItemDate} { grid-row: 1; }
  > ${Title} { grid-row: 2; }
  > ${Subline} { grid-row: 3; }
  > ${SeriesTag} { grid-row: 4; }

  ${media.md} {
    grid-template-columns: subgrid;

    > * { grid-column: 2 / -1; }
    > ${ItemDate} { grid-column: 1; grid-row: 1 / span 3; }
    > ${Title} { grid-row: 1; }
    > ${Subline} { grid-row: 2; }
    > ${SeriesTag} { grid-row: 3; }
  }

  ${media.xl} {
    > :not(${ItemDate}) { grid-column: 2 / span 2; }
  }

  ${props => props.$withImage && withImage}
`;

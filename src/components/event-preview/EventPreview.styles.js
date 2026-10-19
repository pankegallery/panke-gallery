import styled from 'styled-components';
import { media } from '../../theme/theme';
import { Artist, ItemDate, Title } from '../exhibition-item/ExhibitionItem.styles';

// Lines of the event subline before it is cut off. Event sublines are
// short descriptions, so they get one line more than an artist line.
const SUBLINE_LINES = 3;

// The subline in Roboto, as in the Recent grid: mono is kept for artist
// lines next to exhibition teasers.
export const Subline = styled(Artist)`
  -webkit-line-clamp: ${SUBLINE_LINES};
  line-clamp: ${SUBLINE_LINES};
`;

// Holds the series tag above the title link's click area, so the tag stays
// a link of its own (to the series on /events/).
export const SeriesTag = styled.div`
  position: relative;
  z-index: 1;
  justify-self: start;

  > * { margin-top: 0; }
`;

// One event row, a direct child of the page `Grid` (Layout.styles.js).
// Stacked on phones, date first. From `breakpoints.sm` the row takes the page
// columns over with `subgrid`: the date in the first column, title, subline
// and series tag in the next two, the same edges as the exhibition text and
// the intro/Visit row. From `breakpoints.xl` the text stays two columns wide.
// The DOM puts the title first, so screen readers meet the heading first.
export const EventRow = styled.article`
  /* Holds the title link's click area, which covers the whole row. */
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  row-gap: ${props => props.theme.spacing.textGap};
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
`;

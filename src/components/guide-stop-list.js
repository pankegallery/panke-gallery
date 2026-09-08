import React from 'react';
import { Link } from 'gatsby';

import { List, StopItem, Number, Titles } from './guide-stop-list/GuideStopList.styles';

// Kept in sync with the same reserved bucket in gatsby-node.js — stops with
// no exhibitionSlug in Baserow get filed here instead of being dropped.
const UNASSIGNED_EXHIBITION_SLUG = 'stop'

const GuideStopList = ({ stops }) => (
  <List>
    {stops.map(({ node }) => {
      const exhibitionSlug = node.exhibitionSlug || UNASSIGNED_EXHIBITION_SLUG
      return (
        <StopItem key={`${exhibitionSlug}-${node.referenceNumber}`}>
          <Link to={`/guide/${exhibitionSlug}/${node.referenceNumber}/`}>
            <Number>{node.referenceNumber}</Number>
            <Titles>
              <strong>{node.artworkName}</strong>
              {node.artist && <small>{node.artist}</small>}
            </Titles>
          </Link>
        </StopItem>
      )
    })}
  </List>
);

export default GuideStopList;

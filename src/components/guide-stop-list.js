import React from 'react';
import { Link } from 'gatsby';

import { List, StopItem, Number, Titles } from './guide-stop-list/GuideStopList.styles';

const GuideStopList = ({ stops }) => (
  <List>
    {stops.map(({ node }) => (
      <StopItem key={`${node.exhibitionSlug}-${node.referenceNumber}`}>
        <Link to={`/guide/${node.exhibitionSlug}/${node.referenceNumber}/`}>
          <Number>{node.referenceNumber}</Number>
          <Titles>
            <strong>{node.artworkName}</strong>
            {node.artist && <small>{node.artist}</small>}
          </Titles>
        </Link>
      </StopItem>
    ))}
  </List>
);

export default GuideStopList;

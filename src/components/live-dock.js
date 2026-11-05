import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';

import TwitchEmbed from './twitch-embed';
import { LiveDot } from './content/Content.styles';
import { CloseButton } from './consent-embed/ConsentEmbed.styles';
import { Dock, DockHead } from './live-dock/LiveDock.styles';

/**
 * A small box fixed to the bottom of the homepage while an event's Twitch
 * stream runs (#74): "Live now", the event's title (a link to the event)
 * and a close button, with the live player behind two clicks (TwitchEmbed).
 * Nothing loads from Twitch until "Play stream".
 *
 * A component of its own because nothing else on the site floats over the
 * page; the player inside it is the shared TwitchEmbed.
 *
 * Closing hides the dock (and stops the stream) for this page view only;
 * nothing is stored on the device.
 *
 * It is rendered straight into <body> (a portal): the layout's `Container`
 * has a `transform` for the phone menu, and inside it `position: fixed`
 * would scroll with the page. The dock only exists in the browser, once the
 * clock says the stream runs, so `document` is always there.
 *
 * @param {object} props
 * @param {{slug: string, title: string}} props.event - The event being streamed.
 */
const LiveDock = ({ event }) => {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return createPortal(
    <Dock aria-label="Live stream">
      <DockHead>
        <LiveDot aria-hidden="true" />
        <strong>Live now</strong>
        <Link to={`/event/${event.slug}`}>{event.title}</Link>
        <CloseButton type="button" aria-label="Hide the live stream" onClick={() => setHidden(true)}>
          <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
        </CloseButton>
      </DockHead>
      {/* A play icon: the head already has the live dot. */}
      <TwitchEmbed
        title={event.title}
        buttonLabel="Watch"
        icon={<FontAwesomeIcon icon={faPlay} aria-hidden="true" />}
      />
    </Dock>,
    document.body
  );
};

export default LiveDock;

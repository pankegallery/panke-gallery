import React from 'react';
import { Link } from 'gatsby';

import ConsentEmbed from './consent-embed';
import { LiveDot } from './content/Content.styles';
import { TWITCH_URL, getTwitchPlayerUrl } from '../utils/live-stream';

/**
 * Our Twitch channel's live player behind two clicks (#74): ConsentEmbed in
 * the `pill` variant with the two steps, set up once so the event page and
 * the homepage dock say the same thing in the same words.
 *
 * Twitch is not certified under the EU-US Data Privacy Framework, so the
 * click must also be consent to the transfer to the USA (Art. 49(1)(a)
 * GDPR). That consent only counts if the visitor reads about it first,
 * hence the card with the notice between "Watch" and "Play stream". The
 * privacy policy has the full text.
 *
 * @param {object} props
 * @param {string} props.title - What is streamed, for the iframe's accessible title.
 * @param {React.ReactNode} [props.cover] - What the pill belongs to (see ConsentEmbed).
 * @param {boolean} [props.pillBelow] - Pill below the cover instead of on it (see ConsentEmbed).
 * @param {string} [props.buttonLabel] - Text of the first button. Defaults to "Live now · Watch".
 * @param {React.ReactNode} [props.icon] - Before the button text. Defaults to the red live dot.
 */
const TwitchEmbed = ({
  title,
  cover,
  pillBelow = false,
  buttonLabel = 'Live now · Watch',
  icon = <LiveDot aria-hidden="true" />,
}) => (
  <ConsentEmbed
    variant="pill"
    cover={cover}
    pillBelow={pillBelow}
    icon={icon}
    buttonLabel={buttonLabel}
    confirmTitle="Live now on Twitch"
    confirmLabel="Play stream"
    notice={
      <>
        The player loads from Twitch in the USA, which receives your IP address. The USA
        has no EU-level data protection for Twitch. <Link to="/privacy/">Privacy policy</Link>
      </>
    }
    provider="Twitch"
    // Read at the click, so the player names the domain the page is on.
    src={getTwitchPlayerUrl}
    title={`Live stream: ${title}`}
    allow="autoplay; fullscreen"
    referrerPolicy="strict-origin-when-cross-origin"
  >
    <a href={TWITCH_URL} target="_blank" rel="noopener noreferrer">Open on twitch.tv</a>
  </ConsentEmbed>
);

export default TwitchEmbed;

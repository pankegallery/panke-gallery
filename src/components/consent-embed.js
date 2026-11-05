import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import { Button, ResponsiveVideo } from './content/Content.styles';
import { Cover, Placeholder, Notice, Pill, PillButton } from './consent-embed/ConsentEmbed.styles';

/**
 * Third-party iframe that loads only after the visitor clicks (#60).
 *
 * Embedding an iframe from Google, YouTube etc. sends the visitor's IP
 * address to that provider as soon as the page opens, which needs consent
 * under the GDPR. Until the click, this renders a placeholder that makes no
 * external requests at all. The click counts for this page view only;
 * nothing is stored.
 *
 * Variants:
 * - `box` (default): a grey placeholder in the frame's shape, with a button
 *   and the notice, e.g. the map on /contact/.
 * - `pill`: a small box with a play button and the notice. With `cover` it
 *   sits on top of that content (an event's featured image); without, it
 *   stands on its own (below a slideshow). Used for recordings (#75).
 *
 * After the click, either variant becomes the iframe in a frame of `ratio`.
 *
 * @param {object} props
 * @param {string} props.src - URL of the iframe to load after the click.
 * @param {string} props.title - Accessible title of the iframe.
 * @param {string} props.provider - Who the content comes from, shown in the notice (e.g. "Google").
 * @param {string} props.buttonLabel - Text of the load button (e.g. "Show map").
 * @param {string} [props.ratio] - CSS aspect ratio of the frame. Defaults to 16 / 9.
 * @param {'box'|'pill'} [props.variant] - Look of the placeholder. Defaults to `box`.
 * @param {React.ReactNode} [props.cover] - `pill` only: content the pill sits on, replaced by the iframe after the click.
 * @param {string} [props.allow] - The iframe's permissions policy, e.g. "autoplay; fullscreen".
 * @param {string} [props.referrerPolicy] - The iframe's referrer policy. Defaults to `no-referrer-when-downgrade`, which Google Maps needs.
 * @param {React.ReactNode} [props.children] - Extra placeholder content, e.g. a link to open the content elsewhere. In the `pill` variant it follows the notice inline.
 */
const ConsentEmbed = ({
  src,
  title,
  provider,
  buttonLabel,
  ratio,
  variant = 'box',
  cover,
  allow,
  referrerPolicy = 'no-referrer-when-downgrade',
  children,
}) => {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);

  // The button the visitor clicked disappears with the placeholder, so
  // keyboard focus moves on to the player instead of falling back to the
  // top of the page.
  useEffect(() => {
    if (loaded) frameRef.current?.focus();
  }, [loaded]);

  if (loaded) {
    return (
      <ResponsiveVideo $ratio={ratio}>
        <iframe
          ref={frameRef}
          title={title}
          src={src}
          allow={allow}
          referrerPolicy={referrerPolicy}
          allowFullScreen
        />
      </ResponsiveVideo>
    );
  }

  if (variant === 'pill') {
    const pill = (
      <Pill $overlay={Boolean(cover)}>
        <PillButton type="button" onClick={() => setLoaded(true)}>
          <FontAwesomeIcon icon={faPlay} aria-hidden="true" />
          {buttonLabel}
        </PillButton>
        <Notice>
          Loads content from {provider}.{children && <> {children}</>}
        </Notice>
      </Pill>
    );
    return cover ? <Cover>{cover}{pill}</Cover> : pill;
  }

  return (
    <ResponsiveVideo $ratio={ratio}>
      <Placeholder>
        <Button type="button" onClick={() => setLoaded(true)}>
          {buttonLabel}
        </Button>
        <Notice>Loads content from {provider}.</Notice>
        {children}
      </Placeholder>
    </ResponsiveVideo>
  );
};

export default ConsentEmbed;

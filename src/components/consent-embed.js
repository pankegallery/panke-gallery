import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';

import { Button, ResponsiveVideo } from './content/Content.styles';
import {
  CardActions,
  CardHead,
  CloseButton,
  Cover,
  Notice,
  Pill,
  PillButton,
  Placeholder,
} from './consent-embed/ConsentEmbed.styles';

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
 *   sits on top of that content (an event's featured image), or below it
 *   with `pillBelow` (a slideshow, whose arrows it would cover). Used for
 *   recordings (#75) and live streams (#74).
 *
 * Two steps (`pill` with `confirmLabel`): the pill shows only its button.
 * The first click loads nothing; it opens a card with the notice and a
 * second button, `confirmLabel`, which is the consent. Needed where the
 * visitor must learn something before agreeing, such as a transfer to the
 * USA without an adequacy decision (Twitch, Art. 49(1)(a) GDPR).
 *
 * After the consent, either variant becomes the iframe in a frame of
 * `ratio`, in place of the cover.
 *
 * @param {object} props
 * @param {string|(() => string)} props.src - URL of the iframe, or a function that returns it at the moment of the click (e.g. to read the page's domain).
 * @param {string} props.title - Accessible title of the iframe.
 * @param {string} props.provider - Who the content comes from, shown in the default notice (e.g. "Google").
 * @param {string} props.buttonLabel - Text of the load button (e.g. "Show map").
 * @param {string} [props.ratio] - CSS aspect ratio of the frame. Defaults to 16 / 9.
 * @param {'box'|'pill'} [props.variant] - Look of the placeholder. Defaults to `box`.
 * @param {React.ReactNode} [props.cover] - `pill` only: content the pill belongs to, replaced by the iframe after the click.
 * @param {boolean} [props.pillBelow] - `pill` only: put the pill below the cover instead of on it.
 * @param {React.ReactNode} [props.icon] - `pill` only: shown before the button text. Defaults to a play icon.
 * @param {string} [props.confirmLabel] - `pill` only: turns on the two steps; text of the consent button (e.g. "Play stream").
 * @param {React.ReactNode} [props.confirmTitle] - Heading of the card in the two steps.
 * @param {React.ReactNode} [props.notice] - Replaces the default notice "Loads content from <provider>."
 * @param {string} [props.allow] - The iframe's permissions policy, e.g. "autoplay; fullscreen".
 * @param {string} [props.referrerPolicy] - The iframe's referrer policy. Defaults to `no-referrer-when-downgrade`, which Google Maps needs.
 * @param {React.ReactNode} [props.children] - Extra placeholder content, e.g. a link to open the content elsewhere. In the `pill` variant it follows the notice inline, or the consent button in the card.
 */
const ConsentEmbed = ({
  src,
  title,
  provider,
  buttonLabel,
  ratio,
  variant = 'box',
  cover,
  pillBelow = false,
  icon = <FontAwesomeIcon icon={faPlay} aria-hidden="true" />,
  confirmLabel,
  confirmTitle,
  notice,
  allow,
  referrerPolicy = 'no-referrer-when-downgrade',
  children,
}) => {
  // 'idle' → ('asking' in the two steps) → 'loaded'
  const [step, setStep] = useState('idle');
  const frameRef = useRef(null);
  const pillButtonRef = useRef(null);
  const confirmRef = useRef(null);
  const opened = useRef(false);

  // Keyboard focus follows the step, since the button that was clicked
  // disappears each time: to the consent button in the card, back to the
  // pill when the card is closed, and to the player once it loads.
  useEffect(() => {
    if (step === 'loaded') frameRef.current?.focus();
    if (step === 'asking') confirmRef.current?.focus();
    // Not on the first render, or the page would scroll to the pill.
    if (step === 'idle' && opened.current) pillButtonRef.current?.focus();
    if (step !== 'idle') opened.current = true;
  }, [step]);

  const noticeText = notice ?? <>Loads content from {provider}.</>;

  if (step === 'loaded') {
    return (
      <ResponsiveVideo $ratio={ratio}>
        <iframe
          ref={frameRef}
          title={title}
          src={typeof src === 'function' ? src() : src}
          allow={allow}
          referrerPolicy={referrerPolicy}
          allowFullScreen
        />
      </ResponsiveVideo>
    );
  }

  if (variant === 'pill') {
    const overlay = Boolean(cover) && !pillBelow;
    // The card always opens below the cover: on a flat banner image it
    // would grow out of the image and over the page title.
    const pill = step === 'asking' ? (
      <Pill $card role="group" aria-label={typeof confirmTitle === 'string' ? confirmTitle : buttonLabel}>
        <CardHead>
          {icon}
          <span>{confirmTitle}</span>
          <CloseButton type="button" aria-label="Close" onClick={() => setStep('idle')}>
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </CloseButton>
        </CardHead>
        <Notice>{noticeText}</Notice>
        <CardActions>
          <Button ref={confirmRef} type="button" onClick={() => setStep('loaded')}>
            {confirmLabel}
          </Button>
          {children}
        </CardActions>
      </Pill>
    ) : (
      <Pill $overlay={overlay}>
        <PillButton
          ref={pillButtonRef}
          type="button"
          onClick={() => setStep(confirmLabel ? 'asking' : 'loaded')}
        >
          {icon}
          {buttonLabel}
        </PillButton>
        {/* In the two steps the notice comes with the card instead. */}
        {!confirmLabel && (
          <Notice>
            {noticeText}{children && <> {children}</>}
          </Notice>
        )}
      </Pill>
    );
    return cover ? <Cover>{cover}{pill}</Cover> : pill;
  }

  return (
    <ResponsiveVideo $ratio={ratio}>
      <Placeholder>
        <Button type="button" onClick={() => setStep('loaded')}>
          {buttonLabel}
        </Button>
        <Notice>{noticeText}</Notice>
        {children}
      </Placeholder>
    </ResponsiveVideo>
  );
};

export default ConsentEmbed;

import React from 'react';
import { Link } from 'gatsby';

import { Button } from './content/Content.styles';
import { Notice } from './consent-embed/ConsentEmbed.styles';
import { RsvpForm as Form } from './rsvp-form/RsvpForm.styles';
import { Fields } from './newsletter-form/NewsletterForm.styles';

// Our own listmonk installation (#122): its public subscription form and the
// "panke.gallery Newsletter" list. The list is double opt-in.
const SUBSCRIBE_URL = 'https://list-panke.bitnik.org/subscription/form';
const LIST_ID = '12fdef4e-2990-49a3-bf94-470f7d3bbb74';

/**
 * Newsletter signup that posts straight to our listmonk server (#122).
 *
 * A plain HTML form: it loads nothing from the newsletter server until the
 * visitor submits (#60). listmonk doesn't let other sites read its answers,
 * so the result can't be shown in place; submitting opens listmonk's own
 * result page in a new tab and leaves this page open.
 *
 * Has no props; the section title and intro text come from the Contentful
 * block it is rendered in.
 */
const NewsletterForm = () => (
  <Form action={SUBSCRIBE_URL} method="post" target="_blank" rel="noopener">
    <Fields>
      <div className="form-group">
        <label htmlFor="newsletter-email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="newsletter-email"
          name="email"
          required
          autoComplete="email"
          placeholder="your.email@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="newsletter-name">Name (optional)</label>
        <input
          type="text"
          id="newsletter-name"
          name="name"
          autoComplete="name"
        />
      </div>
    </Fields>

    {/* listmonk's spam trap: it rejects a sign-up when "nonce" is filled,
        which bots do and people can't, as the field is off-screen. */}
    <div className="honeypot-field" aria-hidden="true">
      <label htmlFor="newsletter-nonce">Leave this field empty</label>
      <input
        type="text"
        id="newsletter-nonce"
        name="nonce"
        tabIndex="-1"
        autoComplete="off"
      />
    </div>

    <input type="hidden" name="l" value={LIST_ID} />

    <div className="form-group">
      <Button type="submit">Subscribe</Button>
    </div>

    {/* No consent checkbox: the form does nothing but subscribe, and the
        double opt-in mail is the proof of consent. This note covers what
        visitors need to know before submitting. */}
    <Notice>
      We’ll email you a link to confirm your subscription. You can unsubscribe
      at any time. Your name and email address go to our own newsletter server
      only when you subscribe. See our <Link to="/privacy/">privacy policy</Link>.
    </Notice>
  </Form>
);

export default NewsletterForm;

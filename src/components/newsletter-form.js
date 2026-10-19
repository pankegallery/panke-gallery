import React, { useState } from 'react';
import { Link } from 'gatsby';

import { Button } from './content/Content.styles';
import { Notice } from './consent-embed/ConsentEmbed.styles';
import {
  RsvpForm as Form,
  RsvpError,
  RsvpSuccess
} from './rsvp-form/RsvpForm.styles';

// The MailerLite form "hOMCKV" (account 805672). This is the action of its
// HTML-only embed code; the form has double opt-in switched on in MailerLite.
const SUBSCRIBE_URL = 'https://assets.mailerlite.com/jsonp/805672/forms/111883649410926357/subscribe';

/**
 * Newsletter signup that posts straight to MailerLite's form endpoint (#58).
 *
 * MailerLite's own embed needs their JavaScript, which loads on every page
 * view, sets cookies and pulls in their fonts, so visitors' IPs reach
 * MailerLite before anyone has decided to subscribe (#60). This form loads
 * nothing from MailerLite: the email address is only sent when the visitor
 * submits. The endpoint allows cross-origin requests and answers with JSON,
 * so the result is shown in place. Without JavaScript the form still works
 * as a plain POST that opens MailerLite's response in a new tab.
 *
 * Has no props; the section title and intro text come from the Contentful
 * block it is rendered in.
 */
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bots fill every field. Pretend it worked, so they don't retry.
    if (honeypot) {
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Form-encoded, so the browser sends it as a simple request without a
    // CORS preflight. The hidden fields mirror MailerLite's own embed code.
    const body = new URLSearchParams({
      'fields[email]': email,
      'ml-submit': '1',
      anticsrf: 'true',
      ajax: '1'
    });

    try {
      const response = await fetch(SUBSCRIBE_URL, { method: 'POST', body });
      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(
          data.errors?.fields?.email?.[0] ||
          'The signup didn’t work. Please check your email address and try again.'
        );
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Newsletter signup error:', error);
    }
  };

  if (status === 'success') {
    return (
      <RsvpSuccess role="status">
        <h3>Almost done</h3>
        <p>We’ve sent you an email. Please click the link in it to confirm your subscription.</p>
      </RsvpSuccess>
    );
  }

  const submitting = status === 'submitting';

  return (
    <Form
      action={SUBSCRIBE_URL}
      method="post"
      target="_blank"
      onSubmit={handleSubmit}
    >
      <div className="form-group">
        <label htmlFor="newsletter-email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          id="newsletter-email"
          name="fields[email]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
          autoComplete="email"
          placeholder="your.email@example.com"
        />
      </div>

      <div className="honeypot-field" aria-hidden="true">
        <label htmlFor="newsletter-website">Leave this field empty</label>
        <input
          type="text"
          id="newsletter-website"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex="-1"
          autoComplete="off"
        />
      </div>

      {/* Only used by the no-JavaScript fallback; fetch builds its own body. */}
      <input type="hidden" name="ml-submit" value="1" />
      <input type="hidden" name="anticsrf" value="true" />

      {status === 'error' && <RsvpError role="alert">{errorMessage}</RsvpError>}

      <div className="form-group">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>

      {/* No consent checkbox: the form does nothing but subscribe, and the
          double opt-in mail is the proof of consent. This note covers what
          visitors need to know before submitting. */}
      <Notice>
        You can unsubscribe at any time. Your email address is sent to our newsletter
        service MailerLite only when you subscribe. See our <Link to="/privacy/">privacy policy</Link>.
      </Notice>
    </Form>
  );
};

export default NewsletterForm;

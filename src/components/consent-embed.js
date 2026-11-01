import React, { useState } from 'react';

import { Button, ResponsiveVideo } from './content/Content.styles';
import { Placeholder, Notice } from './consent-embed/ConsentEmbed.styles';

/**
 * Third-party iframe that loads only after the visitor clicks (#60).
 *
 * Embedding an iframe from Google, YouTube etc. sends the visitor's IP
 * address to that provider as soon as the page opens, which needs consent
 * under the GDPR. Until the click, this renders a placeholder that makes no
 * external requests at all.
 *
 * @param {object} props
 * @param {string} props.src - URL of the iframe to load after the click.
 * @param {string} props.title - Accessible title of the iframe.
 * @param {string} props.provider - Who the content comes from, shown in the notice (e.g. "Google").
 * @param {string} props.buttonLabel - Text of the load button (e.g. "Show map").
 * @param {string} [props.ratio] - CSS aspect ratio of the frame. Defaults to 16 / 9.
 * @param {React.ReactNode} [props.children] - Extra placeholder content, e.g. a link to open the content elsewhere.
 */
const ConsentEmbed = ({ src, title, provider, buttonLabel, ratio, children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <ResponsiveVideo $ratio={ratio}>
      {loaded ? (
        <iframe
          title={title}
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <Placeholder>
          <Button type="button" onClick={() => setLoaded(true)}>
            {buttonLabel}
          </Button>
          <Notice>Loads content from {provider}.</Notice>
          {children}
        </Placeholder>
      )}
    </ResponsiveVideo>
  );
};

export default ConsentEmbed;

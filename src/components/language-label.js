import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';

import { LanguageLabelButton, LanguageLabelText } from './language-label/LanguageLabel.styles';

// Shown in the guide header once a language is known, in place of the
// overview icon on pages that have nowhere "up" to link to. Clickable (to
// change it) where there's a specific exhibition's language list to pick
// from; otherwise a plain read-only label (see the global /guide/ overview,
// which spans multiple exhibitions and has no single language list to offer).
const LanguageLabel = ({ language, onClick }) => {
  if (!language) return null;

  const content = (
    <>
      <FontAwesomeIcon icon={faLanguage} />
      {language}
    </>
  );

  return onClick ? (
    <LanguageLabelButton
      type="button"
      onClick={onClick}
      aria-label={`Change language (current: ${language})`}
    >
      {content}
    </LanguageLabelButton>
  ) : (
    <LanguageLabelText>{content}</LanguageLabelText>
  );
};

export default LanguageLabel;

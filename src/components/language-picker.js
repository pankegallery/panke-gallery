import React from 'react';

import { Screen, Buttons, LanguageButton } from './language-picker/LanguagePicker.styles';

const LanguagePicker = ({ languages, selectedLanguage, onSelect }) => (
  <Screen>
    <Buttons>
      {languages.map(language => (
        <LanguageButton
          key={language}
          type="button"
          $selected={language === selectedLanguage}
          aria-pressed={language === selectedLanguage}
          onClick={() => onSelect(language)}
        >
          {language}
        </LanguageButton>
      ))}
    </Buttons>
  </Screen>
);

export default LanguagePicker;

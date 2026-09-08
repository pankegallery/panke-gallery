import React from 'react';

import { Screen, Buttons, LanguageButton } from './language-picker/LanguagePicker.styles';

const LanguagePicker = ({ languages, onSelect }) => (
  <Screen>
    <Buttons>
      {languages.map(language => (
        <LanguageButton key={language} type="button" onClick={() => onSelect(language)}>
          {language}
        </LanguageButton>
      ))}
    </Buttons>
  </Screen>
);

export default LanguagePicker;

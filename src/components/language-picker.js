import React from 'react';

import { Buttons, LanguageButton } from './language-picker/LanguagePicker.styles';

const LanguagePicker = ({ languages, onSelect }) => (
  <Buttons>
    {languages.map(language => (
      <LanguageButton key={language} type="button" onClick={() => onSelect(language)}>
        {language}
      </LanguageButton>
    ))}
  </Buttons>
);

export default LanguagePicker;

import styled from 'styled-components';

// A full-screen takeover — same fixed/inset pattern as the audio player's
// Overlay — so the language choice is the only thing on screen until made.
export const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  background: ${props => props.theme.colors.theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5em calc(1.5em + env(safe-area-inset-right)) calc(1.5em + env(safe-area-inset-bottom)) calc(1.5em + env(safe-area-inset-left));
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1em;
  width: 100%;
  max-width: 320px;

  @media (min-width: 600px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: auto;
  }
`;

export const LanguageButton = styled.button`
  padding: 0.9em 1.8em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: none;
  color: ${props => props.theme.colors.theme.black};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: background-color 0.4s ease, color 0.4s ease;

  @media (hover: hover) {
    &:hover {
      background: ${props => props.theme.colors.theme.black};
      color: ${props => props.theme.colors.theme.white};
    }
  }

  &:active {
    background: ${props => props.theme.colors.theme.black};
    color: ${props => props.theme.colors.theme.white};
  }
`;

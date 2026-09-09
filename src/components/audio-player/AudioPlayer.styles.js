import styled from 'styled-components';

export const Bar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: ${props => props.theme.colors.theme.white};
  border-top: 1px solid ${props => props.theme.colors.theme.black};
  padding: 0 1.25em calc(1em + env(safe-area-inset-bottom));
  cursor: pointer;
`;

export const Progress = styled.div`
  height: 2px;
  background: ${props => props.theme.colors.theme.lightgrey};

  span {
    display: block;
    height: 100%;
    background: ${props => props.theme.colors.theme.black};
    width: ${props => props.$percent || 0}%;
    transition: width 0.1s linear;
  }
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9em;
  padding: 0.9em 0;
`;

export const NowPlaying = styled.div`
  flex: 1 1 auto;
  min-width: 0;

  h3 {
    font-size: ${props => props.theme.fontSizes.medium};
    font-weight: ${props => props.theme.fontWeights.medium};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  p {
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.theme.grey};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
`;

export const PlayButton = styled.button`
  flex: 0 0 auto;
  width: ${props => props.$size || '48px'};
  height: ${props => props.$size || '48px'};
  border-radius: 50%;
  border: 0;
  background: ${props => props.theme.colors.theme.black};
  color: ${props => props.theme.colors.theme.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.15s ease;

  svg {
    font-size: ${props => props.$iconSize || '1em'};
    /* optical centering: the play glyph isn't visually centered in its box */
    margin-left: ${props => (props.$isPlaying ? '0' : '2px')};
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      opacity: 0.85;
    }
  }

  &:active:not(:disabled) {
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ErrorNote = styled.p`
  color: ${props => props.theme.colors.theme.grey};
  font-size: ${props => props.theme.fontSizes.small};
`;

export const ExpandButton = styled.button`
  flex: 0 0 auto;
  border: 0;
  border-radius: 50%;
  background: none;
  color: ${props => props.theme.colors.theme.black};
  cursor: pointer;
  padding: 0.5em;
  transition: background-color 0.15s ease;

  svg {
    font-size: 1.2em;
  }

  @media (hover: hover) {
    &:hover {
      background: ${props => props.theme.colors.theme.lightgrey};
    }
  }

  &:active {
    background: ${props => props.theme.colors.theme.lightgrey};
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  background: ${props => props.theme.colors.theme.white};
  display: flex;
  flex-direction: column;
  padding: 1.25em;
  padding-bottom: calc(1.25em + env(safe-area-inset-bottom));
  overflow-y: auto;
`;

export const OverlayTop = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const OverlayBody = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
`;

// Title, artist, play button and scrubber — always vertically centered in
// whatever space is left above OverlayFooter, regardless of whether the
// transcript is open or the footer has one button or two. Kept as its own
// flex region specifically so those things DON'T shift around as sibling
// content (transcript text, footer buttons) appears/disappears.
export const OverlayCenter = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6em;

  h2 {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: ${props => props.theme.fontSizes.large};
    font-weight: ${props => props.theme.fontWeights.medium};
  }

  .artist {
    color: ${props => props.theme.colors.theme.grey};
  }
`;

// Always the last thing in OverlayBody, in normal flow (not sticky/fixed —
// that combined with the Overlay's own safe-area bottom padding left a gap
// below the footer where scrolled transcript text showed through). Staying
// reachable without scrolling past a long transcript is instead handled by
// capping TranscriptSection's own height below.
export const OverlayFooter = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75em;
  padding-top: 1.5em;
`;

export const StopNumber = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4em;
  height: 2.4em;
  margin: 0 auto auto;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 50%;
  font-size: ${props => props.theme.fontSizes.medium};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

export const Scrubber = styled.input`
  width: 100%;
  margin: 0.5em 0 0.3em;
  accent-color: ${props => props.theme.colors.theme.black};
`;

export const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.theme.grey};
  margin-bottom: auto;
`;

// Capped and independently scrollable, rather than growing to fit the whole
// text — that way OverlayFooter always stays reachable right below it
// instead of being pushed arbitrarily far down by a long transcript.
export const TranscriptSection = styled.div`
  flex: 0 1 auto;
  max-height: 40vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  text-align: left;
  margin-top: 1em;

  p {
    white-space: pre-wrap;
  }
`;

// Shared pill-button style for both the transcript toggle and the language
// toggle in OverlayFooter — same look, different icon/label.
export const PillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.6em 1.1em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: none;
  color: ${props => props.theme.colors.theme.black};
  font-size: ${props => props.theme.fontSizes.small};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 0.15s ease;

  svg {
    font-size: 1em;
  }

  @media (hover: hover) {
    &:hover {
      background: ${props => props.theme.colors.theme.lightgrey};
    }
  }

  &:active {
    background: ${props => props.theme.colors.theme.lightgrey};
  }
`;

import styled from 'styled-components';

import { artworkTitleStyle } from '../guide-layout/GuideLayout.styles';

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
    ${artworkTitleStyle}
    font-size: ${props => props.theme.fontSizes.medium};
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

// Three independent regions stacked in a column that itself never scrolls
// (overflow: hidden) — only OverlayCenter does. Previously the whole Overlay
// scrolled AND TranscriptSection had its own internal scroll, which produced
// visible double-scrolling and let OverlayTop's collapse button scroll out
// of view; now there is exactly one scrollable region, and the top/bottom
// rows are structurally unable to scroll away.
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  background: ${props => props.theme.colors.theme.white};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0 calc(1.25em + env(safe-area-inset-right)) 0 calc(1.25em + env(safe-area-inset-left));
`;

// Anchored to the screen's own edges (not the 480px reading column below) —
// position: relative so StopNumber can center itself independent of
// whatever width the collapse button takes up.
export const OverlayTop = styled.div`
  flex: 0 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 1em 0;
`;

// Title, artist, play button, scrubber, and (when open) the transcript —
// the one scrollable region. Centered vertically when it fits; once the
// transcript makes it taller than the available space, "safe center" (where
// supported) keeps the top of the content reachable by scrolling instead of
// clipping it above an unreachable scroll position — the plain `center`
// above it is the fallback for browsers that don't understand `safe`.
export const OverlayCenter = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-content: safe center;
  gap: 0.6em;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  padding: 1em 0;

  h2 {
    ${artworkTitleStyle}
    font-size: ${props => props.theme.fontSizes.medium};
  }

  .artist {
    color: ${props => props.theme.colors.theme.grey};
  }
`;

// Always the last region, its own fixed-height flex child (not nested inside
// the scrollable OverlayCenter) so it can never be scrolled out of view.
export const OverlayFooter = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75em;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  padding: 1em 0 calc(1em + env(safe-area-inset-bottom));
  border-top: 1px solid ${props => props.theme.colors.theme.lightgrey};
`;

// Positioned in OverlayTop, centered independent of the collapse button.
export const StopNumber = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4em;
  height: 2.4em;
  margin: 0;
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
  width: 100%;
  font-size: ${props => props.theme.fontSizes.small};
  color: ${props => props.theme.colors.theme.grey};
`;

// Flows inside OverlayCenter (the single scrollable region) rather than
// scrolling on its own — nesting a second scrollable region here was what
// produced the double-scrolling bug. Needs its own explicit width because
// OverlayCenter's align-items: center otherwise shrinks unwidthed children
// to fit their content (the same issue TimeRow had).
export const TranscriptSection = styled.div`
  width: 100%;
  text-align: left;
  margin-top: 1em;

  p {
    white-space: pre-wrap;
  }
`;

// Shared pill-button style for both the transcript toggle and the language
// toggle in OverlayFooter — same look, different icon/label. Hover (mouse
// only) and touch :active both swap to a filled black/white treatment,
// matching LanguagePicker's buttons. $active additionally makes that filled
// state persistent — used on the transcript toggle so "showing" looks
// visually different from "hidden", not just on hover/press.
export const PillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.6em 1.1em;
  border: 1px solid ${props => props.theme.colors.theme.black};
  border-radius: 999px;
  background: ${props => (props.$active ? props.theme.colors.theme.black : 'none')};
  color: ${props => (props.$active ? props.theme.colors.theme.white : props.theme.colors.theme.black)};
  font-size: ${props => props.theme.fontSizes.small};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  svg {
    font-size: 1em;
  }

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

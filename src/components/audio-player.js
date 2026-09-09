import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronUp, faChevronDown, faFileLines, faLanguage } from '@fortawesome/free-solid-svg-icons';

import {
  Bar,
  Progress,
  BarRow,
  NowPlaying,
  PlayButton,
  ExpandButton,
  Overlay,
  OverlayTop,
  OverlayCenter,
  OverlayFooter,
  StopNumber,
  Scrubber,
  TimeRow,
  TranscriptSection,
  PillButton,
  ErrorNote,
} from './audio-player/AudioPlayer.styles';

const formatTime = seconds => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// language/onChangeLanguage are purely for display here — which language is
// active was already decided by the caller (guide-stop.js), before this
// component ever mounts with a given audioUrl/transcript. onChangeLanguage
// just needs to reset that decision upstream; this component doesn't manage
// language state itself.
const AudioPlayer = ({ audioUrl, transcript, title, artist, referenceNumber, language, onChangeLanguage }) => {
  const audioRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    // Changing the `src` attribute reactively doesn't reliably make an
    // already-initialized <audio> element switch to the new resource once
    // it's loaded one already (e.g. after a language change upstream) —
    // without an explicit load(), it kept playing the previous source.
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setPlaybackError(false);
  }, [audioUrl]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album: 'panke.gallery Audioguide',
    });
  }, [title, artist]);

  const togglePlay = e => {
    e.stopPropagation();
    if (playbackError) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      // audio.play() rejects (rather than throwing) when the src is missing,
      // unreachable, or an unsupported format — catch it so a bad Baserow
      // "Audio URL" doesn't surface as an unhandled runtime error.
      audio.play().catch(() => setPlaybackError(true));
    } else {
      audio.pause();
    }
  };

  const handleAudioError = () => {
    console.warn(`Audioguide: failed to load audio for "${title}" (${audioUrl})`);
    setPlaybackError(true);
  };

  const handleSeek = e => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const percentPlayed = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- spoken narration; the transcript in the expanded view is the accessible text alternative */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onError={handleAudioError}
      />

      <Bar onClick={() => setExpanded(true)}>
        <Progress $percent={percentPlayed}>
          <span />
        </Progress>
        <BarRow>
          <PlayButton
            type="button"
            onClick={togglePlay}
            disabled={playbackError}
            $isPlaying={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </PlayButton>
          <NowPlaying>
            <h3>{title}</h3>
            {playbackError ? <p>Audio unavailable</p> : artist && <p>{artist}</p>}
          </NowPlaying>
          <ExpandButton type="button" aria-label="Expand player">
            <FontAwesomeIcon icon={faChevronUp} />
          </ExpandButton>
        </BarRow>
      </Bar>

      {expanded && (
        <Overlay onClick={() => setExpanded(false)}>
          <OverlayTop>
            {referenceNumber && <StopNumber>{referenceNumber}</StopNumber>}
            <ExpandButton type="button" aria-label="Collapse player">
              <FontAwesomeIcon icon={faChevronDown} />
            </ExpandButton>
          </OverlayTop>

          <OverlayCenter onClick={e => e.stopPropagation()}>
            <h2>{title}</h2>
            {artist && <p className="artist">{artist}</p>}

            <PlayButton
              type="button"
              onClick={togglePlay}
              disabled={playbackError}
              $isPlaying={isPlaying}
              $size="72px"
              $iconSize="1.4em"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </PlayButton>

            {playbackError ? (
              <ErrorNote>Audio for this stop isn't available right now.</ErrorNote>
            ) : (
              <>
                <Scrubber
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                />
                <TimeRow>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </TimeRow>
              </>
            )}

            {showTranscript && transcript && (
              <TranscriptSection>
                <p>{transcript}</p>
              </TranscriptSection>
            )}
          </OverlayCenter>

          {(onChangeLanguage || transcript) && (
            <OverlayFooter onClick={e => e.stopPropagation()}>
              {onChangeLanguage && (
                <PillButton
                  type="button"
                  onClick={onChangeLanguage}
                  aria-label={`Change language (current: ${language})`}
                >
                  <FontAwesomeIcon icon={faLanguage} />
                  {language}
                </PillButton>
              )}

              {transcript && (
                <PillButton
                  type="button"
                  $active={showTranscript}
                  onClick={() => setShowTranscript(v => !v)}
                  aria-expanded={showTranscript}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  {showTranscript ? 'Hide transcript' : 'Read transcript'}
                </PillButton>
              )}
            </OverlayFooter>
          )}
        </Overlay>
      )}
    </>
  );
};

export default AudioPlayer;

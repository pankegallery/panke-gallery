import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronUp, faChevronDown, faFileLines } from '@fortawesome/free-solid-svg-icons';

import {
  Bar,
  Progress,
  BarRow,
  NowPlaying,
  PlayButton,
  ExpandButton,
  Overlay,
  OverlayTop,
  OverlayBody,
  StopNumber,
  Scrubber,
  TimeRow,
  TranscriptSection,
  TranscriptToggle,
  ErrorNote,
} from './audio-player/AudioPlayer.styles';

const formatTime = seconds => {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({ audioUrl, title, artist, transcript, referenceNumber }) => {
  const audioRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(false);

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
            <ExpandButton type="button" aria-label="Collapse player">
              <FontAwesomeIcon icon={faChevronDown} />
            </ExpandButton>
          </OverlayTop>

          <OverlayBody onClick={e => e.stopPropagation()}>
            {referenceNumber && <StopNumber>{referenceNumber}</StopNumber>}
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
              style={{ margin: '0 auto 1.5em' }}
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

            {transcript && (
              <>
                <TranscriptToggle
                  type="button"
                  onClick={() => setShowTranscript(v => !v)}
                  aria-expanded={showTranscript}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  {showTranscript ? 'Hide transcript' : 'Read transcript'}
                </TranscriptToggle>

                {showTranscript && (
                  <TranscriptSection>
                    <p>{transcript}</p>
                  </TranscriptSection>
                )}
              </>
            )}
          </OverlayBody>
        </Overlay>
      )}
    </>
  );
};

export default AudioPlayer;

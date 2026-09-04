import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
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
      />

      <Bar onClick={() => setExpanded(true)}>
        <Progress $percent={percentPlayed}>
          <span />
        </Progress>
        <BarRow>
          <PlayButton
            type="button"
            onClick={togglePlay}
            $isPlaying={isPlaying}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </PlayButton>
          <NowPlaying>
            <h3>{title}</h3>
            {artist && <p>{artist}</p>}
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
              $isPlaying={isPlaying}
              $size="72px"
              $iconSize="1.4em"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{ margin: '0 auto 1.5em' }}
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </PlayButton>

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

            {transcript && (
              <TranscriptSection>
                <h3>Transcript</h3>
                <p>{transcript}</p>
              </TranscriptSection>
            )}
          </OverlayBody>
        </Overlay>
      )}
    </>
  );
};

export default AudioPlayer;

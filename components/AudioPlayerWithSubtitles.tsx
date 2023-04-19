// components/AudioPlayerWithSubtitles.tsx
import { Subtitle } from 'interfaces/Subtitle';
import React, { useState } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';


interface AudioPlayerWithSubtitlesProps {
  audioSrc: string;
  subtitles: Subtitle[];
}

const AudioPlayerWithSubtitles = ({
  audioSrc,
  subtitles,
}: AudioPlayerWithSubtitlesProps) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleTimeUpdate = (currentTime: number) => {
    console.log('currentTime', currentTime);
    const subtitle = subtitles.find(
      (s) =>
        currentTime >= timeStringToSeconds(s.startTime) &&
        currentTime <= timeStringToSeconds(s.endTime)
    );
    setCurrentSubtitle(subtitle ? subtitle.text : '');
  };

  return (
    <div>
      <H5AudioPlayer
        src={audioSrc}
        onListen={(event) => {
          const audioElement = event.target as HTMLAudioElement;
          handleTimeUpdate(audioElement.currentTime);
        }}
      />
      <div className="subtitles">{currentSubtitle}</div>
    </div>
  );
};

export default AudioPlayerWithSubtitles;

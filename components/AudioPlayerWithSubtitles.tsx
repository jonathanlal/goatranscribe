import { styled } from 'frostbyte';
import { Subtitle } from 'interfaces/Subtitle';
import React, { useState } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface AudioPlayerWithSubtitlesProps {
  audioSrc: string;
  subtitles: Subtitle[];
  transcript: string;
}

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '5px',
  boxShadow: '$colors$purple8 0px 0px 0px 1px',
  // background: 'rgb(153, 86, 213, 0.1)',
  backgroundColor: '$purple4',

  '& .rhap_container': {
    backgroundColor: 'rgba(181, 134, 223, 0.1)',
  },
});

const Transcript = styled('div', {
  margin: '15px',
  // background: 'rgb(153, 86, 213, 0.1)',
  backgroundColor: '$purple6',
  padding: '15px',
  borderRadius: '5px',
  textAlign: 'left',
  fontSize: '20px',

  '& .highlight': {
    backgroundColor: '$purple11',
    color: '$purple1',
  },
});

const StyledH5AudioPlayer = styled(H5AudioPlayer, {
  '& .rhap_main-controls-button, .rhap_volume-button': {
    color: '$purple11',
  },

  '& .rhap_progress-bar, .rhap_volume-bar': {
    background: '$purple1',
  },

  '& .rhap_volume-indicator, .rhap_progress-indicator': {
    background: '$purple11',
  },
  '& .rhap_progress-filled': {
    background: '$purple12',
  },

  '& .rhap_download-progress': {
    background: '$purple6',
  },

  '& .rhap_time': {
    color: '$purple11',
  },
});

const AudioPlayerWithSubtitles = ({
  audioSrc,
  subtitles,
  transcript,
}: AudioPlayerWithSubtitlesProps) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleTimeUpdate = (currentTime: number) => {
    const subtitle = subtitles.find(
      (s) =>
        currentTime >= timeStringToSeconds(s.startTime) &&
        currentTime <= timeStringToSeconds(s.endTime)
    );
    setCurrentSubtitle(subtitle ? subtitle.text : '');
  };
  const transcriptWithHighlight = transcript.replace(
    currentSubtitle,
    `<span class="highlight">${currentSubtitle}</span>`
  );

  return (
    <Container>
      <Transcript>
        <div
          dangerouslySetInnerHTML={{
            __html: transcriptWithHighlight,
          }}
        />
      </Transcript>
      <StyledH5AudioPlayer
        src={audioSrc}
        autoPlay
        onListen={(event) => {
          const audioElement = event.target as HTMLAudioElement;
          handleTimeUpdate(audioElement.currentTime);
        }}
        layout="horizontal"
        customAdditionalControls={[]}
      />
      {/* <div className="subtitles">{currentSubtitle}</div> */}
    </Container>
  );
};

export default AudioPlayerWithSubtitles;

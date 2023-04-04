// pages/index.tsx
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { Subtitle } from 'interfaces/Subtitle';

type HomePageProps = {};

const HomePage = ({}: HomePageProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [data, setData] = useState<{
    audio: string;
    transcript: Subtitle[];
  }>(null);

  useEffect(() => {
    // Create an EventSource to listen for SSE updates
    const eventSource = new EventSource('/api/hello');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      setProgressMsg(data.message);
    };

    // Clean up the EventSource when the component is unmounted
    return () => {
      eventSource.close();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileInputRef.current?.files || !fileInputRef.current.files[0]) return;

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await axios.post('/api/hello', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // Calculate the progress percentage
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          // Update the progress bar value
          const progressBar = document.getElementById(
            'progress-bar'
          ) as HTMLProgressElement;
          if (progressBar) {
            progressBar.value = percentCompleted;
          }
        },
      });
      setData({
        audio: response.data.audio,
        transcript: response.data.transcriptJson,
      });
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setUploading(false);
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input ref={fileInputRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {uploading && (
        <>
          <p>{progressMsg || 'Uploading...'}</p>
          <progress id="progress-bar" value={progress} max="100"></progress>
        </>
      )}

      {data && (
        <AudioPlayerWithSubtitles
          audioSrc={data.audio}
          transcript={data.transcript}
        />
      )}
    </div>
  );
};

export default HomePage;

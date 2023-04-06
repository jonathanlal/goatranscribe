import { useRef, useState } from 'react';
import axios from 'axios';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { Subtitle } from 'interfaces/Subtitle';
import { useUser } from '@auth0/nextjs-auth0/client';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

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

  const { user, error, isLoading } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileInputRef.current?.files || !fileInputRef.current.files[0]) return;

    const file = fileInputRef.current.files[0];
    setUploading(true);

    try {
      axios.post('/api/goat/sasUrl').then(async (response) => {
        const sasUrl = response.data.sasUrl;
        // api routes have 4mb limit on body size so we need to upload directly to storage
        const blobService = new BlobServiceClient(sasUrl);
        const containerClient: ContainerClient = blobService.getContainerClient(
          user?.id as string
        );
        const blobClient = containerClient.getBlockBlobClient(file.name);
        const options = { blobHTTPHeaders: { blobContentType: file.type } };
        await blobClient.uploadData(file, options);
      });
      // if (response.status === 200) {
      // const sasUrl = response.data.sasUrl;

      // const blobService = new BlobServiceClient(sasUrl);
      // const containerClient: ContainerClient = blobService.getContainerClient(
      //   user?.id as string
      // );
      // const blobClient = containerClient.getBlockBlobClient(file.name);
      // const options = { blobHTTPHeaders: { blobContentType: file.type } };
      // await blobClient.uploadData(file, options);
      // const response2 = await axios.put(sasUrl, file, {
      //   headers: {
      //     'Content-Type': fileType,
      //   },
      //   onUploadProgress: (progressEvent) => {
      //     // Calculate the progress percentage
      //     const percentCompleted = Math.round(
      //       (progressEvent.loaded * 100) / progressEvent.total
      //     );
      //     // Update the progress bar value
      //     const progressBar = document.getElementById(
      //       'progress-bar'
      //     ) as HTMLProgressElement;
      //     if (progressBar) {
      //       progressBar.value = percentCompleted;
      //     }
      //   },
      // });
      // console.log('File uploaded:', response2.data);
      // }
      // setData({
      //   audio: response.data.audio,
      //   transcript: response.data.transcriptJson,
      // });
      // console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setUploading(false);
  };
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.sid.toString()}</p>
          <p>{JSON.stringify(user)}</p>
        </div>
      )}
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

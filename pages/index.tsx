import { useRef, useState } from 'react';
import axios from 'axios';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { Subtitle } from 'interfaces/Subtitle';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    return {
      props: {
        user: session.user,
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
};

const HomePage = ({ user }: HomePageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [data, setData] = useState<{
    audio: string;
    transcript: Subtitle[];
  }>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileInputRef.current?.files || !fileInputRef.current.files[0]) return;

    const file = fileInputRef.current.files[0];
    setIsUploading(true);

    try {
      axios
        .post('/api/goat/sasUrl')
        .then(async (response) => {
          const sasUrl = response.data.sasUrl;
          // api routes have 4mb limit on body size so we need to upload directly to storage
          const blobService = new BlobServiceClient(sasUrl);
          const containerClient: ContainerClient =
            blobService.getContainerClient(user?.id as string);
          const blobClient = containerClient.getBlockBlobClient(file.name);
          const options = {
            blobHTTPHeaders: { blobContentType: file.type },
            onProgress: (progressEvent) => {
              setProgress(progressEvent.loadedBytes);
            },
          };
          setFileSize(file.size);
          console.log('bytes:', file.size);
          blobClient.uploadData(file, options).then((response) => {
            setIsUploading(false);
            const url = `https://cdn.goatranscribe.com/${user?.id as string}/${
              file.name
            }`;
            console.log('url:', url);
          });
        })
        .catch((err) => {
          console.log(err);
          setIsUploading(false);
        });
      // setData({
      //   audio: response.data.audio,
      //   transcript: response.data.transcriptJson,
      // });
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  return (
    <FrostbyteLayout user={user}>
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
      {isUploading && (
        <>
          <p>Uploading...</p>
          <progress
            id="progress-bar"
            value={progress}
            max={fileSize}
          ></progress>
        </>
      )}
      {data && (
        <AudioPlayerWithSubtitles
          audioSrc={data.audio}
          transcript={data.transcript}
        />
      )}
    </FrostbyteLayout>
  );
};

export default HomePage;

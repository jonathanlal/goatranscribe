import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { Subtitle } from 'interfaces/Subtitle';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import { Button, H, P, styled } from 'frostbyte';
import Head from 'next/head';
import { tryGoat } from 'utils/try';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

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

const Hero = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '3vh',
  textAlign: 'center',
  // justifyContent: 'center',
  position: 'relative',
  width: '100%',
  height: '90vh',
  zIndex: 1,

  '&::before': {
    content: '',
    position: 'absolute',
    backgroundImage: 'url(/mountains-light.svg)',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    opacity: 0.2,
    zIndex: -1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
});

const HomePage = ({ user }: HomePageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [url, setUrl] = useState<string>(null);
  const [uploadReady, setUploadReady] = useState(false);
  const [testFile, setTestFile] = useState<string>(null);
  const [data, setData] = useState<{
    url: {
      audio: string;
      txt?: string;
      srt: string;
    };
    subtitles: Subtitle[];
    transcript: string;
  }>(null);
  const [files, setFiles] = useState([]);
  registerPlugin(FilePondPluginFileValidateType);
  registerPlugin(FilePondPluginFileValidateSize);

  const handleSubmit = async () => {
    console.log('submitting');
    const file = files[0].file;
    console.log('file', file);
    setIsUploading(true);
    await tryGoat({
      file,
      setProgress,
      setIsUploading,
      setData,
    });
    // setTestFile(url);
    // mp3, mp4, mpeg, mpga, m4a, wav, and webm
  };

  return (
    <>
      {testFile && (
        <H5AudioPlayer
          src={testFile}
          // onListen={(event) => {
          //   const audioElement = event.target as HTMLAudioElement;
          //   handleTimeUpdate(audioElement.currentTime);
          // }}
        />
      )}
      <Head>
        <title>Transcribe audio or video to text online</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Hero>
          <div
            style={{
              maxWidth: '900px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              // backgroundColor: 'pink',
              height: '90%',
              // justifyContent: 'center',
            }}
          >
            <H
              responsive="xs"
              as="h3"
              color="purple11"
              style={{
                lineHeight: 1,
              }}
            >
              <span>
                Convert audio to text online with <i>Goatranscribe</i>
              </span>
            </H>
            <br />
            <P
              responsive="xs"
              color="purple8"
              style={{
                lineHeight: 1.2,
              }}
            >
              AI generated transcripts, summaries and translations with{' '}
              <span style={{ fontWeight: 700 }}>ChatGPT-4</span>
            </P>

            <br />
            <br />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                // height: '100%',
                width: '100%',
                // height: '300px',
                // maxWidth: '600px',
                // minWidth: '300px',
                // backgroundColor: 'blue',
              }}
            >
              <FilePond
                className="test"
                files={files}
                acceptedFileTypes={['audio/*', 'video/*']}
                labelFileTypeNotAllowed="File type not allowed"
                allowMultiple={false}
                onupdatefiles={setFiles}
                checkValidity={true}
                labelIdle='Drag & drop file anywhere,<br/> or <span class="filepond--label-action">click to browse</span>'
                credits={false}
                // stylePanelLayout="integrated"
                dropOnPage={true}
                dropOnElement={false}
                dropValidation={true}
                onaddfile={() => {
                  setUploadReady(true);
                }}
                maxFileSize="24MB" //in try they can upload any file size
                // labelButtonProcessItem="<button>Transcribe</button>"
                // stylePanelLayout
              />
              {uploadReady && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !files.length ||
                    (files.length &&
                      files.some(
                        (file) =>
                          file.fileType.indexOf('audio') === -1 &&
                          file.fileType.indexOf('video') === -1
                      ))
                  }
                >
                  Transcribe
                </Button>
              )}
              <p>Go to app to transcribe for more than 1 minute</p>
            </div>
          </div>
        </Hero>
        {user && (
          <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.sid.toString()}</p>
            <p>{JSON.stringify(user)}</p>
          </div>
        )}
        <h1>Upload File</h1>
        {isUploading && (
          <>
            <p>Uploading...</p>
            <progress id="progress-bar" value={progress} max="100"></progress>
          </>
        )}
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            Link
          </a>
        )}
        {/* <button
        onClick={async () => {
          await axios.post('/api/goat/uploadComplete', {
            entryKey: 'NSaVLLIBo1KodOy9Fbi',
          });
        }}
      >
        Test
      </button> */}
        {data && (
          <>
            <AudioPlayerWithSubtitles
              audioSrc={data.url.audio}
              subtitles={data.subtitles}
            />

            <p>{data.transcript}</p>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !files.length ||
            (files.length &&
              files.some(
                (file) =>
                  file.fileType.indexOf('audio') === -1 &&
                  file.fileType.indexOf('video') === -1
              ))
          }
        >
          Transcribe
        </button>
      </FrostbyteLayout>
    </>
  );
};

export default HomePage;

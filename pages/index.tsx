import { useState } from 'react';
import { useImmer } from 'use-immer';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { Claims, getSession } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { Button, H, P, styled } from 'frostbyte';
import Head from 'next/head';
import { tryGoat } from 'utils/try';
import styles from 'styles/Home.module.css';
import {
  UploadStatus,
  UploadStatusFields,
  UploadStatusKey,
} from 'interfaces/UploadStatus';
import { TranscribeResponse } from 'interfaces/TranscribeResponse';
import Link from 'next/link';
import { LandscapeBg } from 'components/LandscapeBg';
import { Dropzone } from 'components/Dropzone';
import { Features } from 'components/Features';
import { GetServerSidePropsContext } from 'next';
import { CTABanner } from 'components/CTABanner';
import { Bird } from 'components/home_page/Bird';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx.req, ctx.res);

  return {
    props: {
      user: session?.user || null,
    },
  };
}

type HomePageProps = {
  user: Claims;
};

const Hero = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '3vh',
  textAlign: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
});

const StyledLink = styled(Link, {
  color: '$black',
  fontWeight: 'bold',
});

const TryContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: '30px',
  marginBottom: '15px',
  // background: 'rgb(153, 86, 213, 0.7)',
  borderRadius: '5px',
  // boxShadow: '$colors$purple6 0px 8px 5px 3px',
});

const HomePage = ({ user }: HomePageProps) => {
  const [response, setResponse] = useState<TranscribeResponse>(null);
  const [status, setStatus] = useImmer<UploadStatus[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const updateStatus = (
    key: UploadStatusKey,
    statusUpdate: UploadStatusFields
  ) => {
    setStatus((statuses) => {
      const newStatus = statuses[key];
      if (newStatus) {
        newStatus.currentStatus = statusUpdate.currentStatus;
        newStatus.description = statusUpdate.description;
        newStatus.timeTaken = statusUpdate.timeTaken;
      } else {
        return {
          ...statuses,
          [key]: statusUpdate,
        };
      }
    });
  };

  const handleSubmit = async () => {
    setHasStarted(true);
    await tryGoat({
      file: files[0],
      setResponse,
      updateStatus,
    });
    setHasStarted(false);
  };

  return (
    <>
      <Head>
        <title>Transcribe audio or video to text online</title>
      </Head>

      <FrostbyteLayout user={user}>
        <LandscapeBg>
          <Hero isDarkTheme={false}>
            {/* <div
              className={`${styles.birdContainer} ${styles.birdContainerOne}`}
            >
              <div className={`${styles.bird} ${styles.birdOne}`}></div>
            </div> */}
            <Bird styles={styles} />

            {/* <div
              className={`${styles.birdContainer} ${styles.birdContainerFour}`}
            >
              <div className={`${styles.bird} ${styles.birdFour}`}></div>
            </div> */}

            <div
              style={{
                maxWidth: '900px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 20px',
                // backgroundColor: 'pink',
              }}
            >
              <H
                responsive="xs"
                as="h3"
                color="purple11"
                css={{
                  lineHeight: 1.2,
                  marginTop: '40px',
                  '@mdMax': {
                    marginTop: '25px',
                  },
                }}
              >
                <span>
                  Convert Audio to text online with <i>Goatranscribe</i>
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
                AI generated transcripts, subtitles, summaries and translations
                with <span style={{ fontWeight: 700 }}>ChatGPT-4</span>
              </P>

              <TryContainer>
                {!response && (
                  <Dropzone
                    setFiles={setFiles}
                    status={status}
                    maxFiles={1}
                    multiple={false}
                  />
                )}

                {response && (
                  <AudioPlayerWithSubtitles
                    audioSrc={response.url.audio}
                    subtitles={response.subtitles}
                    transcript={response.transcript}
                  />
                )}

                {files.length > 0 && !response && (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    loading={hasStarted}
                    css={{
                      display: 'grid',
                      placeItems: 'center', //fix loading position
                      marginTop: '20px',
                    }}
                  >
                    Transcribe
                  </Button>
                )}
              </TryContainer>

              <P color="mauve8">
                <StyledLink href={'/login'}>Go to app</StyledLink> to transcribe
                for <i>more than 1 minute</i>
              </P>
            </div>
          </Hero>
        </LandscapeBg>

        <Features />
        <CTABanner />
      </FrostbyteLayout>
    </>
  );
};

export default HomePage;

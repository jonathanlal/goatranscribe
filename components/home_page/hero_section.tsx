import { LandscapeBg } from 'components/LandscapeBg';
import { Bird } from './Bird';
import styles from 'styles/Home.module.css';
import { Button, H, P, styled, useFrostbyte } from 'frostbyte';
import { Dropzone } from 'components/Dropzone';
import AudioPlayerWithSubtitles from 'components/AudioPlayerWithSubtitles';
import { EnterIcon } from '@radix-ui/react-icons';
import { StyledLink } from 'styles/shared';
import { useRouter } from 'next/router';

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

export const HeroSection = ({
  setFiles,
  status,
  handleSubmit,
  hasStarted,
  files,
  response,
}) => {
  const router = useRouter();

  const { isDarkTheme } = useFrostbyte();

  return (
    <LandscapeBg>
      <Hero>
        <Bird styles={styles} />

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
            css={{
              lineHeight: 1.2,
            }}
          >
            <mark
              style={{
                backgroundColor: isDarkTheme
                  ? 'rgba(153,86,213, 0.7)'
                  : 'rgba(153,86,213, 0.1)',
              }}
            >
              AI generated transcripts, subtitles, summaries and translations
              with <span style={{ fontWeight: 700 }}>ChatGPT-4</span>
            </mark>
          </P>

          <TryContainer>
            {!response && (
              <Dropzone
                setFiles={setFiles}
                status={status}
                // multipleStatus={status}
                maxFiles={1}
                multiple={false}
              />
            )}

            {response && (
              <>
                <AudioPlayerWithSubtitles
                  audioSrc={response.url.audio}
                  subtitles={response.subtitles}
                  transcript={response.transcript}
                />
                <Button
                  type="button"
                  kind="success"
                  onClick={() => router.push('/api/auth/login')}
                  css={{
                    display: 'grid',
                    placeItems: 'center', //fix loading position
                    marginTop: '20px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <EnterIcon width={30} height={25} />
                    Enter app
                  </div>
                </Button>
              </>
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

          <P
            color="mauve8"
            css={{
              letterSpacing: '1px',
            }}
          >
            <StyledLink href={'/api/auth/login'}>Go to app</StyledLink> to
            transcribe for <i>more than 1 minute</i>
          </P>
        </div>
      </Hero>
    </LandscapeBg>
  );
};

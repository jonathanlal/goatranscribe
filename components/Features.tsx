import { H, P, styled, useFrostbyte } from 'frostbyte';
import { COST_PER_MINUTE } from 'utils/constants';

const FeaturesContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  minHeight: '100vh',
  width: '100%',

  variants: {
    isDarkTheme: {
      true: {
        backgroundColor: '#00101F',
      },
      false: {
        backgroundColor: '#2E2C40',
      },
    },
  },
});

const Main = styled('div', {
  maxWidth: '1200px',
  margin: '0 auto',
});

const Cards = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  listStyle: 'none',
  margin: '0',
  padding: '0',
});

const CardItem = styled('div', {
  display: 'flex',
  padding: '1rem',
  '@media (min-width: 40rem)': {
    width: '50%',
  },
  '@media (min-width: 56rem)': {
    width: '33.3333%',
  },
});

const Card = styled('div', {
  backgroundColor: 'white',
  borderRadius: '0.25rem',
  boxShadow: '0 20px 40px -14px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const CardContent = styled('div', {
  padding: '1rem',
  background:
    'linear-gradient(to bottom left, $colors$purple8 40%, $colors$blue8 100%)',
});

const CardTitle = styled(H, {
  fontWeight: '700',
  letterSpacing: '1px',
  textTransform: 'capitalize',
  margin: '0px',
});

const CardText = styled(P, {
  lineHeight: '1.5',
  marginBottom: '1.25rem',
  fontWeight: '400',
});
export const Features = () => {
  const { isDarkTheme } = useFrostbyte();

  return (
    <FeaturesContainer isDarkTheme={isDarkTheme}>
      <h1>Why Choose GoTranscribe?</h1>

      <Cards>
        <CardItem>
          <Card>
            <CardContent>
              <CardTitle color="white">Transparent Pricing</CardTitle>
              <CardText>
                No hidden fees, just pay-as-you-go. Enjoy transcription services
                at just ${COST_PER_MINUTE} per minute – that's only $1 an hour.
              </CardText>
            </CardContent>
          </Card>
        </CardItem>

        <CardItem>
          <Card>
            <CardContent>
              <CardTitle color="white">Accurate Transcriptions</CardTitle>
              <CardText>
                Benefit from human-level accuracy. Our advanced AI ensures your
                transcriptions are precise.
              </CardText>
            </CardContent>
          </Card>
        </CardItem>
      </Cards>

      {/* Add more cards here as needed */}

      {/* </Cards>
          <Card>
            <ContainerCard>
              <CardTitle>Transparent Pricing</CardTitle>
              <CardDescription>
                No hidden fees, just pay-as-you-go. Enjoy transcription services
                at just ${COST_PER_MINUTE} per minute – that's only $1 an hour.
              </CardDescription>
            </ContainerCard>
          </Card>

          <Card>
            <ContainerCard>
              <CardTitle>Accurate Transcriptions</CardTitle>
              <CardDescription>
                Benefit from human-level accuracy. Transcriptions are generated
                by OpenAI (using the Whisper model), the same company that
                created ChatGPT.
              </CardDescription>
            </ContainerCard>
          </Card> */}

      {/* Add more cards here as needed */}
      <H>Why Choose GoTranscribe?</H>
      <h2>Transparent Pricing</h2>
      <p>
        No hidden fees, just pay-as-you-go. Enjoy transcription services at just
        ${COST_PER_MINUTE} per minute – that's only $1 an hour.
      </p>

      <h2>Accurate Transcriptions</h2>
      <p>
        Benefit from human-level accuracy. Our advanced AI ensures your
        transcriptions are precise.
      </p>

      <h2>Flexibility</h2>
      <p>
        Transcribe audio or video files to suit your needs, with the capacity to
        transcribe up to 100 files simultaneously.
      </p>

      <h2>Multi-Lingual Support</h2>
      <p>
        Transcribe and translate in over 100 languages. Reach a global audience
        with ease.
      </p>

      <h2>Subtitle Generation</h2>
      <p>
        Generate subtitles effortlessly, helping you to make your content more
        accessible and engaging.
      </p>

      <h2>Summarization</h2>
      <p>
        Generate concise summaries of your transcriptions. Perfect for meetings,
        interviews, or presentations.
      </p>
    </FeaturesContainer>
  );
};

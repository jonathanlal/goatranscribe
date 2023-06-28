import { H, styled } from 'frostbyte';
import Head from 'next/head';

const Container = styled('div', {
  position: 'relative',
  minHeight: '100vh',
  padding: '3vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const Gif = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});

const Content = styled('div', {
  textAlign: 'center',

  maring: '3rem 0',
});

export default function FiveHundredError() {
  return (
    <>
      <Head>
        <title>500 | An error has occured</title>
      </Head>
      <Container>
        <Gif>
          <img src="/500.gif" alt="500 error" />
        </Gif>
        <Content>
          <H
            color="purple12"
            css={{
              margin: '20px 0',
            }}
          >
            An error has occured
          </H>
          <a href="/transcribe">Go back</a>
        </Content>
      </Container>
    </>
  );
}

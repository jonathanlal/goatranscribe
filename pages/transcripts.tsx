import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { H, P, styled } from 'frostbyte';
import { makeRequestSS } from 'utils/makeRequestSS';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { useRouter } from 'next/router';
import { CustomTable } from 'components/CustomTable';
import { useEffect, useState } from 'react';
import Spinner from 'components/Spinner';
import { ArrowDownIcon } from '@radix-ui/react-icons';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);
    console.log(session);

    const { data, error } = await makeRequestSS({
      req,
      res,
      endpoint: 'userTranscripts',
    });

    return {
      props: {
        user: session.user,
        files: data || [],
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
  files: {
    file_name: string;
    creation_date: string;
    word_count: string;
    entry_id: string;
  }[];
};

const PrimaryPanel = styled('div', {
  textAlign: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  boxShadow: '$colors$primary 0px 0px 3px 2px',
  background: '$purple3',
  color: '$purple8',
  marginBottom: '18px',
  letterSpacing: '1px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,

  '& span': {
    fontWeight: '500',
    textUnderlineOffset: '3px',
  },

  '&:hover': {
    cursor: 'pointer',
    transform: 'translateY(-2px)',
    boxShadow: '$colors$purple9 0px 0px 3px 2px',
  },
});

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Transcripts = ({ user, files }: HomePageProps) => {
  const router = useRouter();
  const [nextPageLoading, setNextPageLoading] = useState(false);

  useEffect(() => {
    router.prefetch('/transcribe');

    router.events.on('routeChangeStart', () => setNextPageLoading(true));
  }, [router]);

  return (
    <FrostbyteLayout user={user}>
      <Layout>
        {files.length === 0 && (
          <>
            <PrimaryPanel onClick={() => router.push('/transcribe')}>
              {nextPageLoading ? (
                <Spinner width={50} height={50} />
              ) : (
                <>
                  <H size={26} color="purple10">
                    Experience the magic of AI ✨
                  </H>
                  <span>Click here to start transcribing immediately!</span>
                </>
              )}
            </PrimaryPanel>

            <P
              css={{
                textAlign: 'center',
                color: '$mauve9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <ArrowDownIcon /> Your transcripts will show here{' '}
              <ArrowDownIcon />
            </P>
          </>
        )}
        {files.length > 0 && (
          <>
            <H color="purple9" css={{ lineHeight: 1.1, marginBottom: '5px' }}>
              Your transcripts:
            </H>
            <P
              size="20"
              color="purple8"
              css={{
                '@mdMax': {
                  marginBottom: '10px',
                },
              }}
            >
              Click on a file to view the transcript
            </P>
            <CustomTable
              headerItems={['Name', 'Creation', 'Word count']}
              items={files.map((file) => ({
                entry_id: file.entry_id,
                data: [
                  file.file_name,
                  formatDistanceToNow(
                    parseISO(file.creation_date.replace(' ', 'T') + 'Z'),
                    {
                      addSuffix: true,
                    }
                  ),
                  file.word_count,
                ],
                onClick: (entry_id: string) =>
                  router.push(`/transcript/${entry_id}`),
              }))}
            />
          </>
        )}
      </Layout>
    </FrostbyteLayout>
  );
};

export default Transcripts;

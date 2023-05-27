import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { Button, H, Seperator, Toast, styled, Tabs, Modal } from 'frostbyte';
import { useRouter } from 'next/router';
import { useTranscriptSeenQuery } from 'store/services/transcribe';
import { makeRequestSS } from 'utils/makeRequestSS';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from 'react';
import {
  ClipboardCopyIcon,
  DownloadIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { CustomTable, Row, THeader } from 'components/CustomTable';
import { formatBytes } from 'utils/formatBytes';
import { formatDistanceToNow, formatDuration, parseISO } from 'date-fns';
import { TBody, Table } from 'styles/table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { TranslateModal } from 'components/transcript_page/TranslateModal';

import { TranslationsTable } from 'components/transcript_page/TranslationsTable';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, query, params } = ctx;
    const session = await getSession(req, res);

    const entry_id = query.entry_id;
    const lang = query.lang || 'default';
    console.log('entry_id', entry_id);
    console.log('lang', lang);

    const { data, error } = await makeRequestSS({
      req,
      res,
      endpoint: 'transcript',
      params: { entry_id, lang },
    });

    // console.log(data);

    return {
      props: {
        user: session.user,
        data: data || [],
        entry_id,
        currentLang: lang,
      },
    };
  },
});

const PageLayout = styled('div', {
  padding: '6vw 3vw',
  minHeight: '100vh',
});

const TranscriptContent = styled('div', {
  // marginTop: '10px',
  fontSize: '22px',
  backgroundColor: '$purple3',
  color: '$primaryContrast',
  padding: '15px',
  borderRadius: '5px',
  lineHeight: '1.5',
});

const RightButtons = styled('div', {
  display: 'flex',
  flexFlow: 'row-reverse',
  alignItems: 'center',
  gap: '10px',
  // right: '0',
  // backgroundColor: '$sky6',
  // textAlign: 'right',
});

const LeftButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  // right: '0',
  // backgroundColor: '$sky6',
  // textAlign: 'right',
});

const ButtonsWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '25px',
  gap: '15px',
  '@mdMax': {
    flexDirection: 'column',
  },
});

const TabsWrapper = styled('div', {
  marginTop: '20px',
});

const Layout = ({ children, entry_id }) => {
  useTranscriptSeenQuery({ entryKey: entry_id });

  return <PageLayout>{children}</PageLayout>;
};

const Transcript = ({
  user,
  data,
  entry_id,
  currentLang,
}: {
  user: Claims;
  data: {
    transcript_content: string;
    subtitles_content: string;
    transcript_creation_date: string;
    word_count: number;
    transcribe_time_taken: number;
    audio_duration: number;
    audio_file_size: number;
    file_name: string;
    cost: number;
    language: string;
    iso: string;
    translations: string[];
    char_count: number;
  };
  entry_id: string;
  currentLang: string;
}) => {
  const [copied, setCopied] = useState(false);

  const [addTranslationModal, setAddTranslationModal] = useState(false);
  const [newTranslations, setNewTranslations] = useState<string[]>([]);

  return (
    <FrostbyteLayout user={user}>
      <Layout entry_id={entry_id}>
        <CustomTable
          color={'blue'}
          headerItems={[
            'Name',
            'Creation',
            'Word count',
            // 'Time taken',
            // 'File size',
            'Audio duration',
            'Paid',
          ]}
          items={[
            {
              data: [
                data.file_name,
                formatDistanceToNow(parseISO(data.transcript_creation_date), {
                  addSuffix: true,
                }),
                `${data.word_count} words`,
                // formatDuration(
                //   {
                //     hours: Math.floor(data.transcribe_time_taken / 3600),
                //     minutes: Math.floor(
                //       (data.transcribe_time_taken % 3600) / 60
                //     ),
                //     seconds: Math.round(data.transcribe_time_taken % 60),
                //   },
                //   {
                //     format: ['minutes', 'seconds'],
                //   }
                // ),
                // formatBytes(data.audio_file_size),
                formatDuration(
                  {
                    hours: Math.floor(data.audio_duration / 3600),
                    minutes: Math.floor((data.audio_duration % 3600) / 60),
                    seconds: Math.round(data.audio_duration % 60),
                  },
                  {
                    format: ['hours', 'minutes', 'seconds'],
                  }
                ),
                `$${data.cost}`,
              ],
            },
          ]}
        />
        <Seperator color="indigo8" css={{ margin: '25px 0' }} />

        <TranslationsTable
          setAddTranslationModal={setAddTranslationModal}
          currentLang={currentLang}
          data={data}
          entry_id={entry_id}
          user={user}
          newTranslations={newTranslations}
          setNewTranslations={setNewTranslations}
        />

        <ButtonsWrapper>
          <LeftButtons>
            <Button size="xs" color="grass4">
              + Create Summary
            </Button>
            <Button size="xs" color="grass4">
              + Add paragraphs
            </Button>
          </LeftButtons>

          <RightButtons>
            <Button
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              color="purple4"
              size="xs"
            >
              <DownloadIcon width={20} height={20} />
              Download
            </Button>
            <CopyToClipboard
              text={data.transcript_content}
              onCopy={() => setCopied(true)}
            >
              <Button
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                color="purple4"
                size="xs"
              >
                <ClipboardCopyIcon width={20} height={20} />
                Copy
              </Button>
            </CopyToClipboard>
          </RightButtons>
        </ButtonsWrapper>

        <TranscriptContent>{data.transcript_content}</TranscriptContent>

        <Toast
          setShow={setCopied}
          show={copied}
          kind="success"
          title={'Copied to clipboard'}
        />
        {/* <Modal setOpen={setAddTranslationModal} open={addTranslationModal}>
          Add translations...
        </Modal> */}
        <TranslateModal
          addTranslationModal={addTranslationModal}
          setAddTranslationModal={setAddTranslationModal}
          entryKey={entry_id}
          translations={[...data.translations, data.iso, ...newTranslations]}
          char_count={data.char_count}
        />
      </Layout>
    </FrostbyteLayout>
  );
};

export default Transcript;

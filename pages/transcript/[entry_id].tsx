import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { Button, H, Seperator, Toast, styled, Collapsible } from 'frostbyte';
import { useRouter } from 'next/router';
import { useTranscriptSeenQuery } from 'store/services/transcribe';
import { makeRequestSS } from 'utils/makeRequestSS';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useEffect, useState } from 'react';
import {
  ClipboardCopyIcon,
  DownloadIcon,
  PlayIcon,
  StopIcon,
} from '@radix-ui/react-icons';
import { CustomTable } from 'components/CustomTable';
import { formatDistanceToNow, formatDuration, parseISO } from 'date-fns';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { TranslateModal } from 'components/transcript_page/TranslateModal';

import { TranslationsTable } from 'components/transcript_page/TranslationsTable';
import { RTLeftLanguages } from 'utils/translateLanguages';
import { DownloadModal } from 'components/transcript_page/DownloadModal';
import { SummaryModal } from 'components/transcript_page/SummaryModal';
import { CSSTransition } from 'react-transition-group';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useInitFirebaseQuery } from 'store/services/firebase';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { useAppDispatch } from 'store/hooks';
import { setTasksLoading } from 'store/features/user';
import { useLazyGetSummaryQuery } from 'store/services/summary';
import Spinner from 'components/Spinner';
import { Subtitle } from 'interfaces/Subtitle';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Head from 'next/head';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, query, params } = ctx;
    const session = await getSession(req, res);

    const entry_id = query.entry_id;
    const lang = query.lang || 'default';
    // console.log('entry_id', entry_id);
    // console.log('lang', lang);

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
        currentLang: lang === 'default' ? data.iso : lang,
      },
    };
  },
});

const AudioPlayerContainer = styled('div', {
  position: 'fixed',
  bottom: 0,
  width: '100%',

  '& .rhap_container': {
    backgroundColor: '$purple1',
  },
});

const StyledH5AudioPlayer = styled(H5AudioPlayer, {
  '& .rhap_main-controls-button, .rhap_volume-button': {
    color: '$purple11',
  },

  '& .rhap_progress-bar, .rhap_volume-bar': {
    background: '$purple1',
  },

  '& .rhap_volume-indicator, .rhap_progress-indicator': {
    background: '$purple11',
  },
  '& .rhap_progress-filled': {
    background: '$purple12',
  },

  '& .rhap_download-progress': {
    background: '$purple6',
  },

  '& .rhap_time': {
    color: '$purple11',
  },
});

const PageLayout = styled('div', {
  padding: '6vw 3vw',
  minHeight: '100vh',
});

const SummaryContainer = styled('div', {
  fontSize: '22px',
  backgroundColor: '$plum3',
  color: '$primaryContrast',
  padding: '15px',
  borderRadius: '5px',
  lineHeight: '1.5',
  marginBottom: '25px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});
const TranscriptContent = styled('div', {
  // marginTop: '10px',
  fontSize: '22px',
  backgroundColor: '$purple3',
  color: '$primaryContrast',
  padding: '15px',
  borderRadius: '5px',
  lineHeight: '1.5',

  '& .highlight': {
    backgroundColor: '$purple11',
    color: '$purple1',
  },

  variants: {
    isRTL: {
      true: {
        direction: 'rtl',
      },
      false: {
        direction: 'ltr',
      },
    },
  },
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

const firebaseConfig = {
  apiKey: 'AIzaSyCOpqGCG4G7YUFKAjhnpTQavD5NtnRtnis',
  authDomain: 'goatranscribe.firebaseapp.com',
  databaseURL:
    'https://goatranscribe-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'goatranscribe',
  storageBucket: 'goatranscribe.appspot.com',
  messagingSenderId: '711650048134',
  appId: '1:711650048134:web:78499286f648f1f5ebf907',
};

interface Task {
  status: string;
  entry_key: string;
  task_type: string;
  date_started: string;
  time_taken: number;
  description: string;
  file_name: string;
  task_id: string;
  seen: boolean;
}

const Layout = ({ entry_id, currentLang, data, user }) => {
  useTranscriptSeenQuery({ entryKey: entry_id });

  const dispatch = useAppDispatch();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const [copied, setCopied] = useState(false);

  const [addTranslationModal, setAddTranslationModal] = useState(false);
  const [addSummaryModal, setAddSummaryModal] = useState(false);
  const [newTranslations, setNewTranslations] = useState<string[]>([]);
  const [translateTaskLoading, setTranslateTaskLoading] = useState(false);
  const [summaryTaskLoading, setSummaryTaskLoading] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [transcript, setTranscript] = useState(data.transcript_content);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  // const [showParagraphed, setShowParagraphed] = useState(false);
  // const [paragraphTaskLoading, setParagraphTaskLoading] = useState(false);
  // const [addParagraphModal, setAddParagraphModal] = useState(false);

  const [summaryTask, setSummaryTask] = useState<Task>({
    status: 'pending',
    entry_key: '',
    task_type: '',
    date_started: '',
    time_taken: 0,
    description: 'Summary is being created...',
    file_name: '',
    task_id: '',
    seen: false,
  });

  // const [paragraphTask, setParagraphTask] = useState<Task>({
  //   status: 'pending',
  //   entry_key: '',
  //   task_type: '',
  //   date_started: '',
  //   time_taken: 0,
  //   description: 'Adding paragraphs to transcript...',
  //   file_name: '',
  //   task_id: '',
  //   seen: false,
  // });
  const [getSummary, { data: summary_content }] = useLazyGetSummaryQuery();

  // const [getParagraphed, { data: paragraph_content }] =
  //   useLazyGetParagraphedQuery();
  const [translationsTasks, setTranslationsTasks] = useState<Task[]>([]);

  const { data: customToken } = useInitFirebaseQuery();
  if (customToken) {
    const auth = getAuth(app);
    signInWithCustomToken(auth, customToken);
  }

  const allTranslations =
    currentLang !== 'default'
      ? [...data.translations, data.iso]
      : data.translations;

  useEffect(() => {
    if (user && customToken) {
      const user_id = user.id as string;
      const tasksRef = ref(db, `users/${user_id}/tasks`);
      // Listen for changes
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const newTasks: Task[] = [];
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          const task_id = childSnapshot.key;
          //   const upload = uploads.find(
          //     (upload) => upload.entry_id === task.entry_key
          //   );
          //   console.log(task);
          if (
            task.task_type === 'translate' &&
            task.entry_key === entry_id &&
            !allTranslations.includes(task.file_name)
          ) {
            newTasks.push({ ...task, task_id: task_id });

            if (!allTranslations.includes(task.file_name)) {
              setNewTranslations([...newTranslations, task.file_name]);
            }
          }
          if (
            task.task_type === 'summarize' &&
            task.entry_key === entry_id &&
            !data.hasSummary
          ) {
            setSummaryTask(task);
            setShowSummary(true);
            if (task.status === 'completed' && !summary_content) {
              getSummary({ entryKey: entry_id }).unwrap();
            }
          }

          // if (
          //   task.task_type === 'paragraph' &&
          //   task.entry_key === entry_id &&
          //   !data.hasParagraphs
          // ) {
          //   setParagraphTask(task);
          //   setShowParagraphed(true);
          //   if (task.status === 'completed' && !paragraph_content) {
          //     getParagraphed({ entryKey: entry_id }).unwrap();
          //   }
          // }
        });
        setTranslateTaskLoading(false);
        setTranslationsTasks(newTasks.reverse());
        dispatch(setTasksLoading(false));
        setSummaryTaskLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, customToken]);

  const PlayTranscript = () => {
    setShowPlayer(true);
  };
  const StopTranscript = () => {
    setShowPlayer(false);
    setTranscript(data.transcript_content);
    setCurrentSubtitle('');
  };
  const timeStringToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handleTimeUpdate = (currentTime: number) => {
    const subtitle = data.subtitles_content.find(
      (s) =>
        currentTime >= timeStringToSeconds(s.startTime) &&
        currentTime <= timeStringToSeconds(s.endTime)
    );
    setCurrentSubtitle(subtitle ? subtitle.text : '');
    if (currentSubtitle !== '') {
      const transcriptWithHighlight = data.transcript_content.replace(
        currentSubtitle,
        `<span class="highlight" id="highlight">${currentSubtitle}</span>`
      );
      setTranscript(transcriptWithHighlight);
      const element = document.getElementById('highlight');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>Transcript | {data.file_name}</title>
      </Head>
      <PageLayout>
        {' '}
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
                formatDistanceToNow(
                  parseISO(
                    data.transcript_creation_date.replace(' ', 'T') + 'Z'
                  ),
                  {
                    addSuffix: true,
                  }
                ),
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
          tasks={translationsTasks}
          translateTaskLoading={translateTaskLoading}
          allTranslations={allTranslations}
        />
        {(data.hasSummary || summaryTaskLoading || showSummary) && (
          <CSSTransition
            in={showSummary || summaryTaskLoading}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <SummaryContainer>
              {data.summary_content && data.summary_content}
              {summaryTask.status === 'completed' && summary_content}
              {summaryTask.status === 'summary_failed' &&
                summaryTask.description}
              {summaryTask.status !== 'completed' &&
                summaryTask.status !== 'summary_failed' && (
                  <>
                    <Spinner width={25} height={25} />
                    {summaryTask.description}
                  </>
                )}
              {/* 
              {data.summary_content ? (
                data.summary_content
              ) : summaryTask.status !== 'completed' ? (
                <>
                  <Spinner width={25} height={25} />
                  {summaryTask.description}
                </>
              ) : (
                summary_content
              )} */}
            </SummaryContainer>
          </CSSTransition>
        )}
        <ButtonsWrapper>
          {data.iso === currentLang && (
            <LeftButtons>
              {!data.hasSummary && !summary_content && (
                <Button
                  size="xs"
                  color="grass4"
                  onClick={() => setAddSummaryModal(true)}
                  disabled={summaryTaskLoading}
                >
                  + Create Summary
                </Button>
              )}
              {(data.hasSummary || summary_content) && (
                <Button
                  size="xs"
                  color="grass4"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  {`${showSummary ? 'Hide' : 'Show'}`} Summary
                </Button>
              )}

              {/* {!data.hasParagraphs && !paragraph_content && (
              <Button
                size="xs"
                color="grass4"
                onClick={() => setAddParagraphModal(true)}
                disabled={paragraphTaskLoading}
              >
                + Add paragraphs
              </Button>
            )} */}
              {/* {(data.hasParagraphs || paragraph_content) && (
              <Button
                size="xs"
                color="grass4"
                onClick={() => setShowParagraphed(!showParagraphed)}
              >
                {`${showParagraphed ? 'Hide' : 'Show'}`} Paragraphs
              </Button>
            )} */}
            </LeftButtons>
          )}

          <RightButtons>
            <Button
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
              color="purple4"
              size="xs"
              onClick={() => setDownloadModal(true)}
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

            {!showPlayer ? (
              <Button
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                color="purple4"
                size="xs"
                onClick={PlayTranscript}
              >
                <PlayIcon width={20} height={20} />
                Play
              </Button>
            ) : (
              <Button
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                color="purple4"
                size="xs"
                onClick={StopTranscript}
              >
                <StopIcon width={20} height={20} />
                Stop
              </Button>
            )}
          </RightButtons>
        </ButtonsWrapper>
        <TranscriptContent
          isRTL={RTLeftLanguages.includes(currentLang)}
          dangerouslySetInnerHTML={{
            __html: transcript,
          }}
        >
          {/* {paragraphTaskLoading && (
          <>
            <Spinner width={25} height={25} /> {paragraphTask.description}
          </>
        )} */}
          {/* {showParagraphed
          ? data.paragraph_content || paragraph_content
          : data.transcript_content} */}
        </TranscriptContent>
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
          setTranslateTaskLoading={setTranslateTaskLoading}
        />
        <DownloadModal
          downloadModal={downloadModal}
          setDownloadModal={setDownloadModal}
          entryKey={entry_id}
          targetLang={currentLang === data.iso ? 'default' : currentLang}
          file_name={data.file_name}
        />
        <SummaryModal
          setAddSummaryModal={setAddSummaryModal}
          addSummaryModal={addSummaryModal}
          entryKey={entry_id}
          char_count={data.char_count}
          setSummaryTaskLoading={setSummaryTaskLoading}
        />
        {/* <ParagraphModal
        entryKey={entry_id}
        char_count={data.char_count}
        addParagraphModal={addParagraphModal}
        setAddParagraphModal={setAddParagraphModal}
        setParagraphTaskLoading={setParagraphTaskLoading}
      /> */}
      </PageLayout>
      {showPlayer && (
        <AudioPlayerContainer>
          <StyledH5AudioPlayer
            src={data.audioSrc}
            autoPlay
            onListen={(event) => {
              const audioElement = event.target as HTMLAudioElement;
              handleTimeUpdate(audioElement.currentTime);
            }}
            layout="horizontal"
            customAdditionalControls={[]}
          />
        </AudioPlayerContainer>
      )}
    </>
  );
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
    subtitles_content: Subtitle[];
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
    hasSummary: boolean;
    summary_content: string;
    hasParagraphs: boolean;
  };
  entry_id: string;
  currentLang: string;
}) => {
  return (
    <FrostbyteLayout user={user}>
      <Layout
        entry_id={entry_id}
        currentLang={currentLang}
        data={data}
        user={user}
      />
    </FrostbyteLayout>
  );
};

export default Transcript;

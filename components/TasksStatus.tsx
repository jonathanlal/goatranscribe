import { use, useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useInitFirebaseQuery } from 'store/services/firebase';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { CustomTable, Item } from './CustomTable';
import { formatDistanceToNow, formatDuration, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import {
  useRetryFailedTranscribeMutation,
  useTranscriptsSeenMutation,
} from 'store/services/transcribe';
import { Button, H, P, Seperator, styled, useFrostbyte } from 'frostbyte';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CSSTransition } from 'react-transition-group';
import Spinner from './Spinner';
import { ButtonLink } from './ButtonLink';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { setTasksLoading } from 'store/features/user';
import { TitleWithIconWrapper } from 'styles/shared';
import { Link2Icon } from '@radix-ui/react-icons';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLazyGetUploadsQuery } from 'store/services/upload';

const RetryContainer = styled('div', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  zIndex: 1,
  '&:hover': {
    color: '$primary',
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

export const TasksStatus = ({ user }) => {
  const dispatch = useAppDispatch();
  const { tasksLoading } = useAppSelector((state) => state.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const { data: customToken } = useInitFirebaseQuery();
  const [markAllAsSeen] = useTranscriptsSeenMutation();
  const [retryTranscribe] = useRetryFailedTranscribeMutation();
  const [getUploads] = useLazyGetUploadsQuery();
  const { uploads } = useAppSelector((state) => state.user);
  if (customToken) {
    const auth = getAuth(app);
    signInWithCustomToken(auth, customToken);
  }
  // console.log(uploads);

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
          if (!task.seen && task.task_type === 'transcribe')
            newTasks.push({ ...task, task_id: task_id });

          if (task.task_type === 'transcribe' && task.status === 'completed') {
            getUploads().unwrap();
          }
        });
        setTasks(newTasks.reverse());
        dispatch(setTasksLoading(false));
      });

      return () => unsubscribe();
    }
  }, [user, customToken]);

  const markAllAsSeenHandler = async () => {
    const taskIds = tasks
      .filter((task) => task.status === 'completed' && task.task_id)
      .map((task) => task.task_id);

    await markAllAsSeen({ taskIds });
  };

  const error_statuses = [
    'transcribe_failed',
    'file_too_large',
    'download_failed',
  ];
  const hasError = (status: string) => error_statuses.includes(status);

  const disabled_statuses = [
    'encoding',
    'downloading_file',
    'chunking',
    'transcribing',
    'uploading_subtitles',
    'uploading_transcript',
    'detecting_language',
  ];
  const isDisabled = (status: string) => disabled_statuses.includes(status);

  const showMarkAsSeen = tasks.some((task) => task.status === 'completed');

  const { isDarkTheme } = useFrostbyte();

  const onRetry = (entryKey: string) => {
    retryTranscribe({ entryKey });
  };

  return (
    <>
      {/* why is this not showing? */}
      {/* {!tasksLoading && (
        <SkeletonTheme
          baseColor={isDarkTheme ? '#161618' : ''}
          highlightColor={isDarkTheme ? '#1F1F1F' : ''}
        >
          <CustomTable
            color={'blue'}
            headerItems={['Name', 'Started', 'Status', 'Time taken']}
            items={tasks.map((t) => ({
              disabled: true,
              data: [
                <Skeleton width="100%" height="28px" />,
                <Skeleton width="100%" height="28px" />,
                <Skeleton width="100%" height="28px" />,
                <Skeleton width="100%" height="28px" />,
              ],
            }))}
          />
        </SkeletonTheme>
      )} */}
      <CSSTransition
        in={tasksLoading || tasks.length > 0}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <>
          <TitleWithIconWrapper color="blue">
            <Link2Icon width={30} height={30} />
            <H color="indigo9">Recently transcribed:</H>
          </TitleWithIconWrapper>
          {/* <H color="indigo9" css={{ lineHeight: 1.1, marginBottom: '5px' }}>
            Recently transcribed:
          </H> */}
          <P
            size="20"
            color="blue8"
            css={{
              '@mdMax': {
                marginBottom: '10px',
              },
            }}
          >
            Click on a file to view the transcript
          </P>
          {showMarkAsSeen && (
            <ButtonLink onClick={markAllAsSeenHandler}>
              Mark all as seen
            </ButtonLink>
          )}
          <CustomTable
            color={'blue'}
            headerItems={['Name', 'Started', 'Status', 'Time taken']}
            items={[
              tasksLoading
                ? {
                    disabled: true,
                    data: [
                      <Skeleton width="100%" height="28px" />,
                      <Skeleton width="100%" height="28px" />,
                      <Skeleton width="100%" height="28px" />,
                      <Skeleton width="100%" height="28px" />,
                    ],
                  }
                : { data: [] },
              ...tasks.map((t) => ({
                entry_id: t.entry_key,
                disabled: isDisabled(t.status),
                onClick: hasError(t.status)
                  ? () => onRetry(t.entry_key)
                  : () => router.push(`/transcript/${t.entry_key}`),
                data: [
                  t.file_name,
                  t.date_started
                    ? formatDistanceToNow(
                        parseISO(t.date_started.replace(' ', 'T') + 'Z'),
                        {
                          addSuffix: true,
                        }
                      )
                    : null,
                  t.description,
                  t.time_taken ? (
                    formatDuration(
                      {
                        minutes: Math.floor((t.time_taken % 3600) / 60),
                        seconds: Math.round(t.time_taken % 60),
                      },
                      {
                        format: ['minutes', 'seconds'],
                      }
                    )
                  ) : hasError(t.status) ? (
                    <RetryContainer>
                      <ExclamationTriangleIcon width={20} height={20} />
                      Retry
                    </RetryContainer>
                  ) : (
                    <Spinner />
                  ),
                ],
              })),
            ]}
          />
          <Seperator color="indigo8" css={{ marginTop: '25px' }} />

          <br />
        </>
      </CSSTransition>
    </>
  );
};

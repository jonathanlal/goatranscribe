import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { setTasksLoading } from 'store/features/user';
import { useAppDispatch } from 'store/hooks';
import { useInitFirebaseQuery } from 'store/services/firebase';
import { TBody, Table } from 'styles/table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Row, THeader } from 'components/CustomTable';
import { getLanguageName } from 'utils/translateLanguages';
import { Seperator } from 'frostbyte';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { all } from 'axios';
import Spinner from 'components/Spinner';

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

export const TranslationsTable = ({
  user,
  data,
  currentLang,
  entry_id,
  setAddTranslationModal,
  newTranslations,
  setNewTranslations,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const allTranslations =
    currentLang !== 'default'
      ? [...data.translations, data.iso].filter((x) => x !== currentLang)
      : data.translations;

  const { data: customToken } = useInitFirebaseQuery();
  if (customToken) {
    const auth = getAuth(app);
    signInWithCustomToken(auth, customToken);
  }

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
          if (!task.seen && task.task_type === 'translate') {
            newTasks.push({ ...task, task_id: task_id });

            if (!allTranslations.includes(task.file_name)) {
              setNewTranslations([...newTranslations, task.file_name]);
            }
          }
        });
        setTasks(newTasks.reverse());
        dispatch(setTasksLoading(false));
      });

      return () => unsubscribe();
    }
  }, [user, customToken]);

  return (
    <>
      <Table>
        <THeader items={['Language', 'Status']} color="purple" />
        <TBody>
          <Row
            color="purple"
            disabled={true}
            key={'currentLang'}
            entry_id={'wtf'}
            items={
              currentLang !== 'default'
                ? [
                    getLanguageName(currentLang),
                    <CheckCircledIcon width={20} height={20} />,
                  ]
                : [
                    getLanguageName(data.iso),
                    <CheckCircledIcon width={20} height={20} />,
                  ]
            }
          />
          {tasks.map((t) => (
            <Row
              color="purple"
              disabled={t.status !== 'completed'}
              key={'currentLang'}
              entry_id={'wtf'}
              items={[
                getLanguageName(t.file_name),
                t.status === 'completed' ? (
                  <CheckCircledIcon width={20} height={20} />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Spinner width={20} height={20} />
                    <span>{t.description}</span>
                  </div>
                ),
              ]}
              onClick={() =>
                t.status === 'completed'
                  ? router.push(`/transcript/${entry_id}?lang=${t.file_name}`)
                  : {}
              }
            />
          ))}
          {allTranslations.map((translation) => (
            <Row
              color="purple"
              disabled={false}
              key={'currentLang'}
              entry_id={'wtf'}
              items={[
                getLanguageName(translation),
                <CheckCircledIcon width={20} height={20} />,
              ]}
              onClick={() =>
                router.push(`/transcript/${entry_id}?lang=${translation}`)
              }
            />
          ))}
          <Row
            color="purple"
            key={'wtf2'}
            entry_id={'wtf'}
            items={[<div>+ Add Translation</div>]}
            onClick={() => setAddTranslationModal(true)}
          />
        </TBody>
      </Table>
      <Seperator color="purple8" css={{ margin: '25px 0' }} height="3px" />
    </>
  );
};

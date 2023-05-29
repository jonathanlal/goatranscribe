import { useRouter } from 'next/router';
import { TBody, Table } from 'styles/table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Row, THeader } from 'components/CustomTable';
import { getLanguageName } from 'utils/translateLanguages';
import { Seperator } from 'frostbyte';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import Spinner from 'components/Spinner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const TranslationsTable = ({
  data,
  currentLang,
  entry_id,
  setAddTranslationModal,
  tasks,
  translateTaskLoading,
  allTranslations,
}) => {
  const router = useRouter();

  console.log('currentLang', currentLang);
  console.log('data.translations', data.translations);

  // console.log('allTranslations', allTranslations);

  return (
    <>
      <Table>
        <THeader items={['Language', 'Status']} color="purple" />
        <TBody>
          {allTranslations
            .sort((a, b) =>
              a === currentLang ? -1 : b === currentLang ? 1 : 0
            )
            .map((translation: string) => (
              <Row
                color="purple"
                disabled={currentLang === translation}
                key={translation}
                items={[
                  getLanguageName(translation),
                  <CheckCircledIcon width={20} height={20} />,
                ]}
                onClick={() =>
                  router.push(`/transcript/${entry_id}?lang=${translation}`)
                }
              />
            ))}
          {[
            translateTaskLoading ? (
              <Row
                disabled={true}
                items={[
                  <Skeleton width="100%" height="28px" />,
                  <Skeleton width="100%" height="28px" />,
                ]}
              />
            ) : (
              <></>
            ),
            ...tasks.map((t) => (
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
            )),
          ]}

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

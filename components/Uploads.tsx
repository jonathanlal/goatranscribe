import { Button, CheckBox, H, P, styled, useFrostbyte } from 'frostbyte';
import { CustomTable } from './CustomTable';
import { formatDistanceToNow, formatDuration, parseISO } from 'date-fns';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import {
  useGetUploadsQuery,
  useLazyGetUploadsQuery,
} from 'store/services/upload';
import { formatBytes } from 'utils/formatBytes';
import { useImmer } from 'use-immer';
import { useEffect, useState } from 'react';
import { COST_PER_SECOND } from 'utils/constants';
import { useGetBalanceQuery } from 'store/services/balance';
import { useRouter } from 'next/router';
import { CSSTransition } from 'react-transition-group';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Upload } from 'interfaces/Upload';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setUploads } from 'store/features/user';
import {
  useGetTranscribeStatusQuery,
  useTranscribeEntriesMutation,
} from 'store/services/transcribe';
import { ca } from 'date-fns/locale';
import Spinner from './Spinner';

// const fadeIn = keyframes({
//     from: {
//       opacity: 0,
//       transform: 'translateY(-20px)',
//     },
//     to: {
//       opacity: 1,
//       transform: 'translateY(0)',
//     },
//   });

//   const fadeOut = keyframes({
//     from: {
//       opacity: 1,
//       transform: 'translateY(0)',
//     },
//     to: {
//       opacity: 0,
//       transform: 'translateY(-20px)',
//     },
//   });

const ErrorPanel = styled('div', {
  textAlign: 'center',
  borderRadius: '5px',
  padding: '20px',
  boxShadow: '$colors$tomato7 0px 0px 3px 2px',
  background: '$tomato4',
  color: '$tomato9',
  marginBottom: '20px',
  fontSize: 22,

  '& span': {
    fontWeight: 'bold',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },

  '&:hover': {
    cursor: 'pointer',
    transform: 'translateY(-2px)',
    // animation: 'wiggle 0.2s ease-in-out',
    boxShadow: '$colors$tomato9 0px 0px 3px 2px',
  },
});

const PrimaryPanel = styled('div', {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  boxShadow: '$colors$primary 0px 0px 3px 2px',
  background: '$purple3',
  color: '$primary',
  marginBottom: '20px',
  fontSize: 22,
});
// const Bold = styled('span', {
//   fontWeight: 'bold',
// });

export const Uploads = ({ ssUploads }: { ssUploads: Upload[] }) => {
  const dispatch = useAppDispatch();
  const { uploads } = useAppSelector((state) => state.user);
  const router = useRouter();
  const { data: balance } = useGetBalanceQuery();
  const [hasFunds, setHasFunds] = useState(true);
  const [checkedUploads, setCheckedUploads] = useImmer<
    {
      entry_id: string;
      status: 'pending' | 'processing' | 'complete' | 'failed';
      cost: number;
      duration: number;
    }[]
  >([]);
  const [cost, setCost] = useState(0);
  const [totalDuration, setTotalDuration] = useState('');
  const [transcribeTaskId, setTranscribeTaskId] = useState('');

  const { isFetching, isSuccess, data } = useGetTranscribeStatusQuery(
    { transcribeTaskId },
    {
      pollingInterval: 1000,
      skip: !transcribeTaskId,
    }
  );

  useEffect(() => {
    dispatch(setUploads(ssUploads));
  }, []);

  // useEffect(() => {
  //   if (initialUploadsLength !== ssUploads.length) {
  //     console.log('getting uploads');
  //     getUploads();
  //   }
  // }, [initialUploadsLength]);

  const [transcribeEntries] = useTranscribeEntriesMutation();

  const startTranscribing = async () => {
    console.log('checkedUploads', checkedUploads);
    try {
      const { instanceId } = await transcribeEntries({
        entryKeys: checkedUploads.map((u) => u.entry_id),
      }).unwrap();
      console.log('instanceId', instanceId);
      setTranscribeTaskId(instanceId);
    } catch (e) {
      console.log('error', e);
    }
  };

  //when data is fetched, add it to checkedUploads (making it checked automaatcally)
  // useEffect(() => {
  //   if (isSuccess && uploads.length > 0) {
  //     setCheckedUploads((draft) => {
  //       // Add newly fetched uploads to checkedUploads if they're not already there
  //       uploads.forEach((u) => {
  //         if (!draft.some((cu) => cu.entry_id === u.entry_id)) {
  //           draft.push(u);
  //         }
  //       });
  //     });
  //   }
  // }, [isSuccess, uploads?.length]);

  //when user checks/unchecks a file
  useEffect(() => {
    const calculateCostAndDuration = async () => {
      let totalCost = checkedUploads.reduce(
        (acc, item) => acc + item.duration * COST_PER_SECOND,
        0
      );
      let totalTime = checkedUploads.reduce(
        (acc, item) => acc + item.duration,
        0
      );

      const hours = Math.floor(totalTime / 3600);
      const minutes = Math.floor((totalTime % 3600) / 60);
      const seconds = Math.round(totalTime % 60);

      setCost(parseFloat(totalCost.toFixed(2)));
      setTotalDuration(
        formatDuration(
          { hours, minutes, seconds },
          { format: ['hours', 'minutes', 'seconds'] }
        )
      );
      setHasFunds(balance >= totalCost);
    };

    if (checkedUploads.length > 0 && balance !== undefined) {
      calculateCostAndDuration();
    } else {
      setCost(0);
      setTotalDuration('');
      setHasFunds(true);
    }
  }, [checkedUploads.length, balance]);

  const { isDarkTheme } = useFrostbyte();
  //   console.log('hasFunds', hasFunds);
  //   console.log('cost', cost);

  return (
    <>
      {!hasFunds && (
        <ErrorPanel onClick={() => router.push('/balance')}>
          Insufficient funds <span>click here</span> to add to your wallet
        </ErrorPanel>
      )}

      {/* {cost > 0 && ( */}
      <CSSTransition
        in={cost > 0}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <PrimaryPanel>
          <P>
            Total cost: <b>${cost}</b>
          </P>
          <P>
            Total duration: <b>{totalDuration}</b>
          </P>
        </PrimaryPanel>
      </CSSTransition>
      {/* )} */}
      {/* {isFetching && (
        <SkeletonTheme
          baseColor={isDarkTheme ? '#161618' : ''}
          highlightColor={isDarkTheme ? '#1F1F1F' : ''}
        >
          <Skeleton
            width="100%"
            height="300px"
            style={{
              marginTop: '20px',
            }}
          />
        </SkeletonTheme>
      )} */}
      <h1>instanceID: {transcribeTaskId}</h1>
      {isFetching && <div>FETCHING TRANSCRIBE STATUS</div>}
      {isSuccess && <div>FETCHING RESULTS</div>}
      {data && <>data: {JSON.stringify(data)}</>}
      {uploads && uploads.length > 0 && (
        <>
          {/* <H>Uploads</H> */}
          <CustomTable
            headerItems={[
              'Name',
              'Uploaded',
              'Size',
              'Duration',
              'Cost',
              'Status',
              'Select',
            ]}
            items={uploads.map((u) => ({
              entry_id: u.entry_id,
              data: [
                u.file_name,
                formatDistanceToNow(parseISO(u.creation_date), {
                  addSuffix: true,
                }),
                formatBytes(u.file_size),
                // const hours = Math.floor(totalTime / 3600);
                // const minutes = Math.floor((totalTime % 3600) / 60);
                // const seconds = Math.round(totalTime % 60);
                formatDuration(
                  {
                    hours: Math.floor(u.duration / 3600),
                    minutes: Math.floor((u.duration % 3600) / 60),
                    seconds: Math.round(u.duration % 60),
                  },
                  {
                    format: ['hours', 'minutes', 'seconds'],
                  }
                ),
                `$${u.cost}`,
                u.status,
                <>
                  {u.status !== 'processing' ? (
                    <CheckBox
                      checked={checkedUploads.some(
                        (cu) => cu.entry_id === u.entry_id
                      )}
                      setChecked={() => {
                        setCheckedUploads((draft) => {
                          const index = draft.findIndex(
                            (cu) => cu.entry_id === u.entry_id
                          );
                          if (index === -1) {
                            draft.push(u);
                          } else {
                            draft.splice(index, 1);
                          }
                        });
                      }}
                    />
                  ) : (
                    <Spinner />
                  )}
                  ,
                </>,
              ],
            }))}
          />

          <Button
            disabled={!hasFunds || checkedUploads.length === 0}
            fullWidth
            onClick={startTranscribing}
          >
            Transcribe{' '}
            {checkedUploads.length === 1
              ? 'file'
              : `${checkedUploads.length} files`}
          </Button>
          <br />
          <br />
          <br />
          <br />
          {/* )} */}
        </>
      )}
    </>
  );
};

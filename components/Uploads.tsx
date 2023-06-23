import {
  Button,
  CheckBox,
  H,
  P,
  Seperator,
  styled,
  useFrostbyte,
} from 'frostbyte';
import { CustomTable } from './CustomTable';
import { formatDistanceToNow, formatDuration, parseISO } from 'date-fns';
import { formatBytes } from 'utils/formatBytes';
import { useImmer } from 'use-immer';
import { useEffect, useState } from 'react';
import { COST_PER_SECOND } from 'utils/constants';
import { useGetBalanceQuery } from 'store/services/balance';
import { useRouter } from 'next/router';
import { CSSTransition } from 'react-transition-group';
import { Upload } from 'interfaces/Upload';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setTasksLoading, setUploads } from 'store/features/user';
import {
  useGetTranscribeStatusQuery,
  useTranscribeEntriesMutation,
} from 'store/services/transcribe';
import Spinner from './Spinner';
import { animateScroll as scroll } from 'react-scroll';
import { ButtonLink } from './ButtonLink';
import { TitleWithIconWrapper } from 'styles/shared';
import { CheckCircledIcon, PlayIcon, Cross1Icon } from '@radix-ui/react-icons';

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
  textAlign: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  boxShadow: '$colors$primary 0px 0px 3px 2px',
  background: '$purple3',
  color: '$primary',
  marginBottom: '20px',
  fontSize: 22,
  position: 'fixed',
  bottom: 0,
  // width: '100vw',
  width: 'calc(100% - 10vw)', // Subtract left and right padding
  zIndex: 1,

  '& p:first-child b:first-child': {
    color: '$tomato9',
  },
});

const CloseIcon = styled(Cross1Icon, {
  '&:hover': {
    cursor: 'pointer',
    transform: 'translateY(-2px)',
    backgroundColor: '$mauve5',
    padding: '2px',
  },
});

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

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;

  // const paginatedUploads = uploads
  //   .filter((u) => u.status !== 'complete')
  //   .slice(0, currentPage * itemsPerPage);

  // const uploadsCount = uploads.length;

  // const hasMore = uploads.length > currentPage * itemsPerPage;

  const { isFetching, isSuccess, data } = useGetTranscribeStatusQuery(
    { transcribeTaskId, entryKeys: checkedUploads.map((u) => u.entry_id) }, //this probabl shouldnt be checkedUploads cause now if user tries to transcribe something else it will create issues
    {
      pollingInterval: 1000,
      skip: !transcribeTaskId,
    }
  );

  useEffect(() => {
    dispatch(setUploads(ssUploads));
  }, []);

  const [transcribeEntries, { isLoading: transcribeEntriesLoading }] =
    useTranscribeEntriesMutation();

  const startTranscribing = async () => {
    dispatch(setTasksLoading(true));
    const selectedEntries = checkedUploads.map((u) => u.entry_id);
    try {
      const checkedUploadsAsProcessing: Upload[] = uploads.map((u) => {
        if (selectedEntries.includes(u.entry_id)) {
          return {
            ...u,
            status: 'processing',
          };
        } else {
          return u;
        }
      });

      dispatch(setUploads(checkedUploadsAsProcessing));

      const { instanceId } = await transcribeEntries({
        entryKeys: selectedEntries,
      }).unwrap();

      // we need to update uploads and remove the ones that are being transcribed

      const newUploads = uploads.filter(
        (u) => !selectedEntries.includes(u.entry_id)
      );

      dispatch(setUploads(newUploads));
      setCheckedUploads([]);

      scroll.scrollToTop({ duration: 200 });
      // setTranscribeTaskId(instanceId);
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

      const estimatedCost = Math.ceil(totalCost * 100) / 100;

      setCost(estimatedCost);

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

  const selectAll = () => {
    setCheckedUploads(uploads.filter((u) => u.status !== 'complete'));
  };
  const clearAll = () => {
    setCheckedUploads([]);
  };

  const TranscribeButton = () => (
    <Button
      disabled={
        !hasFunds || checkedUploads.length === 0 || transcribeEntriesLoading
      }
      fullWidth
      onClick={startTranscribing}
      loading={transcribeEntriesLoading}
      color="grass6"
      css={{
        zIndex: 10,
        display: 'grid',
        placeItems: 'center', //fix loading position
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <PlayIcon
          width={30}
          height={30}
          style={{
            marginTop: '3px',
          }}
        />
        <span>Start</span>
      </div>
    </Button>
  );

  const uploadsLength =
    uploads?.filter((u) => u.status !== 'complete' && u.status !== 'processing')
      .length || 0;

  return (
    <>
      {/* {cost > 0 && ( */}
      <CSSTransition
        in={cost > 0}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <PrimaryPanel>
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
            }}
          >
            <CloseIcon width={25} height={25} onClick={clearAll} />
          </div>
          <P
            css={{
              marginBottom: '10px',
            }}
          >
            Total cost: <b>${cost}</b>
          </P>
          <P>
            Audio duration: <b>{totalDuration}</b>
          </P>
          {!hasFunds ? (
            <ErrorPanel
              onClick={() => router.push('/balance')}
              css={{
                marginTop: '20px',
                marginBottom: 0,
              }}
            >
              Insufficient funds <span>click here</span> to add to your wallet
            </ErrorPanel>
          ) : (
            <>
              <P
                css={{
                  margin: '15px 0',
                }}
                color="mauve9"
                size="19"
              >
                Click to start transcribing{' '}
                {checkedUploads.length > 0
                  ? checkedUploads.length === 1
                    ? '1 file:'
                    : `${checkedUploads.length} files:`
                  : ''}
              </P>
              <TranscribeButton />
            </>
          )}
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
      {/* <h1>instanceID: {transcribeTaskId}</h1> */}
      {/* {isFetching && <div>FETCHING TRANSCRIBE STATUS</div>} */}
      {/* {isSuccess && <div>FETCHING RESULTS</div>} */}
      {/* {data && <>data: {JSON.stringify(data)}</>} */}
      {uploadsLength > 0 && (
        <>
          <TitleWithIconWrapper>
            <CheckCircledIcon width={30} height={30} />
            <H color="purple9">
              {uploadsLength} file{uploadsLength > 1 && 's'} ready:
            </H>
          </TitleWithIconWrapper>
          <P
            size="20"
            color="purple8"
            css={{
              '@mdMax': {
                marginBottom: '10px',
              },
            }}
          >
            Select the files you want to transcribe
          </P>
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                gap: '20px',
              }}
            >
              {checkedUploads.length > 0 && (
                <ButtonLink onClick={clearAll}>Clear all</ButtonLink>
              )}
              <ButtonLink onClick={selectAll}>Select all</ButtonLink>
            </div>
          </div>
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
            items={uploads
              .filter((u) => u.status !== 'complete')
              .filter((u) => u.status !== 'processing')
              .map((u) => ({
                entry_id: u.entry_id,
                data: [
                  u.file_name,
                  formatDistanceToNow(
                    parseISO(u.creation_date.replace(' ', 'T') + 'Z'),
                    {
                      addSuffix: true,
                    }
                  ),
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
                  </>,
                ],
              }))}
          />
          {/* {hasMore && (
            <Button onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
              See More
            </Button>
          )}
          {currentPage > 1 && (
            <Button
              onClick={() =>
                setCurrentPage((prevPage) =>
                  prevPage > 1 ? prevPage - 1 : prevPage
                )
              }
            >
              See Less
            </Button> */}
          {/* )} */}

          {/* <TranscribeButton /> */}
          {/* <br /> */}
          <Seperator color="purple8" css={{ marginTop: '25px' }} />

          <br />
          {/* )} */}
        </>
      )}
    </>
  );
};

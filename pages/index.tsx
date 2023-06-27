import { useState } from 'react';
import { useImmer } from 'use-immer';
import { Claims, getSession } from '@auth0/nextjs-auth0';
import FrostbyteLayout, {
  FrostByteWrapperWithoutRedux,
} from 'components/FrostbyteLayout';
import Head from 'next/head';
import { tryGoat } from 'utils/try';
import {
  MultipleUploadsStatus,
  UploadStatusFields,
} from 'interfaces/UploadStatus';
import { TranscribeResponse } from 'interfaces/TranscribeResponse';
import { Features } from 'components/Features';
import { GetServerSidePropsContext } from 'next';
import { CTABanner } from 'components/CTABanner';
import { useRouter } from 'next/router';
import { HeroSection } from 'components/home_page/hero_section';
import { event } from 'nextjs-google-analytics';

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const session = await getSession(ctx.req, ctx.res);

//   return {
//     props: {
//       user: session?.user || null,
//     },
//   };
// }

// type HomePageProps = {
//   user: Claims;
// };

// const Hero = styled('div', {
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   paddingTop: '3vh',
//   textAlign: 'center',
//   justifyContent: 'center',
//   position: 'relative',
//   zIndex: 1,
//   overflow: 'hidden',
// });

// const TryContainer = styled('div', {
//   display: 'flex',
//   flexDirection: 'column',
//   width: '100%',
//   marginTop: '30px',
//   marginBottom: '15px',
//   // background: 'rgb(153, 86, 213, 0.7)',
//   borderRadius: '5px',
//   // boxShadow: '$colors$purple6 0px 8px 5px 3px',
// });

// const HomePage = ({ user }: HomePageProps) => {
const HomePage = () => {
  const [response, setResponse] = useState<TranscribeResponse>(null);
  const [status, setStatus] = useImmer<MultipleUploadsStatus>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  // const updateStatus = (
  //   key: UploadStatusKey,
  //   statusUpdate: UploadStatusFields
  // ) => {
  //   setStatus((statuses) => {
  //     const newStatus = statuses[key];
  //     if (newStatus) {
  //       newStatus.currentStatus = statusUpdate.currentStatus;
  //       newStatus.description = statusUpdate.description;
  //       newStatus.timeTaken = statusUpdate.timeTaken;
  //     } else {
  //       return {
  //         ...statuses,
  //         [key]: statusUpdate,
  //       };
  //     }
  //   });
  // };

  const updateProgressStatus = (
    entryId: string,
    statusUpdate: UploadStatusFields
  ) => {
    setStatus((prevStatuses) => {
      const newStatuses = { ...prevStatuses };
      newStatuses[entryId] = {
        ...newStatuses[entryId],
        ...statusUpdate,
      };
      return newStatuses;
    });
  };

  const handleSubmit = async () => {
    setHasStarted(true);
    event('file', {
      category: 'try_goat',
    });
    await tryGoat({
      file: files[0],
      setResponse,
      updateStatus: updateProgressStatus,
    });
    setHasStarted(false);
  };

  return (
    <>
      <Head>
        <title>Transcribe audio or video to text online</title>
        <meta
          name="description"
          content="Transcribe audio or video to text online"
          key="description"
        />
        <meta
          property="og:title"
          content="Transcribe audio or video to text online"
        />
        <meta
          property="og:description"
          content="Transcribe audio or video to text online"
        />
        <meta
          property="og:image"
          content="https://goatranscribe.com/share-image.png"
        />
      </Head>

      <FrostByteWrapperWithoutRedux>
        <HeroSection
          setFiles={setFiles}
          status={status}
          handleSubmit={handleSubmit}
          hasStarted={hasStarted}
          files={files}
          response={response}
        />

        <Features />
        <CTABanner />
      </FrostByteWrapperWithoutRedux>
    </>
  );
};

export default HomePage;

import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { styled } from 'frostbyte';
import { makeRequestSS } from 'utils/makeRequestSS';
import { UploadFiles } from 'components/UploadFiles';
import { Uploads } from 'components/Uploads';
import { Upload } from 'interfaces/Upload';
import Head from 'next/head';
import { TasksStatus } from 'components/TasksStatus';
import { Settings } from 'interfaces/Settings';
import { useState } from 'react';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);

    const { data: uploads } = await makeRequestSS({
      req,
      res,
      endpoint: 'uploads',
    });
    // const uploads = data as Upload[];

    const { data: settings } = await makeRequestSS({
      req,
      res,
      endpoint: 'get_settings',
    });
    // const uploads = data as Upload[];

    // console.log('settings', settings);

    return {
      props: {
        user: session.user,
        ssUploads: (uploads as Upload[]) || [],
        ssSettings: (settings as Settings) || null,
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
  ssUploads: Upload[];
  ssSettings: Settings;
};

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Profile = ({ user, ssUploads, ssSettings }: HomePageProps) => {
  const [settings, setSettings] = useState<Settings>(ssSettings);

  // console.log('settings', settings);
  return (
    <>
      <Head>
        <title>Upload & Transcribe</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Layout>
          <TasksStatus user={user} />
          <Uploads ssUploads={ssUploads} />
          <UploadFiles settings={settings} setSettings={setSettings} />
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default Profile;

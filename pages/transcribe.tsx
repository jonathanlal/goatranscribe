import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { styled } from 'frostbyte';
import { makeRequestSS } from 'utils/makeRequestSS';
import { UploadFiles } from 'components/UploadFiles';
import { Uploads } from 'components/Uploads';
import { Upload } from 'interfaces/Upload';
import Head from 'next/head';
import { TasksStatus } from 'components/TasksStatus';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);

    const { data } = await makeRequestSS({
      req,
      res,
      endpoint: 'uploads',
    });
    const uploads = data as Upload[];

    return {
      props: {
        user: session.user,
        ssUploads: uploads || [],
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
  ssUploads: Upload[];
};

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Profile = ({ user, ssUploads }: HomePageProps) => {
  return (
    <>
      <Head>
        <title>Upload & Transcribe</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Layout>
          <TasksStatus user={user} />
          <Uploads ssUploads={ssUploads} />
          <UploadFiles />
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default Profile;

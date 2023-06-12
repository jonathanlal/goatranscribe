import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { H, P, Seperator, styled } from 'frostbyte';
import { makeRequestSS } from 'utils/makeRequestSS';
import { UploadFiles } from 'components/UploadFiles';
import { Uploads } from 'components/Uploads';
import { Upload } from 'interfaces/Upload';
import Head from 'next/head';
import { TasksStatus } from 'components/TasksStatus';
import { Settings } from 'interfaces/Settings';
import { useState } from 'react';
import { TitleWithIconWrapper } from 'styles/shared';
import { PersonIcon } from '@radix-ui/react-icons';
import { Contact } from 'components/support_page/contact';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);

    // const { data: uploads } = await makeRequestSS({
    //   req,
    //   res,
    //   endpoint: 'uploads',
    // });
    // const uploads = data as Upload[];

    // const { data: settings } = await makeRequestSS({
    //   req,
    //   res,
    //   endpoint: 'get_settings',
    // });
    // const uploads = data as Upload[];

    // console.log('settings', settings);

    return {
      props: {
        user: session.user,
        // ssUploads: (uploads as Upload[]) || [],
        // ssSettings: (settings as Settings) || null,
      },
    };
  },
});

type SupportPageProps = {
  user: Claims;
  ssUploads: Upload[];
  ssSettings: Settings;
};

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Support = ({ user }: SupportPageProps) => {
  //   const [settings, setSettings] = useState<Settings>(ssSettings);

  // console.log('settings', settings);
  return (
    <>
      <Head>
        <title>Help & Support</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Layout>
          <TitleWithIconWrapper>
            <PersonIcon width={30} height={30} /> <H color="purple9">Support</H>
          </TitleWithIconWrapper>

          <P
            size="20"
            color="purple8"
            css={{
              marginBottom: '20px',
            }}
          >
            For any problems, questions, or concerns.
          </P>
          <Seperator color="purple8" css={{ margin: '20px auto' }} />
          <Contact />
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default Support;

import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { CheckBox, H, P, Seperator, Switch, styled } from 'frostbyte';
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
import { EmailPreferences } from 'components/settings_page/emailPreferences';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);

    const { data: settings } = await makeRequestSS({
      req,
      res,
      endpoint: 'get_settings',
    });

    return {
      props: {
        user: session.user,
        ssSettings: (settings as Settings) || null,
      },
    };
  },
});

type SettingsPageProps = {
  user: Claims;
  ssSettings: Settings;
};

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Settings = ({ user, ssSettings }: SettingsPageProps) => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <FrostbyteLayout user={user}>
        <Layout>
          <EmailPreferences ssSettings={ssSettings} />
        </Layout>
      </FrostbyteLayout>
    </>
  );
};

export default Settings;

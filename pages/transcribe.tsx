import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { Button, styled } from 'frostbyte';
import { makeRequestSS } from 'utils/makeRequestSS';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parseISO from 'date-fns/parseISO';
import { useRouter } from 'next/router';
import { CustomTable } from 'components/CustomTable';
import { useDropzone } from 'react-dropzone';
import { UploadStatus } from 'interfaces/UploadStatus';
import { useImmer } from 'use-immer';
import { Dropzone } from 'components/Dropzone';
import { useState } from 'react';
import { useLazyGetUploadUrlQuery } from 'store/services/upload';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { UploadFiles } from 'components/UploadFiles';
import { Uploads } from 'components/Uploads';
import { Upload } from 'interfaces/Upload';

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
    console.log('data', data);

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
  const router = useRouter();

  return (
    <FrostbyteLayout user={user}>
      <Layout>
        <Uploads ssUploads={ssUploads} />
        <UploadFiles />
      </Layout>
    </FrostbyteLayout>
  );
};

export default Profile;

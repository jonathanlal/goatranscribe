import {
  Claims,
  getAccessToken,
  getSession,
  withPageAuthRequired,
} from '@auth0/nextjs-auth0';
import axios from 'axios';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { useMemo, useRef } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { makeRequestSS } from 'utils/makeRequestSS';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);

    const { data, error } = await makeRequestSS({
      req,
      res,
      endpoint: 'userTranscripts',
    });
    // const filesData = await response.json();

    return {
      props: {
        user: session.user,
        files: data || [],
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
  files: {
    file_name: string;
    creation_date: string;
    word_count: string;
  }[];
};

const Profile = ({ user, files }: HomePageProps) => {
  return (
    <FrostbyteLayout user={user}>
      {/* {user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.sid.toString()}</p>
          <p>{JSON.stringify(user)}</p>
          <h2>Transcripts:</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      )} */}
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Creation</Th>
            <Th>Word count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {files.map((file, index) => (
            <Tr key={index}>
              <Td>{file.file_name}</Td>
              <Td>{file.creation_date}</Td>
              <Td>{file.word_count}</Td>
            </Tr>
          ))}
          {/* <Tr>
            <Td>Tablescon</Td>
            <Td>9 April 2019</Td>
            <Td>East Annex</Td>
          </Tr> */}
        </Tbody>
      </Table>
    </FrostbyteLayout>
  );
};

export default Profile;

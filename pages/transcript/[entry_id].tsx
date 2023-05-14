import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { useRouter } from 'next/router';
import { makeRequestSS } from 'utils/makeRequestSS';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    const session = await getSession(req, res);

    const entry_id = query.entry_id;

    const { data, error } = await makeRequestSS({
      req,
      res,
      endpoint: 'transcript',
      params: { entry_id },
    });

    // console.log(data);

    return {
      props: {
        user: session.user,
        data: data || [],
      },
    };
  },
});

const Transcript = ({
  user,
  data,
}: {
  user: Claims;
  data: {
    transcript_content: string;
  };
}) => {
  const router = useRouter();
  const { entry_id } = router.query;

  return (
    <FrostbyteLayout user={user}>
      <p>{data.transcript_content}</p>
      <p>{entry_id}</p>- button to add paragraphs to a transcript with chatgpt -
      button to translate to different language - button to download transcript
      (in different formats) - button to make summary with chatgpt
      <span>hey</span>
    </FrostbyteLayout>
  );
};

export default Transcript;

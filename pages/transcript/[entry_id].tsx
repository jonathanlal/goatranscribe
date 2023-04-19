import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { useRouter } from 'next/router';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);

    return {
      props: {
        user: session.user,
      },
    };
  },
});

const Transcript = ({ user }: { user: Claims }) => {
  const router = useRouter();
  const { entry_id } = router.query;

  return (
    <FrostbyteLayout user={user}>
      <p>{entry_id}</p>
      <span>hey</span>
    </FrostbyteLayout>
  );
};

export default Transcript;

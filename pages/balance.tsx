import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { H, Toast, styled, Tabs } from 'frostbyte';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { ReactNode, useEffect, useState } from 'react';
import { Checkout } from 'components/Checkout';
import { makeRequestSS } from 'utils/makeRequestSS';
import { Transactions } from 'components/Transactions';
import { Amounts } from 'components/Amounts';
import BlockUi from '@availity/block-ui';
import '@availity/block-ui/dist/index.css';
import { useRouter } from 'next/router';
import 'react-loading-skeleton/dist/skeleton.css';
import Head from 'next/head';

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = await getSession(req, res);
    const intentId = ctx.query.intent_id;

    if (intentId) {
      const { data } = await makeRequestSS({
        req,
        res,
        params: { intent_id: intentId },
        endpoint: 'validate_payment',
      });

      if (data.error) {
        return {
          props: {
            user: session.user,
            error: data.error,
            success: null,
          },
        };
      }
      return {
        props: {
          user: session.user,
          success: data.balance,
          error: null,
        },
      };
    }
    return {
      props: {
        user: session.user,
        success: null,
        error: null,
      },
    };
  },
});

type HomePageProps = {
  user: Claims;
  error?: string | null;
  success?: string | null;
};

const Layout = styled('div', {
  padding: '6vw 5vw',
  minHeight: '100vh',
});

const Panel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '5px',
  gap: '10px',
  padding: '20px',
  marginBottom: '20px',

  variants: {
    kind: {
      error: {
        background: '$tomato4',
        color: '$tomato9',
        boxShadow: '$colors$tomato7 0px 0px 3px 2px',
      },
      success: {
        background: '$green4',
        color: '$green9',
        boxShadow: '$colors$green7 0px 0px 3px 2px',
      },
    },
  },
});

const Balance = ({ user, error, success }: HomePageProps) => {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState<
    'error' | 'success' | null
  >(error ? 'error' : success ? 'success' : null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isUILoading, setIsUILoading] = useState(true);

  //remove query params from url
  const router = useRouter();
  useEffect(() => {
    const { pathname } = router;
    router.replace({ pathname, query: {} }, undefined, { shallow: true });

    // setIsUILoading(true);
  }, []);

  return (
    <>
      <Head>
        <title>Balance & Transactions</title>
      </Head>

      <FrostbyteLayout user={user}>
        <Layout>
          <Tabs
            tabContent={[
              {
                header: 'Add Funds',
                content: (
                  <>
                    {transactionStatus && (
                      <Panel
                        kind={
                          transactionStatus === 'error' ? 'error' : 'success'
                        }
                      >
                        {transactionStatus === 'error' ? (
                          <ExclamationTriangleIcon width={30} height={30} />
                        ) : (
                          <div>🎉</div>
                        )}
                        {transactionStatus === 'error' ? error : success}
                      </Panel>
                    )}
                    {/* <H>Select amount</H> */}
                    <BlockUi blocking={isSubmitLoading}>
                      <Amounts
                        selectedAmount={selectedAmount}
                        setSelectedAmount={setSelectedAmount}
                        isUILoading={isUILoading}
                      />
                      <Checkout
                        amount={selectedAmount}
                        isSubmitLoading={isSubmitLoading}
                        setIsSubmitLoading={setIsSubmitLoading}
                        setIsUILoading={setIsUILoading}
                        isUILoading={isUILoading}
                      />
                    </BlockUi>
                  </>
                ) as ReactNode,
              },
              {
                header: 'Transactions',
                content: <Transactions />,
              },
            ]}
          />

          {/* <Transactions /> */}
        </Layout>
        {transactionStatus && (
          <Toast
            title={transactionStatus === 'error' ? 'Error' : 'Success'}
            description={transactionStatus === 'error' ? error : success}
            show={transactionStatus !== null}
            duration={5000}
            setShow={() => setTransactionStatus(null)}
            kind={transactionStatus === 'error' ? 'error' : 'success'}
          />
        )}
      </FrostbyteLayout>
    </>
  );
};

export default Balance;

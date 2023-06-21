import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { useAddCreditQuery } from 'store/services/balance';
import { Payment } from './Payment';
import { P, styled, useFrostbyte } from 'frostbyte';
import Spinner from './Spinner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Panel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '5px',
  margin: '20px 0px',
  gap: '10px',
  padding: '10px',
  boxShadow: '0px 0px 0px 1px $colors$mauve6',
  background: '$mauve2',
  // color: '$mauve4',

  '& span': {
    color: '$green9',
    fontWeight: 'bold',
  },

  variants: {
    isDarkTheme: {
      true: {
        backgroundColor: '$mauve1',
      },
      false: {
        backgroundColor: '$mauve2',
      },
    },
  },
});

export const Checkout = ({
  amount,
  isSubmitLoading,
  setIsSubmitLoading,
  isUILoading,
  setIsUILoading,
}: {
  amount: number;
  isSubmitLoading: boolean;
  setIsSubmitLoading: (value: boolean) => void;
  isUILoading: boolean;
  setIsUILoading: (value: boolean) => void;
}) => {
  const intentIdRef = useRef('');

  const { isDarkTheme } = useFrostbyte();

  useEffect(() => {
    setIsUILoading(true);
  }, [isDarkTheme]);

  const stripeTheme = isDarkTheme ? 'night' : 'stripe';
  const stripeVariables: Appearance['variables'] = isDarkTheme
    ? {
        colorPrimary: '#BE93E4',
        colorBackground: '#161618',
        fontSizeBase: '20px',
      }
    : {
        colorPrimary: '#BE93E4',
        colorBackground: '#f9f9fa',
        fontSizeBase: '20px',
      };
  const { data, isFetching, isSuccess } = useAddCreditQuery(
    {
      amount,
      intent_id: intentIdRef.current,
    },
    {
      skip: amount === 0,
    }
  );

  useEffect(() => {
    if (isSuccess && data?.intent_id && intentIdRef.current === '') {
      intentIdRef.current = data.intent_id;
    }
  }, [isSuccess]);

  const stripePublicKey =
    process.env.NODE_ENV === 'production'
      ? 'pk_live_dHfFgIjzMmL8xvcJvyCHXu5D'
      : 'pk_test_5JMTryWGwKh5mKuAXA09UVQK';

  const stripePromise = loadStripe(stripePublicKey);
  return (
    <div
      style={{
        minHeight: '400px',
      }}
    >
      <SkeletonTheme
        baseColor={isDarkTheme ? '#161618' : ''}
        highlightColor={isDarkTheme ? '#1F1F1F' : ''}
      >
        {isUILoading && (
          <Skeleton
            width="100%"
            height="40px"
            style={{
              marginTop: '20px',
            }}
          />
        )}
        {/* <div
        style={{
          minHeight: '200px',
        }}
      > */}
        {data ? (
          <>
            <Panel isDarkTheme={isDarkTheme}>
              <P
                color="mauve9"
                size="20"
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Adding{' '}
                {isFetching ? (
                  <Spinner />
                ) : (
                  <span>${data.registered_amount}</span>
                )}{' '}
                to your account
              </P>
            </Panel>
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: data.client_secret,
                appearance: {
                  theme: stripeTheme,
                  variables: stripeVariables,
                },
              }}
            >
              <Payment
                amount={amount}
                intentId={data.intent_id}
                isSubmitLoading={isSubmitLoading}
                setIsSubmitLoading={setIsSubmitLoading}
                isUILoading={isUILoading}
                setIsUILoading={setIsUILoading}
              />
            </Elements>
          </>
        ) : (
          <Skeleton
            width="100%"
            height="267px"
            style={{
              marginTop: '20px',
            }}
          />
        )}
        {/* </div> */}
        {isUILoading && (
          <Skeleton
            width="100%"
            height="49px"
            style={{
              marginTop: '20px',
            }}
          />
        )}
      </SkeletonTheme>
    </div>
  );
};

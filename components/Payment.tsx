import {
  PaymentElement,
  PaymentMethodMessagingElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Toast, styled } from 'frostbyte';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const StyledPaymentElement = styled(PaymentElement, {
  //   minHeight: '260px',
});

export const Payment = ({
  amount,
  intentId,
  isSubmitLoading,
  setIsSubmitLoading,
  isUILoading,
  setIsUILoading,
}: {
  amount: number;
  intentId: string;
  isSubmitLoading: boolean;
  setIsSubmitLoading: (value: boolean) => void;
  setIsUILoading: (value: boolean) => void;
  isUILoading: boolean;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);

  useEffect(() => {
    if (!stripe && !elements) setIsUILoading(true);
    else setIsUILoading(false);
  }, [stripe, elements]);

  //   const [isPaymentElementLoading, setIsPaymentElementLoading] = useState(true);

  const handleSubmit = async (event) => {
    setIsSubmitLoading(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/balance?intent_id=${intentId}`,
      },
    });

    if (error) {
      setIsSubmitLoading(false);
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <>
      {/* <div
        style={{
          position: 'relative',
          minHeight: '400px',
        }}
      >
        {(isUILoading || !isPaymentElementReady) && (
          <div
            style={{
              position: 'absolute',
            }}
          >
            <Skeleton
              width="100%"
              height="267px"
              style={{
                position: 'relative',
                // top: 50,
              }}
            />

            <Skeleton
              width="100%"
              height="49px"
              style={{
                position: 'relative',
                marginTop: '25px',
                // top: 342,
              }}
            />
          </div>
        )} */}

      <form
        onSubmit={handleSubmit}
        style={
          {
            //   position: 'relative',
            //   minHeight: '200px',
          }
        }
      >
        {/* <PaymentMethodMessagingElement
          options={{
            currency: 'USD',
            countryCode: 'US',
            amount,
            paymentMethods: ['klarna'],
          }}
        /> */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <StyledPaymentElement
            onReady={() => {
              setIsPaymentElementReady(true);
              setIsUILoading(false);
            }}
            //   onLoaderStart={() => setIsUILoading(true)}
            options={{
              layout: 'accordion',
              wallets: {
                applePay: 'auto',
                googlePay: 'auto',
              },
              paymentMethodOrder: ['apple_pay', 'google_pay', 'card', 'klarna'],
            }}
          />

          {!isUILoading && isPaymentElementReady && (
            <Button
              type="submit"
              loading={isSubmitLoading}
              color="purple5"
              // outlined
              fullWidth
              css={{
                //   color: '$primaryContrast',
                // zIndex: 10,
                display: 'grid',
                placeItems: 'center', //fix loading position
                // '@mdMin': {
                //   marginTop: '25px',
                // },
                // '@mdMax': {
                //   marginTop: '-10px',
                // },
              }}
            >
              ✨ Add Funds
            </Button>
          )}
        </div>

        <Toast
          setShow={setErrorMessage}
          show={errorMessage}
          kind="error"
          title={errorMessage}
        />
      </form>
      {/* </div> */}
    </>
  );
};

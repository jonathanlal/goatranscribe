import 'styles/global.css';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'store/store';
import FrostbyteLayout from 'components/FrostbyteLayout';
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  // const [isPersistorLoaded, setIsPersistorLoaded] = useState(false);
  // if (typeof window !== 'undefined') {
  //   window
  //     .matchMedia('(prefers-color-scheme: dark)')
  //     .addEventListener('change', (event) => {
  //       const newColorScheme = event.matches ? 'dark' : 'light';
  //       console.log('newColorScheme', newColorScheme);
  //     });
  // }
  return (
    <ParallaxProvider>
      {/* <Provider store={store}> */}
      <UserProvider>
        {/* {typeof window !== 'undefined' ? (
            <PersistGate persistor={persistor} loading={null}>
              <FrostbyteLayout user={null}>
                <Component {...pageProps} />
              </FrostbyteLayout>
            </PersistGate>
          ) : ( */}

        <Component {...pageProps} />

        {/* )} */}
      </UserProvider>
      {/* </Provider> */}
    </ParallaxProvider>
  );
}

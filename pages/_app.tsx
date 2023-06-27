import 'styles/global.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ParallaxProvider } from 'react-scroll-parallax';
import { Inter } from 'next/font/google';
import { GoogleAnalytics } from 'nextjs-google-analytics';

const inter = Inter({ weight: '400', subsets: ['latin'] });

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
        {/* <style jsx global>{`
          html {
            font-family: ${aclonica.style.fontFamily};
          }
        `}</style> */}
        <main className={inter.className}>
          <GoogleAnalytics trackPageViews />
          <Component {...pageProps} />
        </main>
        {/* )} */}
      </UserProvider>
      {/* </Provider> */}
    </ParallaxProvider>
  );
}

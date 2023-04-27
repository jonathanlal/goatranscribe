import 'styles/global.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ParallaxProvider } from 'react-scroll-parallax';

export default function App({ Component, pageProps }) {
  return (
    <ParallaxProvider>
      <UserProvider loginUrl="/login" profileUrl="/profile">
        <Component {...pageProps} />
      </UserProvider>
    </ParallaxProvider>
  );
}

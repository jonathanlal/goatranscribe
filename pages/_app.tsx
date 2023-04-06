import 'styles/global.css';
import { FrostbyteProvider, styled } from 'frostbyte';
import { useState } from 'react';
import { loggedInNavBar, loggedOutNavBar } from 'config/navbar';
import { Logo } from 'components/Logo';
import { footerItems } from 'config/footer';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useUser } from '@auth0/nextjs-auth0/client';

function AppContent({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);
  const { user, error, isLoading } = useUser();

  return (
    <FrostbyteProvider
      isDarkThemeActive={darkMode}
      footer={{
        footerItems: footerItems,
        name: 'Ninja Transcribe',
      }}
      navMenu={{
        navItems: user ? loggedInNavBar : loggedOutNavBar,
        logo: {
          comp: <Logo />,
        },
        setDarkMode: setDarkMode,
      }}
    >
      <Component {...pageProps} />
    </FrostbyteProvider>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </UserProvider>
  );
}

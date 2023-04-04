import 'styles/global.css';
import { FrostbyteProvider, styled } from 'frostbyte';
import { useState } from 'react';
import { loggedOutNavBar } from 'config/navbar';
import { Logo } from 'components/Logo';
import { footerItems } from 'config/footer';

export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <FrostbyteProvider
      isDarkThemeActive={darkMode}
      footer={{
        footerItems: footerItems,
        name: 'Seek The Sage',
      }}
      navMenu={{
        navItems: loggedOutNavBar,
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

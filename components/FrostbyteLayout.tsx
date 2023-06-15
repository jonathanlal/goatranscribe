import { FrostbyteProvider, NavMenuProps } from 'frostbyte';
import { useEffect, useState } from 'react';
import { loggedInNavBar, loggedOutNavBar } from 'config/navbar';
import { Logo } from 'components/Logo';
import { loggedInFooterItems, loggedOutfooterItems } from 'config/footer';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setDarkMode } from 'store/features/settings';
import { Provider } from 'react-redux';
import { persistor, store } from 'store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useGetBalanceQuery } from 'store/services/balance';
import { useRouter } from 'next/router';

export default function FrostbyteLayout({ children, user }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={'LOADING'}>
        <FrostByteWrapper user={user}>{children}</FrostByteWrapper>
      </PersistGate>
    </Provider>
  );
}

const FrostByteWrapper = ({ children, user }) => {
  const { darkMode } = useAppSelector((state) => state.settings);
  const dispath = useAppDispatch();
  const router = useRouter();

  // Listen for changes in OS theme
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      console.log('OsTheme on change', event.matches);
      dispath(setDarkMode(event.matches));
    });

  let navItems: NavMenuProps['navItems'];
  if (user) {
    const { data } = useGetBalanceQuery();
    // console.log('balance', data);
    navItems = loggedInNavBar(user, data);
  } else {
    navItems = loggedOutNavBar;
  }

  return (
    <FrostbyteProvider
      isDarkThemeActive={darkMode}
      footer={{
        footerItems: user
          ? loggedInFooterItems({ darkMode })
          : loggedOutfooterItems({ darkMode }),
        name: 'Goatranscribe',
      }}
      navMenu={{
        navItems: user ? navItems : loggedOutNavBar,
        logo: {
          comp: <Logo isDarkMode={darkMode} />,
          href: user ? '/transcribe' : '/',
          title: 'Goatranscribe',
        },
        setDarkMode: () => dispath(setDarkMode(!darkMode)),
      }}
    >
      {children}
    </FrostbyteProvider>
  );
};

import { FrostbyteProvider } from 'frostbyte';
import { useState } from 'react';
import { loggedInNavBar, loggedOutNavBar } from 'config/navbar';
import { Logo } from 'components/Logo';
import { footerItems } from 'config/footer';

export default function FrostbyteLayout({ children, user }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <FrostbyteProvider
      isDarkThemeActive={darkMode}
      footer={{
        footerItems: footerItems,
        name: 'Goatranscribe',
      }}
      navMenu={{
        navItems: user ? loggedInNavBar : loggedOutNavBar,
        logo: {
          comp: <Logo />,
        },
        setDarkMode: setDarkMode,
      }}
    >
      {children}
    </FrostbyteProvider>
  );
}
